"use client";

import { useState } from "react";
import { randInt, randFloat } from "@/lib/random";
import { Toggle } from "@/components/textControls";

export default function RandomNumber() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [decimals, setDecimals] = useState(false);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const lo = parseFloat(min);
    const hi = parseFloat(max);
    const n = Math.max(1, Math.min(10000, parseInt(count) || 1));
    if (isNaN(lo) || isNaN(hi)) {
      setError("Enter valid minimum and maximum numbers.");
      return;
    }
    const a = Math.min(lo, hi);
    const b = Math.max(lo, hi);
    if (decimals) {
      setResults(Array.from({ length: n }, () => Math.round(randFloat(a, b) * 100) / 100));
    } else if (unique) {
      const rangeSize = Math.floor(b) - Math.ceil(a) + 1;
      if (n > rangeSize) {
        setError(`Only ${rangeSize} unique whole numbers exist in this range.`);
        return;
      }
      const set = new Set<number>();
      while (set.size < n) set.add(randInt(a, b));
      setResults([...set]);
    } else {
      setResults(Array.from({ length: n }, () => randInt(a, b)));
    }
    setError("");
  }

  function copy() {
    navigator.clipboard?.writeText(results.join(", ")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="rn-min">Minimum</label>
            <input id="rn-min" type="number" className="input" value={min} onChange={(e) => setMin(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="rn-max">Maximum</label>
            <input id="rn-max" type="number" className="input" value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="rn-count">How many</label>
            <input id="rn-count" type="number" min={1} max={10000} className="input" value={count} onChange={(e) => setCount(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Toggle checked={decimals} onChange={setDecimals} label="Decimals" />
          <Toggle checked={unique} onChange={(v) => { setUnique(v); }} label="No duplicates" />
        </div>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}
      </div>

      {results.length === 1 && (
        <div key={results[0] + "-" + Math.random()} className="card animate-fade-up p-8 text-center">
          <div className="font-mono text-6xl font-bold tabular-nums" style={{ color: "var(--brand)" }}>
            {results[0].toLocaleString()}
          </div>
        </div>
      )}

      {results.length > 1 && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">{results.length} numbers</span>
            <button onClick={copy} className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]">
              {copied ? "Copied" : "Copy all"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((n, i) => (
              <span key={i} className="rounded-md px-2.5 py-1 font-mono text-sm tabular-nums" style={{ background: "var(--surface-2)" }}>
                {n.toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
