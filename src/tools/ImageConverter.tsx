"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob } from "@/lib/format";

type Format = "jpeg" | "png" | "webp";

const FORMAT_LABEL: Record<Format, string> = { jpeg: "JPG", png: "PNG", webp: "WebP" };

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("jpeg");
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const loadBitmap = async (f: File): Promise<HTMLImageElement> => {
    let src: File | Blob = f;
    const isHeic = /heic|heif/i.test(f.type) || /\.hei[cf]$/i.test(f.name);
    if (isHeic) {
      const heic2any = (await import("heic2any")).default;
      src = (await heic2any({ blob: f, toType: "image/png" })) as Blob;
    }
    const url = URL.createObjectURL(src);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported in this browser.");
      if (format === "jpeg") {
        ctx.fillStyle = "#ffffff"; // flatten transparency for JPG
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Conversion failed."))),
          `image/${format}`,
          format === "png" ? undefined : quality,
        ),
      );
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert this image.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const dot = file.name.lastIndexOf(".");
    const base = dot > 0 ? file.name.slice(0, dot) : file.name;
    const ext = format === "jpeg" ? "jpg" : format;
    downloadBlob(result.blob, `${base}.${ext}`);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone
          accept="image/*,.heic,.heif"
          onFiles={onFiles}
          icon="🔄"
          label="Drop an image to convert"
          hint="JPG, PNG, WebP or HEIC"
        />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name}</p>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <label className="label">Convert to</label>
          <div className="flex flex-wrap gap-2">
            {(["jpeg", "png", "webp"] as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{
                  background: format === f ? "var(--brand)" : "var(--surface-2)",
                  color: format === f ? "var(--on-brand)" : "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {FORMAT_LABEL[f]}
              </button>
            ))}
          </div>

          {format !== "png" && (
            <div className="mt-4">
              <label className="label" htmlFor="q">Quality: {Math.round(quality * 100)}%</label>
              <input
                id="q"
                type="range"
                min={0.3}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-[var(--brand)]"
              />
            </div>
          )}

          <div className="mt-4">
            {busy ? (
              <ProgressIndicator label="Converting…" />
            ) : (
              <button className="btn btn-primary" onClick={convert}>
                Convert to {FORMAT_LABEL[format]}
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>
          {error}
        </p>
      )}

      {result && file && (
        <ResultCard
          title={`Converted to ${FORMAT_LABEL[format]}`}
          beforeBytes={file.size}
          afterBytes={result.blob.size}
          onDownload={download}
          downloadLabel={`Download ${FORMAT_LABEL[format]}`}
          onReset={reset}
          preview={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Converted preview" className="max-h-64 w-full rounded-lg object-contain" style={{ background: "var(--surface-2)" }} />
          }
        />
      )}
    </div>
  );
}
