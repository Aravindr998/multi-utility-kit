"use client";

import { useEffect, useRef, useState } from "react";
import { randInt } from "@/lib/random";

const DEFAULT = "Pizza\nSushi\nTacos\nBurgers\nSalad\nRamen";
const KEY = "utilityhub:spinwheel:v1";

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function slicePath(cx: number, cy: number, r: number, start: number, end: number) {
  const [sx, sy] = polar(cx, cy, r, start);
  const [ex, ey] = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M${cx},${cy} L${sx},${sy} A${r},${r} 0 ${large} 1 ${ex},${ey} Z`;
}

export default function SpinWheel() {
  const [text, setText] = useState(DEFAULT);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const pendingIdx = useRef(-1);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setText(s);
    } catch {}
  }, []);

  const options = text.split("\n").map((o) => o.trim()).filter(Boolean);
  const n = options.length;
  const seg = n > 0 ? 360 / n : 360;

  function onText(v: string) {
    setText(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {}
  }

  function spin() {
    if (n < 2 || spinning) return;
    const idx = randInt(0, n - 1);
    pendingIdx.current = idx;
    const target = 360 - (idx * seg + seg / 2);
    const base = rotation - (rotation % 360);
    let next = base + 5 * 360 + target;
    if (next <= rotation) next += 360;
    setWinner(null);
    setSpinning(true);
    setRotation(next);
  }

  const CX = 150, CY = 150, R = 148;

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
        <div className="mx-auto">
          <div className="relative" style={{ width: 300, height: 300 }}>
            {/* pointer */}
            <div
              className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2"
              style={{ width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "20px solid var(--foreground)" }}
              aria-hidden
            />
            <svg width={300} height={300} viewBox="0 0 300 300">
              <g
                style={{
                  transformOrigin: "150px 150px",
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                }}
                onTransitionEnd={() => {
                  if (pendingIdx.current >= 0) {
                    setWinner(options[pendingIdx.current] ?? null);
                    setSpinning(false);
                  }
                }}
              >
                {n === 0 ? (
                  <circle cx={CX} cy={CY} r={R} fill="var(--surface-2)" />
                ) : (
                  options.map((opt, i) => {
                    const start = i * seg;
                    const end = (i + 1) * seg;
                    const hue = Math.round((i * 360) / n);
                    const [tx, ty] = polar(CX, CY, R * 0.62, start + seg / 2);
                    return (
                      <g key={i}>
                        <path d={slicePath(CX, CY, R, start, end)} fill={`hsl(${hue}, 62%, 55%)`} stroke="var(--surface)" strokeWidth={1} />
                        <text
                          x={tx}
                          y={ty}
                          fill="#fff"
                          fontSize={n > 12 ? 9 : 12}
                          fontWeight={600}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${start + seg / 2}, ${tx}, ${ty})`}
                        >
                          {opt.length > 14 ? opt.slice(0, 13) + "…" : opt}
                        </text>
                      </g>
                    );
                  })
                )}
                <circle cx={CX} cy={CY} r={16} fill="var(--surface)" stroke="var(--border-strong)" strokeWidth={2} />
              </g>
            </svg>
          </div>
          <button className="btn btn-primary mt-4 w-full" onClick={spin} disabled={n < 2 || spinning}>
            {spinning ? "Spinning…" : "Spin"}
          </button>
          {winner && (
            <div className="animate-fade-up mt-3 rounded-lg p-3 text-center" style={{ background: "var(--brand-soft)" }}>
              <span className="text-sm text-[var(--muted)]">Winner</span>
              <p className="text-lg font-bold">{winner}</p>
            </div>
          )}
        </div>

        <div>
          <label className="label" htmlFor="sw-opts">Options (one per line)</label>
          <textarea
            id="sw-opts"
            value={text}
            onChange={(e) => onText(e.target.value)}
            spellCheck={false}
            className="input scroll-thin min-h-[240px] resize-y leading-relaxed"
          />
          <p className="mt-2 text-xs text-[var(--muted)]">{n} option{n === 1 ? "" : "s"} · saved on this device</p>
        </div>
      </div>
    </div>
  );
}
