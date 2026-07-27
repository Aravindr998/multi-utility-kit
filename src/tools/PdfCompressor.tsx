"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob } from "@/lib/format";
import { getPdfjs } from "@/lib/pdfjs";

type Level = "light" | "medium" | "strong";

const LEVELS: Record<Level, { scale: number; quality: number; label: string; desc: string }> = {
  light: { scale: 1.5, quality: 0.85, label: "Light", desc: "Best quality" },
  medium: { scale: 1.1, quality: 0.7, label: "Medium", desc: "Balanced" },
  strong: { scale: 0.85, quality: 0.55, label: "Strong", desc: "Smallest size" },
};

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      const { scale, quality } = LEVELS[level];
      const pdfjs = await getPdfjs();
      const data = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjs.getDocument({ data }).promise;
      const out = await PDFDocument.create();

      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported.");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;

        const jpegBlob: Blob = await new Promise((res, rej) =>
          canvas.toBlob((b) => (b ? res(b) : rej(new Error("Render failed."))), "image/jpeg", quality),
        );
        const jpeg = await out.embedJpg(new Uint8Array(await jpegBlob.arrayBuffer()));
        // Keep original page dimensions (points) so the PDF prints at the right size.
        const orig = page.getViewport({ scale: 1 });
        const p = out.addPage([orig.width, orig.height]);
        p.drawImage(jpeg, { x: 0, y: 0, width: orig.width, height: orig.height });
        setProgress((n / doc.numPages) * 100);
      }

      const saved = await out.save();
      setResult({ blob: new Blob([saved as BlobPart], { type: "application/pdf" }) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not compress this PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf" onFiles={onFiles} icon="🗜️" label="Drop a PDF to compress" hint="Best for image-heavy or scanned PDFs" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <PdfThumbnail file={file} width={48} />
              <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {(file.size / 1024 / 1024).toFixed(2)} MB</span></p>
            </div>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <label className="label">Compression level</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(LEVELS) as Level[]).map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className="rounded-lg p-3 text-left"
                style={{
                  background: level === l ? "var(--brand-soft)" : "var(--surface-2)",
                  border: `1px solid ${level === l ? "var(--brand)" : "var(--border)"}`,
                }}
              >
                <span className="block text-sm font-semibold">{LEVELS[l].label}</span>
                <span className="block text-xs text-[var(--muted)]">{LEVELS[l].desc}</span>
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-[var(--muted)]">
            Note: pages are rasterized to shrink embedded images, so selectable text becomes part of the image.
          </p>

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label="Compressing…" /> : <button className="btn btn-primary" onClick={compress}>Compress PDF</button>}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && file && (
        <ResultCard
          title="Compressed PDF"
          beforeBytes={file.size}
          afterBytes={result.blob.size}
          onDownload={() => downloadBlob(result.blob, file.name.replace(/\.pdf$/i, "") + "-compressed.pdf")}
          downloadLabel="Download PDF"
          onReset={reset}
        />
      )}
    </div>
  );
}
