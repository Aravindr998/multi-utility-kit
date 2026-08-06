"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";

type Position = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";
type Format = "n" | "n-of-total" | "page-n" | "page-n-of-total";

const POSITIONS: [Position, string][] = [
  ["bottom-center", "Bottom center"],
  ["bottom-right", "Bottom right"],
  ["bottom-left", "Bottom left"],
  ["top-center", "Top center"],
  ["top-right", "Top right"],
  ["top-left", "Top left"],
];

const FORMATS: [Format, string][] = [
  ["n", "1"],
  ["n-of-total", "1 / 10"],
  ["page-n", "Page 1"],
  ["page-n-of-total", "Page 1 of 10"],
];

function label(fmt: Format, n: number, total: number): string {
  switch (fmt) {
    case "n": return `${n}`;
    case "n-of-total": return `${n} / ${total}`;
    case "page-n": return `Page ${n}`;
    case "page-n-of-total": return `Page ${n} of ${total}`;
  }
}

export default function PdfPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<Format>("n");
  const [startAt, setStartAt] = useState(1);
  const [fontSize, setFontSize] = useState(11);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPageCount(0);
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
    } catch {
      setError("Could not read this PDF. It may be password-protected — unlock it first.");
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;
      const margin = 28;
      pages.forEach((page, i) => {
        const text = label(format, startAt + i, startAt + total - 1);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        let x: number;
        if (position.includes("center")) x = (width - textWidth) / 2;
        else if (position.includes("right")) x = width - margin - textWidth;
        else x = margin;
        const y = position.startsWith("top") ? height - margin - fontSize : margin;
        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
      });
      const saved = await doc.save();
      setResult({
        blob: new Blob([saved as BlobPart], { type: "application/pdf" }),
        name: file.name.replace(/\.pdf$/i, "") + "-numbered.pdf",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add page numbers.");
    } finally {
      setBusy(false);
    }
  };

  const chip = (active: boolean) => ({
    background: active ? "var(--brand)" : "var(--surface-2)",
    color: active ? "var(--on-brand)" : "var(--foreground)",
    border: "1px solid var(--border)",
  });

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf" onFiles={onFiles} icon="🔢" label="Drop a PDF to add page numbers" hint="Choose position, format and start number" />
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

          <label className="label">Position</label>
          <div className="mb-4 flex flex-wrap gap-2">
            {POSITIONS.map(([v, l]) => (
              <button key={v} onClick={() => { setPosition(v); setResult(null); }} className="rounded-lg px-3 py-1.5 text-sm font-semibold" style={chip(position === v)}>{l}</button>
            ))}
          </div>

          <label className="label">Format</label>
          <div className="mb-4 flex flex-wrap gap-2">
            {FORMATS.map(([v, l]) => (
              <button key={v} onClick={() => { setFormat(v); setResult(null); }} className="rounded-lg px-3 py-1.5 text-sm font-semibold" style={chip(format === v)}>{l}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="start">Start at</label>
              <input id="start" type="number" min={0} className="input" value={startAt} onChange={(e) => { setStartAt(parseInt(e.target.value) || 1); setResult(null); }} />
            </div>
            <div>
              <label className="label" htmlFor="fs">Font size: {fontSize}px</label>
              <input id="fs" type="range" min={8} max={24} step={1} value={fontSize} onChange={(e) => { setFontSize(parseInt(e.target.value)); setResult(null); }} className="mt-2 w-full accent-[var(--brand)]" />
            </div>
          </div>

          <div className="mt-4">
            {busy ? <ProgressIndicator label="Adding page numbers…" /> : <button className="btn btn-primary" onClick={run}>Add page numbers</button>}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && (
        <ResultCard
          title="Page numbers added"
          stats={[{ label: "Pages", value: String(pageCount) }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download PDF"
          onReset={reset}
        />
      )}
    </div>
  );
}
