"use client";

import { useState } from "react";
import { randInt } from "@/lib/random";

const TYPES = [4, 6, 8, 10, 12, 20];

export default function Dice() {
  const [sides, setSides] = useState(6);
  const [custom, setCustom] = useState("100");
  const [count, setCount] = useState(2);
  const [rolls, setRolls] = useState<number[]>([]);
  const [key, setKey] = useState(0);

  function roll() {
    const s = sides === 0 ? Math.max(2, Math.min(1000, parseInt(custom) || 6)) : sides;
    const n = Math.max(1, Math.min(20, count || 1));
    setRolls(Array.from({ length: n }, () => randInt(1, s)));
    setKey((k) => k + 1);
  }

  const total = rolls.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div>
          <span className="label">Die type</span>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <TypeBtn key={t} active={sides === t} onClick={() => setSides(t)} label={`d${t}`} />
            ))}
            <TypeBtn active={sides === 0} onClick={() => setSides(0)} label="Custom" />
            {sides === 0 && (
              <input
                type="number"
                min={2}
                max={1000}
                className="input w-24"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                aria-label="Custom sides"
              />
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label" htmlFor="dice-count">Number of dice</label>
            <input id="dice-count" type="number" min={1} max={20} className="input w-24" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
          </div>
          <button className="btn btn-primary px-6" onClick={roll}>Roll</button>
        </div>
      </div>

      {rolls.length > 0 && (
        <div className="card p-6">
          <div key={key} className="flex flex-wrap justify-center gap-3">
            {rolls.map((r, i) => (
              <div
                key={i}
                className="animate-fade-up grid h-16 w-16 place-items-center rounded-xl border text-2xl font-bold"
                style={{ background: "var(--surface-2)", borderColor: "var(--border-strong)", animationDelay: `${i * 40}ms` }}
              >
                {r}
              </div>
            ))}
          </div>
          {rolls.length > 1 && (
            <p className="mt-5 text-center text-lg">
              Total: <span className="font-bold" style={{ color: "var(--brand)" }}>{total}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TypeBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
      style={{
        background: active ? "var(--brand)" : "var(--surface-2)",
        color: active ? "var(--on-brand)" : "var(--foreground)",
        border: "1px solid var(--border)",
      }}
    >
      {label}
    </button>
  );
}
