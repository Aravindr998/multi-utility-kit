"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import { baseName, canvasToBlob, extFor, loadImageFromFile, outputTypeFor } from "@/lib/image";
import { downloadBlob } from "@/lib/format";

const MAX_PREVIEW = 420;

// Draw the source rotated by `deg` into ctx, expanding the canvas to fit.
function renderRotated(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  srcW: number,
  srcH: number,
  deg: number,
  transparent: boolean,
) {
  const rad = (deg * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const outW = Math.round(srcW * cos + srcH * sin);
  const outH = Math.round(srcW * sin + srcH * cos);
  canvas.width = Math.max(1, outW);
  canvas.height = Math.max(1, outH);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { w: outW, h: outH };
  if (!transparent) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, -srcW / 2, -srcH / 2, srcW, srcH);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return { w: outW, h: outH };
}

export default function ImageRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [angle, setAngle] = useState(0);
  const [transparent, setTransparent] = useState(true);
  const [result, setResult] = useState<{ blob: Blob; url: string; w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvas = useRef<HTMLCanvasElement | null>(null);

  const reset = () => {
    setFile(null);
    setNatural(null);
    setAngle(0);
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

  const supportsAlpha = file ? outputTypeFor(file).endsWith("png") || outputTypeFor(file).endsWith("webp") : false;
  const norm = ((angle % 360) + 360) % 360;

  const drawPreview = useCallback(() => {
    const canvas = previewCanvas.current;
    const img = imgRef.current;
    if (!canvas || !img || !natural) return;
    const scale = Math.min(1, MAX_PREVIEW / Math.max(natural.w, natural.h));
    const opaque = !(transparent && supportsAlpha);
    renderRotated(canvas, img, Math.round(natural.w * scale), Math.round(natural.h * scale), norm, opaque);
  }, [natural, norm, transparent, supportsAlpha]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const rotateBy = (d: number) => { setAngle((a) => ((a + d) % 360 + 360) % 360); setResult(null); };
  const setAngleClear = (a: number) => { setAngle(a); setResult(null); };
  const setTransparentClear = (v: boolean) => { setTransparent(v); setResult(null); };

  const apply = async () => {
    const img = imgRef.current;
    if (!img || !natural || !file) return;
    setError(null);
    try {
      const canvas = document.createElement("canvas");
      const useAlpha = transparent && supportsAlpha;
      const { w, h } = renderRotated(canvas, img, natural.w, natural.h, norm, !useAlpha);
      const blob = await canvasToBlob(canvas, outputTypeFor(file), 0.92);
      setResult({ blob, url: URL.createObjectURL(blob), w, h });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not rotate this image.");
    }
  };

  const download = () => {
    if (!result || !file) return;
    downloadBlob(result.blob, `${baseName(file)}-rotated.${extFor(outputTypeFor(file))}`);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="🔁" label="Drop an image to rotate" hint="JPG, PNG, WebP or HEIC" />
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
            <button className="btn btn-secondary" onClick={() => rotateBy(-90)}>↺ 90° left</button>
            <button className="btn btn-secondary" onClick={() => rotateBy(90)}>↻ 90° right</button>
            <button className="btn btn-secondary" onClick={() => rotateBy(180)}>180°</button>
            <button className="btn btn-secondary" onClick={() => setAngleClear(0)}>Reset</button>
          </div>

          <div className="mt-4">
            <label className="label" htmlFor="a">Fine angle: {norm}°</label>
            <input id="a" type="range" min={0} max={360} step={1} value={norm} onChange={(e) => setAngleClear(parseInt(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>

          {supportsAlpha && (
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={transparent} onChange={(e) => setTransparentClear(e.target.checked)} className="accent-[var(--brand)]" />
              Transparent background (corners exposed by rotation)
            </label>
          )}

          <button className="btn btn-primary mt-4" onClick={apply}>Apply rotation</button>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && file && (
        <ResultCard
          title="Rotated image"
          stats={[{ label: "Angle", value: `${norm}°` }, { label: "Dimensions", value: `${result.w}×${result.h}` }, { label: "Size", value: `${(result.blob.size / 1024).toFixed(1)} KB` }]}
          onDownload={download}
          downloadLabel="Download image"
          onReset={reset}
          preview={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Rotated preview" className="max-h-64 w-full rounded-lg object-contain" style={{ background: "var(--surface-2)" }} />
          }
        />
      )}
    </div>
  );
}
