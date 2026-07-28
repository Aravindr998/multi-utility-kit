"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";

type Item = { id: string; file: File };

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());

export default function PdfMerge() {
  const [files, setFiles] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const addFiles = (incoming: File[]) => {
    setResult(null);
    setError(null);
    setFiles((prev) => [
      ...prev,
      ...incoming.filter((f) => f.type === "application/pdf").map((file) => ({ id: newId(), file })),
    ]);
  };

  const reorder = (from: number, to: number) => {
    setFiles((prev) => {
      if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setResult(null);
  };

  const move = (i: number, dir: -1 | 1) => reorder(i, i + dir);

  const removeAt = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setResult(null);
  };

  const onDrop = (i: number) => {
    if (dragIndex !== null) reorder(dragIndex, i);
    setDragIndex(null);
    setOverIndex(null);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    try {
      const out = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
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
          <p className="mb-3 text-sm text-[var(--muted)]">{files.length} file(s) · drag the handle or use the arrows to set the order</p>
          <ul className="space-y-2">
            {files.map((item, i) => {
              const dragging = dragIndex === i;
              const isTarget = overIndex === i && dragIndex !== null && dragIndex !== i;
              return (
                <li
                  key={item.id}
                  onDragOver={(e) => {
                    if (dragIndex === null) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (overIndex !== i) setOverIndex(i);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    onDrop(i);
                  }}
                  className="flex items-center gap-2 rounded-lg p-2 transition-[box-shadow,opacity]"
                  style={{
                    background: "var(--surface-2)",
                    opacity: dragging ? 0.4 : 1,
                    boxShadow: isTarget ? "inset 0 2px 0 0 var(--brand)" : "none",
                  }}
                >
                  <button
                    aria-label="Drag to reorder"
                    title="Drag to reorder"
                    draggable
                    onDragStart={(e) => {
                      setDragIndex(i);
                      e.dataTransfer.effectAllowed = "move";
                      // Firefox requires data to be set for dragging to start.
                      e.dataTransfer.setData("text/plain", String(i));
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setOverIndex(null);
                    }}
                    className="cursor-grab touch-none px-1 text-[var(--muted)] active:cursor-grabbing"
                  >
                    ⠿
                  </button>
                  <span className="grid h-6 w-6 place-items-center rounded text-xs font-bold text-white" style={{ background: "var(--brand)" }}>{i + 1}</span>
                  <PdfThumbnail file={item.file} width={36} />
                  <span className="min-w-0 flex-1 truncate text-sm">{item.file.name}</span>
                  <span className="text-xs text-[var(--muted)]">{formatBytes(item.file.size)}</span>
                  <button aria-label="Move up" className="px-1.5 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                  <button aria-label="Move down" className="px-1.5 disabled:opacity-30" disabled={i === files.length - 1} onClick={() => move(i, 1)}>↓</button>
                  <button aria-label="Remove" className="px-1.5 text-[var(--danger)]" onClick={() => removeAt(i)}>✕</button>
                </li>
              );
            })}
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
