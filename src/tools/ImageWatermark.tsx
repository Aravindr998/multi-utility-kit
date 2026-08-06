"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import { baseName, canvasToBlob, extFor, loadImageFromFile, outputTypeFor } from "@/lib/image";
import { downloadBlob } from "@/lib/format";

const MAX_PREVIEW = 480;

type Pos = "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";
const POSITIONS: Pos[] = ["top-left", "top-center", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom-center", "bottom-right"];

// Paint the watermark text onto ctx sized to (w,h). Sizes are given as
// fractions of the canvas so preview and full-res output match exactly.
function paintWatermark(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opts: { text: string; sizePct: number; color: string; opacity: number; position: Pos; tile: boolean; rotate: boolean },
) {
  const { text, sizePct, color, opacity, position, tile, rotate } = opts;
  if (!text) return;
  const fontPx = Math.max(8, (sizePct / 100) * Math.min(w, h));
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.font = `bold ${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
  ctx.textBaseline = "middle";
  // Soft shadow so light text stays legible on light images.
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = fontPx * 0.08;

  if (tile) {
    ctx.textAlign = "center";
    const stepX = ctx.measureText(text).width + fontPx * 2;
    const stepY = fontPx * 3;
    for (let y = -h; y < h * 2; y += stepY) {
      for (let x = -w; x < w * 2; x += stepX) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((-30 * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();
    return;
  }

  const pad = fontPx * 0.6;
  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  let x: number;
  let y: number;
  ctx.textAlign = "left";
  if (position.includes("left")) x = pad;
  else if (position.includes("right")) x = w - tw - pad;
  else x = (w - tw) / 2;
  if (position.includes("top")) y = pad + fontPx / 2;
  else if (position.includes("bottom")) y = h - pad - fontPx / 2;
  else y = h / 2;

  if (rotate) {
    ctx.translate(w / 2, h / 2);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.textAlign = "center";
    ctx.fillText(text, 0, 0);
  } else {
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}

export default function ImageWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [text, setText] = useState("© Your Name");
  const [sizePct, setSizePct] = useState(6);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.6);
  const [position, setPosition] = useState<Pos>("bottom-right");
  const [tile, setTile] = useState(false);
  const [rotate, setRotate] = useState(false);
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

  const opts = { text, sizePct, color, opacity, position, tile, rotate };

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
    ctx.drawImage(img, 0, 0, w, h);
    paintWatermark(ctx, w, h, opts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [natural, text, sizePct, color, opacity, position, tile, rotate]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Clear a stale result whenever any watermark setting changes.
  const clear = () => setResult(null);

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
      ctx.drawImage(img, 0, 0);
      paintWatermark(ctx, natural.w, natural.h, opts);
      const blob = await canvasToBlob(canvas, type, 0.92);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not watermark this image.");
    }
  };

  const download = () => {
    if (!result || !file) return;
    downloadBlob(result.blob, `${baseName(file)}-watermarked.${extFor(outputTypeFor(file))}`);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="💧" label="Drop an image to watermark" hint="JPG, PNG, WebP or HEIC" />
      )}

      {file && natural && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">
              {file.name} <span className="text-[var(--muted)]">· {natural.w}×{natural.h}</span>
            </p>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid min-h-[180px] place-items-center rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
              <canvas ref={previewCanvas} className="max-h-[320px] max-w-full rounded" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="wm-text">Watermark text</label>
                <input id="wm-text" className="input" value={text} onChange={(e) => { setText(e.target.value); clear(); }} placeholder="© Your Name" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="wm-size">Size: {sizePct}%</label>
                  <input id="wm-size" type="range" min={2} max={20} step={1} value={sizePct} onChange={(e) => { setSizePct(parseInt(e.target.value)); clear(); }} className="w-full accent-[var(--brand)]" />
                </div>
                <div>
                  <label className="label" htmlFor="wm-op">Opacity: {Math.round(opacity * 100)}%</label>
                  <input id="wm-op" type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => { setOpacity(parseFloat(e.target.value)); clear(); }} className="w-full accent-[var(--brand)]" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="label mb-0" htmlFor="wm-color">Colour</label>
                <input id="wm-color" type="color" value={color} onChange={(e) => { setColor(e.target.value); clear(); }} className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border)" }} />
              </div>

              {!tile && (
                <div>
                  <label className="label">Position</label>
                  <div className="grid w-max grid-cols-3 gap-1">
                    {POSITIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPosition(p); clear(); }}
                        aria-label={p}
                        className="h-7 w-7 rounded"
                        style={{ background: position === p ? "var(--brand)" : "var(--surface-2)", border: "1px solid var(--border)" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={tile} onChange={(e) => { setTile(e.target.checked); clear(); }} className="accent-[var(--brand)]" />
                  Tile across image
                </label>
                {!tile && (
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={rotate} onChange={(e) => { setRotate(e.target.checked); clear(); }} className="accent-[var(--brand)]" />
                    Diagonal
                  </label>
                )}
              </div>
            </div>
          </div>

          <button className="btn btn-primary mt-5" onClick={apply} disabled={!text.trim()}>Add watermark</button>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && file && (
        <ResultCard
          title="Watermarked image"
          stats={[{ label: "Size", value: `${(result.blob.size / 1024).toFixed(1)} KB` }]}
          onDownload={download}
          downloadLabel="Download image"
          onReset={reset}
          preview={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Watermarked preview" className="max-h-64 w-full rounded-lg object-contain" style={{ background: "var(--surface-2)" }} />
          }
        />
      )}
    </div>
  );
}
