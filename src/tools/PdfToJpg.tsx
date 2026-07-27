"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";
import { getPdfjs } from "@/lib/pdfjs";

type Dir = "pdf2jpg" | "jpg2pdf";

export default function PdfToJpg() {
  const [dir, setDir] = useState<Dir>("pdf2jpg");
  const [files, setFiles] = useState<File[]>([]);
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; name: string; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const onFiles = (incoming: File[]) => {
    setResult(null);
    setError(null);
    if (dir === "pdf2jpg") setFiles([incoming[0]]);
    else setFiles((prev) => [...prev, ...incoming.filter((f) => /image\/(jpeg|png|webp)/.test(f.type))]);
  };

  const switchDir = (d: Dir) => {
    setDir(d);
    reset();
  };

  const pdfToJpg = async () => {
    const file = files[0];
    const pdfjs = await getPdfjs();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const images: { name: string; blob: Blob }[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      const blob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("render failed"))), "image/jpeg", 0.92));
      images.push({ name: `page-${String(n).padStart(3, "0")}.jpg`, blob });
      setProgress((n / doc.numPages) * 100);
    }
    if (images.length === 1) {
      setResult({ blob: images[0].blob, name: file.name.replace(/\.pdf$/i, "") + ".jpg", label: "1 image" });
    } else {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      images.forEach((im) => zip.file(im.name, im.blob));
      const blob = await zip.generateAsync({ type: "blob" });
      setResult({ blob, name: file.name.replace(/\.pdf$/i, "") + "-images.zip", label: `${images.length} images` });
    }
  };

  const jpgToPdf = async () => {
    const out = await PDFDocument.create();
    let i = 0;
    for (const f of files) {
      const bytes = new Uint8Array(await f.arrayBuffer());
      let img;
      if (f.type === "image/png") img = await out.embedPng(bytes);
      else if (f.type === "image/jpeg") img = await out.embedJpg(bytes);
      else {
        // Convert webp → png via canvas first.
        const url = URL.createObjectURL(f);
        const el = new Image();
        el.src = url;
        await el.decode();
        const c = document.createElement("canvas");
        c.width = el.naturalWidth;
        c.height = el.naturalHeight;
        c.getContext("2d")!.drawImage(el, 0, 0);
        const pngBlob: Blob = await new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
        img = await out.embedPng(new Uint8Array(await pngBlob.arrayBuffer()));
        URL.revokeObjectURL(url);
      }
      const page = out.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      i++;
      setProgress((i / files.length) * 100);
    }
    const saved = await out.save();
    setResult({ blob: new Blob([saved as BlobPart], { type: "application/pdf" }), name: "images.pdf", label: `${files.length} page(s)` });
  };

  const run = async () => {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      if (dir === "pdf2jpg") await pdfToJpg();
      else await jpgToPdf();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Tab active={dir === "pdf2jpg"} onClick={() => switchDir("pdf2jpg")} label="PDF → JPG" />
        <Tab active={dir === "jpg2pdf"} onClick={() => switchDir("jpg2pdf")} label="Images → PDF" />
      </div>

      {(dir === "pdf2jpg" ? files.length === 0 : true) && (
        <FileDropzone
          accept={dir === "pdf2jpg" ? "application/pdf" : "image/jpeg,image/png,image/webp"}
          multiple={dir === "jpg2pdf"}
          onFiles={onFiles}
          icon={dir === "pdf2jpg" ? "📄" : "🖼️"}
          label={dir === "pdf2jpg" ? "Drop a PDF" : "Drop images (JPG/PNG/WebP)"}
          hint={dir === "pdf2jpg" ? "Each page becomes a JPG" : "Combined into one PDF, in order"}
        />
      )}

      {files.length > 0 && (
        <div className="card p-4">
          <p className="mb-2 text-sm text-[var(--muted)]">{files.length} file(s) selected</p>
          <ul className="mb-3 space-y-2 text-sm">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                {f.type === "application/pdf" && <PdfThumbnail file={f} width={36} />}
                <span className="min-w-0 flex-1 truncate">{f.name}</span>
                <span className="text-[var(--muted)]">{formatBytes(f.size)}</span>
              </li>
            ))}
          </ul>

          {dir === "pdf2jpg" && (
            <div className="mb-3">
              <label className="label" htmlFor="scale">Resolution: {scale}× {scale >= 3 ? "(high)" : scale <= 1 ? "(low)" : ""}</label>
              <input id="scale" type="range" min={1} max={4} step={0.5} value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-[var(--brand)]" />
            </div>
          )}

          {busy ? <ProgressIndicator value={progress} label="Converting…" /> : (
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={run}>Convert</button>
              <button className="btn btn-secondary" onClick={reset}>Clear</button>
            </div>
          )}
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && (
        <ResultCard
          title="Conversion complete"
          stats={[{ label: "Output", value: result.label }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel={`Download ${result.name.split(".").pop()?.toUpperCase()}`}
          onReset={reset}
        />
      )}
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-semibold"
      style={{ background: active ? "var(--brand)" : "var(--surface-2)", color: active ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
    >
      {label}
    </button>
  );
}
