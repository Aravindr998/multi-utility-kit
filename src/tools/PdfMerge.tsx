"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (incoming: File[]) => {
    setResult(null);
    setError(null);
    setFiles((prev) => [...prev, ...incoming.filter((f) => f.type === "application/pdf")]);
  };

  const move = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setResult(null);
  };

  const removeAt = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setResult(null);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const merged = await out.save();
      setResult({ blob: new Blob([merged as BlobPart], { type: "application/pdf" }) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not merge these PDFs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDropzone
        accept="application/pdf"
        multiple
        onFiles={addFiles}
        icon="📄"
        label="Drop PDF files here"
        hint="Add two or more PDFs to merge"
      />

      {files.length > 0 && (
        <div className="card p-4">
          <p className="mb-3 text-sm text-[var(--muted)]">{files.length} file(s) · drag order with the arrows</p>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background: "var(--surface-2)" }}>
                <span className="grid h-6 w-6 place-items-center rounded text-xs font-bold text-white" style={{ background: "var(--brand)" }}>{i + 1}</span>
                <PdfThumbnail file={f} width={36} />
                <span className="min-w-0 flex-1 truncate text-sm">{f.name}</span>
                <span className="text-xs text-[var(--muted)]">{formatBytes(f.size)}</span>
                <button aria-label="Move up" className="px-1.5 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                <button aria-label="Move down" className="px-1.5 disabled:opacity-30" disabled={i === files.length - 1} onClick={() => move(i, 1)}>↓</button>
                <button aria-label="Remove" className="px-1.5 text-[var(--danger)]" onClick={() => removeAt(i)}>✕</button>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            {busy ? (
              <ProgressIndicator label="Merging…" />
            ) : (
              <button className="btn btn-primary" disabled={files.length < 2} onClick={merge}>
                Merge {files.length >= 2 ? files.length : ""} PDFs
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && (
        <ResultCard
          title="Merged PDF"
          stats={[{ label: "Files merged", value: String(files.length) }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, "merged.pdf")}
          downloadLabel="Download merged PDF"
          onReset={() => { setFiles([]); setResult(null); }}
        />
      )}
    </div>
  );
}
