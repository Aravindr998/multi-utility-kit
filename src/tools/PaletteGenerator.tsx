"use client";

import { useCallback, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { loadImageFromFile } from "@/lib/image";
import { contrastText, rgbString, rgbToHex, rgbToHsl } from "@/lib/color";

type Swatch = { r: number; g: number; b: number; count: number };

// Median-cut quantisation: recursively split the colour box along its widest
// channel until we have enough buckets, then average each bucket.
function medianCut(pixels: number[][], depth: number): Swatch[] {
  if (pixels.length === 0) return [];
  if (depth === 0) {
    let r = 0, g = 0, b = 0;
    for (const p of pixels) { r += p[0]; g += p[1]; b += p[2]; }
    const n = pixels.length;
    return [{ r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n), count: n }];
  }
  let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
  for (const p of pixels) {
    rMin = Math.min(rMin, p[0]); rMax = Math.max(rMax, p[0]);
    gMin = Math.min(gMin, p[1]); gMax = Math.max(gMax, p[1]);
    bMin = Math.min(bMin, p[2]); bMax = Math.max(bMax, p[2]);
  }
  const ranges = [rMax - rMin, gMax - gMin, bMax - bMin];
  const ch = ranges[0] >= ranges[1] && ranges[0] >= ranges[2] ? 0 : ranges[1] >= ranges[2] ? 1 : 2;
  pixels.sort((a, b) => a[ch] - b[ch]);
  const mid = pixels.length >> 1;
  return [...medianCut(pixels.slice(0, mid), depth - 1), ...medianCut(pixels.slice(mid), depth - 1)];
}

export default function PaletteGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(6);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const pixelsRef = useRef<number[][] | null>(null);
  const [palette, setPalette] = useState<Swatch[]>([]);

  const extract = useCallback((n: number) => {
    const pixels = pixelsRef.current;
    if (!pixels || pixels.length === 0) return;
    const depth = Math.ceil(Math.log2(Math.max(2, n)));
    const buckets = medianCut([...pixels], depth);
    buckets.sort((a, b) => b.count - a.count);
    setPalette(buckets.slice(0, n));
  }, []);

  const onFiles = async (files: File[]) => {
    setError(null);
    setPalette([]);
    setFile(files[0]);
    try {
      const img = await loadImageFromFile(files[0]);
      const scale = Math.min(1, 160 / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.naturalWidth * scale));
      c.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Canvas not supported.");
      ctx.drawImage(img, 0, 0, c.width, c.height);
      setThumb(c.toDataURL("image/jpeg", 0.7));
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      const pixels: number[][] = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue; // skip transparent
        pixels.push([data[i], data[i + 1], data[i + 2]]);
      }
      pixelsRef.current = pixels;
      extract(count);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this image.");
    }
  };

  const onCount = (n: number) => {
    setCount(n);
    if (pixelsRef.current) extract(n);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1200);
  };

  const reset = () => {
    setFile(null);
    setPalette([]);
    setThumb(null);
    setError(null);
    pixelsRef.current = null;
  };

  const cssVars = palette.map((s, i) => `  --color-${i + 1}: ${rgbToHex(s.r, s.g, s.b)};`).join("\n");

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="🎨" label="Drop an image to extract its palette" hint="JPG, PNG, WebP or HEIC" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-3">
            {thumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb} alt="" className="h-12 w-12 rounded object-cover" />
            )}
            <p className="min-w-0 flex-1 truncate font-medium">{file.name}</p>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <div className="mb-5">
            <label className="label" htmlFor="cnt">Colours: {count}</label>
            <input id="cnt" type="range" min={3} max={12} step={1} value={count} onChange={(e) => onCount(parseInt(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>

          {/* Palette bar */}
          <div className="flex h-16 overflow-hidden rounded-lg">
            {palette.map((s, i) => (
              <div key={i} className="flex-1" style={{ background: rgbString(s.r, s.g, s.b) }} title={rgbToHex(s.r, s.g, s.b)} />
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((s, i) => {
              const hex = rgbToHex(s.r, s.g, s.b);
              const hsl = rgbToHsl(s.r, s.g, s.b);
              return (
                <button
                  key={i}
                  onClick={() => copy(hex, hex + i)}
                  className="flex items-center gap-3 rounded-lg p-2 text-left"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded" style={{ background: hex, color: contrastText(s.r, s.g, s.b) }}>
                    <span className="text-[10px] font-bold">{copied === hex + i ? "✓" : ""}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-sm font-semibold">{hex}</span>
                    <span className="block text-xs text-[var(--muted)]">{rgbString(s.r, s.g, s.b)} · {hsl.h}°</span>
                  </span>
                </button>
              );
            })}
          </div>

          {palette.length > 0 && (
            <button
              className="btn btn-secondary mt-4"
              onClick={() => copy(`:root {\n${cssVars}\n}`, "css")}
            >
              {copied === "css" ? "Copied CSS!" : "Copy as CSS variables"}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}
    </div>
  );
}
