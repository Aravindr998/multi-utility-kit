"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import { baseName, canvasToBlob, extFor, loadImageFromFile, outputTypeFor } from "@/lib/image";
import { downloadBlob } from "@/lib/format";

const MAX_PREVIEW = 420;

function renderFlipped(canvas: HTMLCanvasElement, img: HTMLImageElement, w: number, h: number, flipH: boolean, flipV: boolean, opaque: boolean) {
  canvas.width = Math.max(1, w);
  canvas.height = Math.max(1, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (opaque) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.translate(flipH ? w : 0, flipV ? h : 0);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export default function ImageFlip() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [flipH, setFlipH] = useState(true);
  const [flipV, setFlipV] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvas = useRef<HTMLCanvasElement | null>(null);

  const reset = () => {
    setFile(null);
    setNatural(null);
    setResult(null);
    setError(null);
    imgRef.current = null;
  };

  const onFiles = async (files: File[]) => {
    reset();
    const f = files[0];
    setFile(f);
    try {
      const img = await loadImageFromFile(f);
      imgRef.current = img;
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    } catch {
      setError("Could not read this image.");
    }
  };

  const opaque = file ? outputTypeFor(file) === "image/jpeg" : true;

  const drawPreview = useCallback(() => {
    const canvas = previewCanvas.current;
    const img = imgRef.current;
    if (!canvas || !img || !natural) return;
    const scale = Math.min(1, MAX_PREVIEW / Math.max(natural.w, natural.h));
    renderFlipped(canvas, img, Math.round(natural.w * scale), Math.round(natural.h * scale), flipH, flipV, opaque);
  }, [natural, flipH, flipV, opaque]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const toggleH = () => { setFlipH((v) => !v); setResult(null); };
  const toggleV = () => { setFlipV((v) => !v); setResult(null); };

  const apply = async () => {
    const img = imgRef.current;
    if (!img || !natural || !file) return;
    setError(null);
    try {
      const canvas = document.createElement("canvas");
      renderFlipped(canvas, img, natural.w, natural.h, flipH, flipV, opaque);
      const blob = await canvasToBlob(canvas, outputTypeFor(file), 0.92);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not flip this image.");
    }
  };

  const download = () => {
    if (!result || !file) return;
    downloadBlob(result.blob, `${baseName(file)}-flipped.${extFor(outputTypeFor(file))}`);
  };

  const toggleBtn = (active: boolean) => ({
    background: active ? "var(--brand)" : "var(--surface-2)",
    color: active ? "var(--on-brand)" : "var(--foreground)",
    border: "1px solid var(--border)",
  });

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="🔃" label="Drop an image to flip / mirror" hint="JPG, PNG, WebP or HEIC" />
      )}

      {file && natural && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">
              {file.name} <span className="text-[var(--muted)]">· {natural.w}×{natural.h}</span>
            </p>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <div className="grid min-h-[160px] place-items-center rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
            <canvas ref={previewCanvas} className="max-h-[300px] max-w-full rounded" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-lg px-4 py-2 text-sm font-semibold" style={toggleBtn(flipH)} onClick={toggleH}>
              ↔ Flip horizontal
            </button>
            <button className="rounded-lg px-4 py-2 text-sm font-semibold" style={toggleBtn(flipV)} onClick={toggleV}>
              ↕ Flip vertical
            </button>
          </div>

          <button className="btn btn-primary mt-4" onClick={apply} disabled={!flipH && !flipV}>Apply flip</button>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && file && (
        <ResultCard
          title="Flipped image"
          stats={[{ label: "Flip", value: [flipH && "Horizontal", flipV && "Vertical"].filter(Boolean).join(" + ") || "None" }, { label: "Size", value: `${(result.blob.size / 1024).toFixed(1)} KB` }]}
          onDownload={download}
          downloadLabel="Download image"
          onReset={reset}
          preview={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Flipped preview" className="max-h-64 w-full rounded-lg object-contain" style={{ background: "var(--surface-2)" }} />
          }
        />
      )}
    </div>
  );
}
