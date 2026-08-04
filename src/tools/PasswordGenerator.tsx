"use client";

import { useState } from "react";
import { randInt, shuffle } from "@/lib/random";
import { Toggle } from "@/components/textControls";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";
const AMBIGUOUS = new Set("O0oIl1|`'\"{}[]()/\\".split(""));

function strengthOf(len: number, poolSize: number) {
  const bits = len * Math.log2(Math.max(2, poolSize));
  if (bits < 40) return { label: "Weak", pct: 25, color: "var(--danger)" };
  if (bits < 60) return { label: "Fair", pct: 50, color: "var(--warning)" };
  if (bits < 80) return { label: "Strong", pct: 75, color: "var(--success)" };
  return { label: "Very strong", pct: 100, color: "var(--success)" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [count, setCount] = useState(1);
  const [items, setItems] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  function pools() {
    let p = "";
    if (upper) p += UPPER;
    if (lower) p += LOWER;
    if (digits) p += DIGITS;
    if (symbols) p += SYMBOLS;
    if (noAmbiguous) p = [...p].filter((c) => !AMBIGUOUS.has(c)).join("");
    return p;
  }

  function makeOne(pool: string, required: string[]) {
    const len = Math.max(required.length, length);
    const chars: string[] = required.map((set) => set[randInt(0, set.length - 1)]);
    for (let i = chars.length; i < len; i++) chars.push(pool[randInt(0, pool.length - 1)]);
    return shuffle(chars).join("");
  }

  function generate() {
    const pool = pools();
    if (!pool) {
      setItems(["Select at least one character set."]);
      return;
    }
    const required: string[] = [];
    const clean = (s: string) => (noAmbiguous ? [...s].filter((c) => !AMBIGUOUS.has(c)).join("") : s);
    if (upper) required.push(clean(UPPER));
    if (lower) required.push(clean(LOWER));
    if (digits) required.push(clean(DIGITS));
    if (symbols) required.push(clean(SYMBOLS));
    const n = Math.max(1, Math.min(50, count || 1));
    setItems(Array.from({ length: n }, () => makeOne(pool, required)));
  }

  function copy(i: number, text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(i);
      setTimeout(() => setCopied((c) => (c === i ? null : c)), 1200);
    });
  }

  const s = strengthOf(length, pools().length);

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="label mb-0">Length</span>
            <span className="font-mono text-sm font-semibold">{length}</span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-[var(--brand)]"
          />
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Toggle checked={upper} onChange={setUpper} label="A-Z" />
          <Toggle checked={lower} onChange={setLower} label="a-z" />
          <Toggle checked={digits} onChange={setDigits} label="0-9" />
          <Toggle checked={symbols} onChange={setSymbols} label="Symbols" />
          <Toggle checked={noAmbiguous} onChange={setNoAmbiguous} label="No look-alikes" />
        </div>

        <div>
          <span className="mb-1 flex items-center justify-between text-sm">
            <span className="text-[var(--muted)]">Strength</span>
            <span style={{ color: s.color }}>{s.label}</span>
          </span>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label" htmlFor="pw-count">How many</label>
            <input id="pw-count" type="number" min={1} max={50} className="input w-24" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
          </div>
          <button className="btn btn-primary" onClick={generate}>Generate</button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((p, i) => (
            <div key={i} className="card flex items-center justify-between gap-3 p-3">
              <code className="min-w-0 flex-1 truncate font-mono text-sm">{p}</code>
              <button onClick={() => copy(i, p)} className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]">
                {copied === i ? "Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
