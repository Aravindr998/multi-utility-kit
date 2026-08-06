"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { canvasToBlob, loadImageFromFile } from "@/lib/image";
import { downloadBlob, formatBytes } from "@/lib/format";

type Item = { id: string; file: File; img: HTMLImageElement; thumb: string; w: number; h: number };
type PageSize = "a4" | "letter" | "fit";
type Orientation = "auto" | "portrait" | "landscape";

// Page dimensions in points (1/72 inch).
const PAGE_PT: Record<Exclude<PageSize, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export default function ImageToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [marginMm, setMarginMm] = useState(10);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setItems([]);
    setResult(null);
    setError(null);
  };

  const onFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    const added: Item[] = [];
    for (const file of files) {
      try {
        const img = await loadImageFromFile(file);
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const scale = Math.min(1, 160 / Math.max(w, h));
        const c = document.createElement("canvas");
        c.width = Math.round(w * scale);
        c.height = Math.round(h * scale);
        c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
        added.push({ id: `${file.name}-${Date.now()}-${Math.random()}`, file, img, thumb: c.toDataURL("image/jpeg", 0.7), w, h });
      } catch {
        setError(`Could not read "${file.name}".`);
      }
    }
    setItems((prev) => [...prev, ...added]);
  };

  const move = (i: number, dir: -1 | 1) => {
    setResult(null);
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const remove = (id: string) => {
    setResult(null);
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Encode a source image to JPEG data (flattened on white) for embedding.
  const encode = async (it: Item): Promise<string> => {
    const c = document.createElement("canvas");
    c.width = it.w;
    c.height = it.h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, it.w, it.h);
    ctx.drawImage(it.img, 0, 0);
    const blob = await canvasToBlob(c, "image/jpeg", 0.9);
    return await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(blob);
    });
  };

  const build = async () => {
    if (items.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const { jsPDF } = await import("jspdf");
      const marginPt = (marginMm / 25.4) * 72;
      let pdf: import("jspdf").jsPDF | null = null;

      for (const it of items) {
        const landscape = orientation === "auto" ? it.w > it.h : orientation === "landscape";
        let pageW: number;
        let pageH: number;
        if (pageSize === "fit") {
          pageW = it.w * 0.75; // px → pt at 96dpi
          pageH = it.h * 0.75;
        } else {
          const [pw, ph] = PAGE_PT[pageSize];
          pageW = landscape ? ph : pw;
          pageH = landscape ? pw : ph;
        }

        if (!pdf) {
          pdf = new jsPDF({ unit: "pt", format: [pageW, pageH], orientation: pageW > pageH ? "landscape" : "portrait" });
        } else {
          pdf.addPage([pageW, pageH], pageW > pageH ? "landscape" : "portrait");
        }

        const m = pageSize === "fit" ? 0 : marginPt;
        const availW = pageW - m * 2;
        const availH = pageH - m * 2;
        const scale = Math.min(availW / it.w, availH / it.h);
        const drawW = it.w * scale;
        const drawH = it.h * scale;
        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;
        const data = await encode(it);
        pdf.addImage(data, "JPEG", x, y, drawW, drawH);
      }

      const blob = pdf!.output("blob");
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build the PDF.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    downloadBlob(result.blob, "images.pdf");
  };

  const chip = (active: boolean) => ({
    background: active ? "var(--brand)" : "var(--surface-2)",
    color: active ? "var(--on-brand)" : "var(--foreground)",
    border: "1px solid var(--border)",
  });

  return (
    <div className="space-y-4">
      <FileDropzone accept="image/*,.heic,.heif" multiple onFiles={onFiles} icon="🖼️" label="Drop images to combine into a PDF" hint="JPG, PNG, WebP or HEIC · add as many as you like" />

      {items.length > 0 && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-medium">{items.length} image{items.length > 1 ? "s" : ""} · one per page</p>
            <button className="btn btn-secondary" onClick={reset}>Clear all</button>
          </div>

          <ul className="mb-5 space-y-2">
            {items.map((it, i) => (
              <li key={it.id} className="flex items-center gap-3 rounded-lg p-2" style={{ background: "var(--surface-2)" }}>
                <span className="w-6 text-center text-sm text-[var(--muted)]">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.thumb} alt="" className="h-12 w-12 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.file.name}</p>
                  <p className="text-xs text-[var(--muted)]">{it.w}×{it.h}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-2 py-1 text-sm disabled:opacity-30" style={{ border: "1px solid var(--border)" }} aria-label="Move up">↑</button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded px-2 py-1 text-sm disabled:opacity-30" style={{ border: "1px solid var(--border)" }} aria-label="Move down">↓</button>
                  <button onClick={() => remove(it.id)} className="rounded px-2 py-1 text-sm" style={{ border: "1px solid var(--border)", color: "var(--danger)" }} aria-label="Remove">✕</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Page size</label>
              <div className="flex flex-wrap gap-2">
                {([["a4", "A4"], ["letter", "Letter"], ["fit", "Fit to image"]] as [PageSize, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => { setPageSize(v); setResult(null); }} className="rounded-lg px-3 py-1.5 text-sm font-semibold" style={chip(pageSize === v)}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Orientation</label>
              <div className="flex flex-wrap gap-2">
                {([["auto", "Auto"], ["portrait", "Portrait"], ["landscape", "Landscape"]] as [Orientation, string][]).map(([v, l]) => (
                  <button key={v} onClick={() => { setOrientation(v); setResult(null); }} disabled={pageSize === "fit"} className="rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-40" style={chip(orientation === v && pageSize !== "fit")}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {pageSize !== "fit" && (
            <div className="mt-4">
              <label className="label" htmlFor="mg">Page margin: {marginMm} mm</label>
              <input id="mg" type="range" min={0} max={30} step={1} value={marginMm} onChange={(e) => { setMarginMm(parseInt(e.target.value)); setResult(null); }} className="w-full accent-[var(--brand)]" />
            </div>
          )}

          <div className="mt-5">
            {busy ? <ProgressIndicator label="Building PDF…" /> : <button className="btn btn-primary" onClick={build}>Create PDF</button>}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && (
        <ResultCard
          title="PDF ready"
          stats={[{ label: "Pages", value: String(items.length) }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={download}
          downloadLabel="Download PDF"
          onReset={reset}
        />
      )}
    </div>
  );
}
