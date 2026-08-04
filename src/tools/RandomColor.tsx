"use client";

import { useEffect, useState } from "react";
import { randInt } from "@/lib/random";
import { Segmented } from "@/components/textControls";

type RGB = [number, number, number];

function toHex([r, g, b]: RGB) {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function toRgb([r, g, b]: RGB) {
  return `rgb(${r}, ${g}, ${b})`;
}
function toHsl([r, g, b]: RGB) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}
function randColor(): RGB {
  return [randInt(0, 255), randInt(0, 255), randInt(0, 255)];
}

export default function RandomColor() {
  const [mode, setMode] = useState<"single" | "palette">("single");
  const [colors, setColors] = useState<RGB[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  function generate() {
    setColors(mode === "single" ? [randColor()] : Array.from({ length: 5 }, randColor));
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function copy(value: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(value);
      setTimeout(() => setCopied((c) => (c === value ? null : c)), 1000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "single", label: "Single" },
            { value: "palette", label: "Palette of 5" },
          ]}
        />
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      <div className={mode === "single" ? "" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
        {colors.map((c, i) => {
          const hex = toHex(c);
          const rgb = toRgb(c);
          const hsl = toHsl(c);
          return (
            <div key={i} className="card overflow-hidden">
              <div style={{ background: hex, height: mode === "single" ? 180 : 120 }} />
              <div className="space-y-1 p-3">
                {[hex, rgb, hsl].map((v) => (
                  <button
                    key={v}
                    onClick={() => copy(v)}
                    className="flex w-full items-center justify-between rounded px-2 py-1 text-left font-mono text-xs hover:bg-[var(--surface-2)]"
                  >
                    <span>{v}</span>
                    <span className="text-[var(--muted)]">{copied === v ? "Copied" : "Copy"}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
