"use client";

import { useMemo, useState } from "react";

function money(n: number): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");

  const result = useMemo(() => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    if (isNaN(a) || isNaN(r) || r < 0) return null;
    if (mode === "add") {
      const tax = a * (r / 100);
      return { net: a, tax, gross: a + tax };
    }
    const net = a / (1 + r / 100);
    return { net, tax: a - net, gross: a };
  }, [amount, rate, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Tab active={mode === "add"} onClick={() => setMode("add")} label="Add tax (exclusive)" />
        <Tab active={mode === "remove"} onClick={() => setMode("remove")} label="Remove tax (inclusive)" />
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="amt">{mode === "add" ? "Amount (before tax)" : "Amount (including tax)"}</label>
          <input id="amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="rate">Tax rate (%)</label>
          <input id="rate" type="number" step="0.01" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Net (before tax)" value={money(result.net)} />
          <Stat label={`Tax (${rate || 0}%)`} value={money(result.tax)} highlight />
          <Stat label="Gross (with tax)" value={money(result.gross)} />
        </div>
      )}
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

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xl font-bold" style={highlight ? { color: "var(--brand)" } : undefined}>{value}</div>
      <div className="mt-0.5 text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}
