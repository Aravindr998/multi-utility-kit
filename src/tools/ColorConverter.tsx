"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

type RGBA = { r: number; g: number; b: number; a: number };

/** Normalise any CSS color via the canvas 2D engine; returns null if invalid. */
function parseColor(input: string): RGBA | null {
  if (typeof document === "undefined" || !input.trim()) return null;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  // The two-default trick: a valid color resolves the same regardless of prior fillStyle.
  ctx.fillStyle = "#000000";
  ctx.fillStyle = input;
  const a = ctx.fillStyle;
  ctx.fillStyle = "#ffffff";
  ctx.fillStyle = input;
  const b = ctx.fillStyle;
  if (a !== b) return null;
  const s = a as string;
  if (s.startsWith("#")) {
    return { r: parseInt(s.slice(1, 3), 16), g: parseInt(s.slice(3, 5), 16), b: parseInt(s.slice(5, 7), 16), a: 1 };
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, bl, al] = m[1].split(",").map((x) => parseFloat(x));
  return { r, g, b: bl, a: al ?? 1 };
}

function toHex({ r, g, b, a }: RGBA): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a * 255) : ""}`;
}

function toHsl({ r, g, b }: RGBA): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function toHsv({ r, g, b }: RGBA): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [Math.round(h), Math.round(max === 0 ? 0 : (d / max) * 100), Math.round(max * 100)];
}

export default function ColorConverter() {
  const [input, setInput] = useState("#3b82f6");
  const rgba = useMemo(() => parseColor(input), [input]);

  const rows = useMemo(() => {
    if (!rgba) return null;
    const [h, s, l] = toHsl(rgba);
    const [hh, ss, vv] = toHsv(rgba);
    const alpha = rgba.a < 1 ? rgba.a.toFixed(2) : null;
    return [
      { label: "HEX", value: toHex(rgba) },
      { label: "RGB", value: alpha ? `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${alpha})` : `rgb(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)})` },
      { label: "HSL", value: alpha ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)` },
      { label: "HSV", value: `hsv(${hh}, ${ss}%, ${vv}%)` },
    ];
  }, [rgba]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">Color</label>
        <div className="flex items-center gap-3">
          <input type="color" value={rgba ? toHex(rgba).slice(0, 7) : "#000000"} onChange={(e) => setInput(e.target.value)} className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent p-0" aria-label="Color picker" />
          <input className="input flex-1 font-mono" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="#3b82f6, rgb(59 130 246), hsl(217 91% 60%), skyblue…" />
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">Accepts HEX, RGB(A), HSL(A) and CSS color names.</p>
      </div>

      {rows ? (
        <div className="card p-4">
          <div className="mb-4 h-20 w-full rounded-lg border" style={{ background: input, borderColor: "var(--border)" }} />
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-2 rounded-md px-3 py-2" style={{ background: "var(--surface-2)" }}>
                <span className="w-12 shrink-0 text-xs font-semibold text-[var(--muted)]">{row.label}</span>
                <span className="flex-1 truncate font-mono text-sm">{row.value}</span>
                <CopyButton value={row.value} />
              </div>
            ))}
          </div>
        </div>
      ) : input.trim() ? (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ Not a recognised color value.</p>
      ) : null}
    </div>
  );
}
