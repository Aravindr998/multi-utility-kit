"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import { baseName, canvasToBlob, extFor, loadImageFromFile, outputTypeFor } from "@/lib/image";
import { downloadBlob } from "@/lib/format";

const MAX_PREVIEW = 480;

export default function ImageBlur() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [radius, setRadius] = useState(8);
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

  // Live preview — scale the blur radius to the preview so it looks accurate.
  const drawPreview = useCallback(() => {
    const canvas = previewCanvas.current;
    const img = imgRef.current;
    if (!canvas || !img || !natural) return;
    const scale = Math.min(1, MAX_PREVIEW / Math.max(natural.w, natural.h));
    const w = Math.max(1, Math.round(natural.w * scale));
    const h = Math.max(1, Math.round(natural.h * scale));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.filter = `blur(${radius * scale}px)`;
    ctx.drawImage(img, 0, 0, w, h);
    ctx.filter = "none";
  }, [natural, radius]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const onRadius = (v: number) => {
    setRadius(v);
    setResult(null);
  };

  const apply = async () => {
    const img = imgRef.current;
    if (!img || !natural || !file) return;
    setError(null);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = natural.w;
      canvas.height = natural.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");
      const type = outputTypeFor(file);
      if (type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, natural.w, natural.h);
      }
      ctx.filter = `blur(${radius}px)`;
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";
      const blob = await canvasToBlob(canvas, type, 0.92);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not blur this image.");
    }
  };

  const download = () => {
    if (!result || !file) return;
    const type = outputTypeFor(file);
    downloadBlob(result.blob, `${baseName(file)}-blurred.${extFor(type)}`);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="🌫️" label="Drop an image to blur" hint="JPG, PNG, WebP or HEIC" />
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

          <div className="mt-4">
            <label className="label" htmlFor="r">Blur strength: {radius}px</label>
            <input id="r" type="range" min={0} max={50} step={1} value={radius} onChange={(e) => onRadius(parseInt(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>

          <button className="btn btn-primary mt-4" onClick={apply}>Apply blur</button>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && file && (
        <ResultCard
          title="Blurred image"
          stats={[{ label: "Blur", value: `${radius}px` }, { label: "Size", value: `${(result.blob.size / 1024).toFixed(1)} KB` }]}
          onDownload={download}
          downloadLabel="Download image"
          onReset={reset}
          preview={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Blurred preview" className="max-h-64 w-full rounded-lg object-contain" style={{ background: "var(--surface-2)" }} />
          }
        />
      )}
    </div>
  );
}
