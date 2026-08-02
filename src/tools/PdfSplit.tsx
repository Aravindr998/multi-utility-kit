"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";

type Mode = "range" | "each";

/** Parse "1-3, 5, 8-10" into a 0-based, de-duplicated, ordered page index list. */
function parseRanges(input: string, pageCount: number): number[] {
  const result: number[] = [];
  const seen = new Set<number>();
  for (const part of input.split(",")) {
    const token = part.trim();
    if (!token) continue;
    const m = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let a = parseInt(m[1]);
      let b = parseInt(m[2]);
      if (a > b) [a, b] = [b, a];
      for (let p = a; p <= b; p++) if (p >= 1 && p <= pageCount && !seen.has(p)) { seen.add(p); result.push(p - 1); }
    } else if (/^\d+$/.test(token)) {
      const p = parseInt(token);
      if (p >= 1 && p <= pageCount && !seen.has(p)) { seen.add(p); result.push(p - 1); }
    }
  }
  return result;
}

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("");
  const [mode, setMode] = useState<Mode>("range");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; name: string; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRanges("");
    setResult(null);
    setError(null);
  };

  const onFiles = async (files: File[]) => {
    reset();
    const f = files[0];
    setFile(f);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      setRanges(`1-${doc.getPageCount()}`);
    } catch {
      setError("Could not read this PDF.");
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });

      if (mode === "range") {
        const indices = parseRanges(ranges, pageCount);
        if (indices.length === 0) throw new Error("No valid pages in that range.");
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, indices);
        pages.forEach((p) => out.addPage(p));
        const saved = await out.save();
        setResult({
          blob: new Blob([saved as BlobPart], { type: "application/pdf" }),
          name: "extracted-pages.pdf",
          label: `${indices.length} page(s) extracted`,
        });
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        for (let i = 0; i < pageCount; i++) {
          const out = await PDFDocument.create();
          const [page] = await out.copyPages(src, [i]);
          out.addPage(page);
          const saved = await out.save();
          zip.file(`page-${String(i + 1).padStart(3, "0")}.pdf`, saved);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        setResult({ blob, name: "split-pages.zip", label: `${pageCount} single-page PDFs` });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not split this PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf" onFiles={onFiles} icon="✂️" label="Drop a PDF to split" hint="Extract pages or split every page" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <PdfThumbnail file={file} width={48} />
              <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {pageCount} pages</span></p>
            </div>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <div className="mb-4 flex gap-2">
            <ModeBtn active={mode === "range"} onClick={() => setMode("range")} label="Extract page range" />
            <ModeBtn active={mode === "each"} onClick={() => setMode("each")} label="Each page separately" />
          </div>

          {mode === "range" ? (
            <div>
              <label className="label" htmlFor="r">Pages to extract</label>
              <input id="r" className="input" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="e.g. 1-3, 5, 8-10" />
              <p className="mt-1 text-xs text-[var(--muted)]">Comma-separated pages and ranges. This PDF has {pageCount} pages.</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">Every page becomes its own PDF, delivered as a ZIP archive.</p>
          )}

          <div className="mt-4">
            {busy ? <ProgressIndicator label="Splitting…" /> : <button className="btn btn-primary" onClick={run}>Split PDF</button>}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && (
        <ResultCard
          title="Split complete"
          stats={[{ label: "Output", value: result.label }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel={`Download ${result.name.endsWith(".zip") ? "ZIP" : "PDF"}`}
          onReset={reset}
        />
      )}
    </div>
  );
}

function ModeBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-semibold"
      style={{ background: active ? "var(--brand)" : "var(--surface-2)", color: active ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}
    >
      {label}
    </button>
  );
}
