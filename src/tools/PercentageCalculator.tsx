"use client";

import { useState } from "react";

type Mode = "percentOf" | "isWhatPercent" | "change";

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(10)).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const na = parseFloat(a);
  const nb = parseFloat(b);
  const valid = !isNaN(na) && !isNaN(nb);

  let result = "";
  let sentence = "";
  if (valid) {
    if (mode === "percentOf") {
      result = fmt((na / 100) * nb);
      sentence = `${fmt(na)}% of ${fmt(nb)} is ${result}`;
    } else if (mode === "isWhatPercent") {
      result = fmt((na / nb) * 100) + "%";
      sentence = `${fmt(na)} is ${result} of ${fmt(nb)}`;
    } else {
      const diff = ((nb - na) / na) * 100;
      result = (diff >= 0 ? "+" : "") + fmt(diff) + "%";
      sentence = `From ${fmt(na)} to ${fmt(nb)} is a ${diff >= 0 ? "increase" : "decrease"} of ${fmt(Math.abs(diff))}%`;
    }
  }

  const labels: Record<Mode, [string, string, string]> = {
    percentOf: ["What is", "% of", ""],
    isWhatPercent: ["", "is what % of", ""],
    change: ["Percentage change from", "to", ""],
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Tab active={mode === "percentOf"} onClick={() => setMode("percentOf")} label="X% of Y" />
        <Tab active={mode === "isWhatPercent"} onClick={() => setMode("isWhatPercent")} label="X is what % of Y" />
        <Tab active={mode === "change"} onClick={() => setMode("change")} label="% increase / decrease" />
      </div>

      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-3">
          {labels[mode][0] && <span className="text-[var(--muted)]">{labels[mode][0]}</span>}
          <input type="number" className="input w-32" placeholder="0" value={a} onChange={(e) => setA(e.target.value)} aria-label="First value" />
          <span className="text-[var(--muted)]">{labels[mode][1]}</span>
          <input type="number" className="input w-32" placeholder="0" value={b} onChange={(e) => setB(e.target.value)} aria-label="Second value" />
        </div>

        <div className="mt-5 rounded-lg p-4 text-center" style={{ background: "var(--surface-2)" }}>
          <div className="text-3xl font-bold" style={{ color: "var(--brand)" }}>{valid ? result : "—"}</div>
          {valid && <p className="mt-1 text-sm text-[var(--muted)]">{sentence}</p>}
        </div>
      </div>
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-semibold"
      style={{ background: active ? "var(--brand)" : "var(--surface-2)", color: active ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
    >
      {label}
    </button>
  );
}
