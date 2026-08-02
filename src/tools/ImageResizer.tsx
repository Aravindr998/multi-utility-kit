"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import { downloadBlob } from "@/lib/format";

const PRESETS: { label: string; w: number; h: number }[] = [
  { label: "YouTube thumbnail", w: 1280, h: 720 },
  { label: "Instagram post", w: 1080, h: 1080 },
  { label: "Instagram story", w: 1080, h: 1920 },
  { label: "LinkedIn banner", w: 1584, h: 396 },
  { label: "X / Twitter header", w: 1500, h: 500 },
  { label: "Facebook cover", w: 820, h: 312 },
];

type Crop = { x: number; y: number; w: number; h: number };
type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
type DragState = {
  kind: "move" | Handle;
  startX: number; // pointer client X
  startY: number;
  rectW: number; // rendered image width in px (for scaling)
  start: Crop;
};

const MIN = 16; // minimum crop size in natural px
const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const HANDLE_CURSOR: Record<Handle, string> = {
  nw: "nwse-resize", se: "nwse-resize",
  ne: "nesw-resize", sw: "nesw-resize",
  n: "ns-resize", s: "ns-resize",
  e: "ew-resize", w: "ew-resize",
};

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null); // object URL of the source image

  const imgRef = useRef<HTMLImageElement | null>(null); // decoded source image
  const imgElRef = useRef<HTMLImageElement | null>(null); // rendered <img> in preview
  const previewCanvas = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef<DragState | null>(null);

  const reset = () => {
    setFile(null);
    setNatural(null);
    setCrop(null);
    setResult(null);
    setError(null);
    setSrcUrl(null);
    imgRef.current = null;
  };

  const onFiles = async (files: File[]) => {
    reset();
    const f = files[0];
    setFile(f);
    try {
      const url = URL.createObjectURL(f);
      setSrcUrl(url);
      const img = new Image();
      img.src = url;
      await img.decode();
      imgRef.current = img;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setNatural({ w, h });
      setCrop({ x: 0, y: 0, w, h });
      setWidth(w);
      setHeight(h);
    } catch {
      setError("Could not read this image.");
    }
  };

  const onWidth = (val: number) => {
    setResult(null);
    setWidth(val);
    if (lock && crop && crop.w > 0) setHeight(Math.round((val / crop.w) * crop.h));
  };
  const onHeight = (val: number) => {
    setResult(null);
    setHeight(val);
    if (lock && crop && crop.h > 0) setWidth(Math.round((val / crop.h) * crop.w));
  };

  // Set output size to match the current crop (1:1, no scaling).
  const syncOutputToCrop = (c: Crop) => {
    setWidth(Math.round(c.w));
    setHeight(Math.round(c.h));
  };

  const applyPreset = (w: number, h: number) => {
    if (!natural) return;
    setResult(null);
    setLock(true);
    // Fit a crop box of the preset's aspect ratio, centered in the image.
    const aspect = w / h;
    let cw = natural.w;
    let ch = natural.w / aspect;
    if (ch > natural.h) {
      ch = natural.h;
      cw = natural.h * aspect;
    }
    setCrop({ x: (natural.w - cw) / 2, y: (natural.h - ch) / 2, w: cw, h: ch });
    setWidth(w);
    setHeight(h);
  };

  const resetCrop = () => {
    if (!natural) return;
    setResult(null);
    const c = { x: 0, y: 0, w: natural.w, h: natural.h };
    setCrop(c);
    syncOutputToCrop(c);
  };

  // ---- Crop box drag / resize ----
  // A single handler; the target carries its role in `data-kind` so the JSX
  // references the function instead of calling a factory during render.
  const onPointerDown = (e: React.PointerEvent) => {
    const kind = e.currentTarget.getAttribute("data-kind") as DragState["kind"] | null;
    if (!kind || !imgElRef.current || !crop) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      kind,
      startX: e.clientX,
      startY: e.clientY,
      rectW: imgElRef.current.getBoundingClientRect().width,
      start: crop,
    };
    setResult(null);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !natural) return;
    const scale = natural.w / d.rectW; // natural px per screen px
    const dx = (e.clientX - d.startX) * scale;
    const dy = (e.clientY - d.startY) * scale;
    const s = d.start;

    let next: Crop;
    if (d.kind === "move") {
      next = {
        x: clamp(s.x + dx, 0, natural.w - s.w),
        y: clamp(s.y + dy, 0, natural.h - s.h),
        w: s.w,
        h: s.h,
      };
    } else {
      let left = s.x;
      let top = s.y;
      let right = s.x + s.w;
      let bottom = s.y + s.h;
      if (d.kind.includes("w")) left = clamp(s.x + dx, 0, right - MIN);
      if (d.kind.includes("e")) right = clamp(s.x + s.w + dx, left + MIN, natural.w);
      if (d.kind.includes("n")) top = clamp(s.y + dy, 0, bottom - MIN);
      if (d.kind.includes("s")) bottom = clamp(s.y + s.h + dy, top + MIN, natural.h);
      next = { x: left, y: top, w: right - left, h: bottom - top };
    }
    setCrop(next);
    syncOutputToCrop(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      drag.current = null;
    }
  };

  // ---- Live output preview ----
  const drawPreview = useCallback(() => {
    const canvas = previewCanvas.current;
    const img = imgRef.current;
    if (!canvas || !img || !crop || width < 1 || height < 1) return;
    const MAXD = 320;
    const scale = Math.min(1, MAXD / Math.max(width, height));
    const cw = Math.max(1, Math.round(width * scale));
    const ch = Math.max(1, Math.round(height * scale));
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, cw, ch);
  }, [crop, width, height]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const doResize = async () => {
    const img = imgRef.current;
    if (!img || !crop || width < 1 || height < 1) return;
    setError(null);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas not supported.");
      return;
    }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, width, height);
    const type = file?.type === "image/png" ? "image/png" : file?.type === "image/webp" ? "image/webp" : "image/jpeg";
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, type, 0.92));
    if (blob) setResult({ blob, url: URL.createObjectURL(blob) });
  };

  const download = () => {
    if (!result || !file) return;
    const dot = file.name.lastIndexOf(".");
    const base = dot > 0 ? file.name.slice(0, dot) : file.name;
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    downloadBlob(result.blob, `${base}-${width}x${height}.${ext}`);
  };

  // Crop box position as percentages so it tracks the image at any rendered size.
  const box = natural && crop
    ? {
        left: `${(crop.x / natural.w) * 100}%`,
        top: `${(crop.y / natural.h) * 100}%`,
        width: `${(crop.w / natural.w) * 100}%`,
        height: `${(crop.h / natural.h) * 100}%`,
      }
    : null;

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="image/*" onFiles={onFiles} icon="📐" label="Drop an image to resize" hint="JPG, PNG or WebP" />
      )}

      {file && natural && crop && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">
              {file.name} <span className="text-[var(--muted)]">· {natural.w}×{natural.h}</span>
            </p>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Interactive crop preview */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="label mb-0">Drag to crop</label>
                <button
                  onClick={resetCrop}
                  className="text-xs font-medium text-[var(--brand)] hover:underline"
                >
                  Reset crop
                </button>
              </div>
              <div
                className="relative mx-auto w-full select-none overflow-hidden rounded-lg"
                style={{ maxWidth: 520, background: "var(--surface-2)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgElRef}
                  src={srcUrl ?? undefined}
                  alt="Crop source"
                  className="block h-auto w-full"
                  draggable={false}
                />
                {box && (
                  <>
                    {/* Dim outside the crop region */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        boxShadow: `0 0 0 9999px rgba(0,0,0,0.5)`,
                        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${box.left} ${box.top}, ${box.left} calc(${box.top} + ${box.height}), calc(${box.left} + ${box.width}) calc(${box.top} + ${box.height}), calc(${box.left} + ${box.width}) ${box.top}, ${box.left} ${box.top})`,
                      }}
                    />
                    {/* Crop box */}
                    <div
                      className="absolute touch-none"
                      style={{
                        left: box.left,
                        top: box.top,
                        width: box.width,
                        height: box.height,
                        outline: "1px solid rgba(255,255,255,0.9)",
                        cursor: "move",
                      }}
                      data-kind="move"
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                    >
                      {/* rule-of-thirds guides */}
                      <div className="pointer-events-none absolute inset-0" aria-hidden>
                        <div className="absolute inset-y-0 left-1/3 w-px bg-white/30" />
                        <div className="absolute inset-y-0 left-2/3 w-px bg-white/30" />
                        <div className="absolute inset-x-0 top-1/3 h-px bg-white/30" />
                        <div className="absolute inset-x-0 top-2/3 h-px bg-white/30" />
                      </div>
                      {/* Resize handles */}
                      {HANDLES.map((hnd) => {
                        const pos: React.CSSProperties = { position: "absolute", cursor: HANDLE_CURSOR[hnd] };
                        if (hnd.includes("n")) pos.top = -6;
                        if (hnd.includes("s")) pos.bottom = -6;
                        if (hnd.includes("w")) pos.left = -6;
                        if (hnd.includes("e")) pos.right = -6;
                        if (hnd === "n" || hnd === "s") { pos.left = "50%"; pos.marginLeft = -6; }
                        if (hnd === "e" || hnd === "w") { pos.top = "50%"; pos.marginTop = -6; }
                        return (
                          <div
                            key={hnd}
                            className="touch-none rounded-sm"
                            style={{
                              ...pos,
                              width: 12,
                              height: 12,
                              background: "var(--brand)",
                              border: "2px solid var(--on-brand)",
                            }}
                            data-kind={hnd}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-[var(--muted)]">
                Crop: {Math.round(crop.w)}×{Math.round(crop.h)} px
              </p>
            </div>

            {/* Live output preview + controls */}
            <div>
              <label className="label">Live preview</label>
              <div
                className="grid min-h-[140px] place-items-center rounded-lg p-3"
                style={{ background: "var(--surface-2)" }}
              >
                <canvas
                  ref={previewCanvas}
                  className="max-h-[220px] max-w-full rounded"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
                />
              </div>
              <p className="mt-2 text-center text-xs text-[var(--muted)]">
                Output: {width}×{height} px
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="w">Width (px)</label>
                  <input id="w" type="number" min={1} className="input" value={width || ""} onChange={(e) => onWidth(parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="label" htmlFor="h">Height (px)</label>
                  <input id="h" type="number" min={1} className="input" value={height || ""} onChange={(e) => onHeight(parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="accent-[var(--brand)]" />
                Lock aspect ratio
              </label>
            </div>
          </div>

          <div className="mt-5">
            <label className="label">Social media presets</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.w, p.h)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  {p.label} · {p.w}×{p.h}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary mt-5" onClick={doResize}>Resize image</button>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && file && (
        <ResultCard
          title="Resized image"
          stats={[{ label: "Dimensions", value: `${width}×${height}` }, { label: "Size", value: `${(result.blob.size / 1024).toFixed(1)} KB` }]}
          onDownload={download}
          downloadLabel="Download image"
          onReset={reset}
          preview={
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Resized preview" className="max-h-64 w-full rounded-lg object-contain" style={{ background: "var(--surface-2)" }} />
          }
        />
      )}
    </div>
  );
}
