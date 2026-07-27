"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob } from "@/lib/format";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
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
      const blob = await imageCompression(file, {
        maxSizeMB: 100,
        useWebWorker: true,
        initialQuality: quality,
        maxWidthOrHeight: 8000,
        onProgress: (p: number) => setProgress(p),
      });
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed. Try another image.");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result || !file) return;
    const dot = file.name.lastIndexOf(".");
    const base = dot > 0 ? file.name.slice(0, dot) : file.name;
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    downloadBlob(result.blob, `${base}-compressed.${ext}`);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          onFiles={onFiles}
          icon="🖼️"
          label="Drop an image here"
          hint="JPG, PNG or WebP · processed in your browser"
        />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{file.name}</p>
              <p className="text-sm text-[var(--muted)]">
                {(file.size / 1024).toFixed(1)} KB · {file.type || "image"}
              </p>
            </div>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <label className="label" htmlFor="quality">
            Quality: {Math.round(quality * 100)}%
          </label>
          <input
            id="quality"
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full accent-[var(--brand)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
            <span>Smaller file</span>
            <span>Best quality</span>
          </div>

          <div className="mt-4">
            {busy ? (
              <ProgressIndicator value={progress} label="Compressing…" />
            ) : (
              <button className="btn btn-primary" onClick={compress}>
                Compress image
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
          title="Compressed image"
          beforeBytes={file.size}
          afterBytes={result.blob.size}
          onDownload={download}
          downloadLabel="Download image"
          onReset={reset}
          preview={
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={result.url}
              alt="Compressed preview"
              className="max-h-64 w-full rounded-lg object-contain"
              style={{ background: "var(--surface-2)" }}
            />
          }
        />
      )}
    </div>
  );
}
