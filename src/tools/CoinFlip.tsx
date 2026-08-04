"use client";

import { useState } from "react";
import { randInt } from "@/lib/random";

type Side = "Heads" | "Tails";

export default function CoinFlip() {
  const [result, setResult] = useState<Side | null>(null);
  const [tally, setTally] = useState({ Heads: 0, Tails: 0 });
  const [key, setKey] = useState(0);

  function flip() {
    const r: Side = randInt(0, 1) === 0 ? "Heads" : "Tails";
    setResult(r);
    setTally((t) => ({ ...t, [r]: t[r] + 1 }));
    setKey((k) => k + 1);
  }

  const total = tally.Heads + tally.Tails;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className="space-y-5">
      <div className="card flex flex-col items-center gap-6 p-8">
        <div
          key={key}
          className={result ? "animate-fade-up" : ""}
          style={{
            width: 128,
            height: 128,
            borderRadius: "9999px",
            display: "grid",
            placeItems: "center",
            background: "var(--brand-soft)",
            border: "3px solid var(--border-strong)",
          }}
        >
          <span className="text-center">
            <span className="block text-4xl">{result === "Tails" ? "🪙" : result === "Heads" ? "👑" : "🪙"}</span>
            <span className="mt-1 block text-sm font-bold uppercase tracking-wider">
              {result ?? "Flip!"}
            </span>
          </span>
        </div>
        <button className="btn btn-primary px-8" onClick={flip}>Flip coin</button>
      </div>

      {total > 0 && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">{total} flip{total === 1 ? "" : "s"}</span>
            <button
              onClick={() => { setTally({ Heads: 0, Tails: 0 }); setResult(null); }}
              className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Tally label="Heads" value={tally.Heads} pct={pct(tally.Heads)} />
            <Tally label="Tails" value={tally.Tails} pct={pct(tally.Tails)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Tally({ label, value, pct }: { label: string; value: number; pct: number }) {
  return (
    <div className="rounded-lg p-4 text-center" style={{ background: "var(--surface-2)" }}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-[var(--muted)]">{label} · {pct}%</div>
    </div>
  );
}
