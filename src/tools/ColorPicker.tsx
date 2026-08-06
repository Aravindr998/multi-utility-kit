"use client";

import { useCallback, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { loadImageFromFile } from "@/lib/image";
import { contrastText, hexToRgb, hslString, rgbString, rgbToHex, rgbToHsl } from "@/lib/color";

const MAX_CANVAS = 640;

type Picked = { r: number; g: number; b: number };

export default function ColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<Picked | null>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [manual, setManual] = useState("#4f46e5");
  const [history, setHistory] = useState<Picked[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onFiles = async (files: File[]) => {
    setError(null);
    setPicked(null);
    setHover(null);
    setFile(files[0]);
    try {
      const img = await loadImageFromFile(files[0]);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = Math.min(1, MAX_CANVAS / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch {
      setError("Could not read this image.");
    }
  };

  const sample = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Picked | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    const d = ctx.getImageData(x, y, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2] };
  }, []);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1200);
  };

  // Typing/choosing a manual hex updates both the field and the picked colour.
  const onManual = (v: string) => {
    setManual(v);
    const rgb = hexToRgb(v);
    if (rgb) setPicked(rgb);
  };

  const reset = () => {
    setFile(null);
    setError(null);
    setPicked(null);
    setHover(null);
  };

  const active = picked;
  const hex = active ? rgbToHex(active.r, active.g, active.b) : "";
  const hsl = active ? rgbToHsl(active.r, active.g, active.b) : null;

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <label className="label">Pick a colour manually</label>
        <div className="flex flex-wrap items-center gap-3">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(manual) ? manual : "#000000"} onChange={(e) => onManual(e.target.value)} className="h-10 w-16 cursor-pointer rounded border" style={{ borderColor: "var(--border)" }} />
          <input className="input max-w-[160px]" value={manual} onChange={(e) => onManual(e.target.value)} placeholder="#4f46e5" spellCheck={false} />
          <span className="text-sm text-[var(--muted)]">or sample a colour from an image below</span>
        </div>
      </div>

      {!file && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="🎨" label="Drop an image to pick colours from" hint="Click anywhere on the image to sample a pixel" />
      )}

      <div className="card p-5" style={{ display: file ? "block" : "none" }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="truncate font-medium">{file?.name}</p>
          <button className="btn btn-secondary" onClick={reset}>Change image</button>
        </div>
        <div className="grid gap-5 md:grid-cols-[1fr_220px]">
          <div className="grid place-items-center rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
            <canvas
              ref={canvasRef}
              onMouseMove={(e) => setHover(sample(e))}
              onMouseLeave={() => setHover(null)}
              onClick={(e) => {
                const p = sample(e);
                if (p) {
                  setPicked(p);
                  setManual(rgbToHex(p.r, p.g, p.b));
                  setHistory((h) => [p, ...h.filter((c) => !(c.r === p.r && c.g === p.g && c.b === p.b))].slice(0, 12));
                }
              }}
              className="max-h-[420px] max-w-full cursor-crosshair rounded"
            />
          </div>

          <div>
            <label className="label">Under cursor</label>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-9 w-9 shrink-0 rounded border" style={{ background: hover ? rgbString(hover.r, hover.g, hover.b) : "transparent", borderColor: "var(--border)" }} />
              <span className="text-sm text-[var(--muted)]">{hover ? rgbToHex(hover.r, hover.g, hover.b) : "—"}</span>
            </div>
            {history.length > 0 && (
              <>
                <label className="label">Recent</label>
                <div className="flex flex-wrap gap-1.5">
                  {history.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => { setPicked(c); setManual(rgbToHex(c.r, c.g, c.b)); }}
                      className="h-7 w-7 rounded border"
                      style={{ background: rgbString(c.r, c.g, c.b), borderColor: "var(--border)" }}
                      aria-label={rgbToHex(c.r, c.g, c.b)}
                      title={rgbToHex(c.r, c.g, c.b)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {active && hsl && (
        <div className="card overflow-hidden">
          <div className="grid h-28 place-items-center" style={{ background: hex, color: contrastText(active.r, active.g, active.b) }}>
            <span className="text-2xl font-bold tracking-wide">{hex}</span>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-3">
            {[
              { label: "HEX", value: hex },
              { label: "RGB", value: rgbString(active.r, active.g, active.b) },
              { label: "HSL", value: hslString(hsl.h, hsl.s, hsl.l) },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => copy(f.value, f.label)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
              >
                <span>
                  <span className="mr-2 text-xs font-semibold text-[var(--muted)]">{f.label}</span>
                  {f.value}
                </span>
                <span className="text-xs text-[var(--brand)]">{copied === f.label ? "Copied!" : "Copy"}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
