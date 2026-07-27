"use client";

import { useMemo, useState } from "react";

function money(n: number): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function LoanCalculator() {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");
  const [unit, setUnit] = useState<"years" | "months">("years");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const annual = parseFloat(rate);
    const t = parseFloat(tenure);
    if (isNaN(P) || isNaN(annual) || isNaN(t) || P <= 0 || t <= 0) return null;
    const n = unit === "years" ? Math.round(t * 12) : Math.round(t);
    const r = annual / 12 / 100;
    let emi: number;
    if (r === 0) emi = P / n;
    else emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - P;
    return { emi, total, interest, principal: P, n };
  }, [amount, rate, tenure, unit]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="amt">Loan amount</label>
          <input id="amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="rate">Interest rate (% / year)</label>
          <input id="rate" type="number" step="0.01" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="ten">Tenure</label>
          <div className="flex gap-2">
            <input id="ten" type="number" className="input" value={tenure} onChange={(e) => setTenure(e.target.value)} />
            <select className="input w-28" value={unit} onChange={(e) => setUnit(e.target.value as "years" | "months")}>
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="card p-6 text-center">
            <p className="text-sm text-[var(--muted)]">Monthly EMI</p>
            <p className="mt-1 text-4xl font-bold" style={{ color: "var(--brand)" }}>{money(result.emi)}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">over {result.n} payments</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Principal" value={money(result.principal)} />
            <Stat label="Total interest" value={money(result.interest)} />
            <Stat label="Total payable" value={money(result.total)} />
          </div>
          <InterestBar principal={result.principal} interest={result.interest} />
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}

function InterestBar({ principal, interest }: { principal: number; interest: number }) {
  const total = principal + interest;
  const pPct = total > 0 ? (principal / total) * 100 : 0;
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
        <div style={{ width: `${pPct}%`, background: "var(--brand)" }} />
        <div style={{ width: `${100 - pPct}%`, background: "var(--accent)" }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
        <span>◼ Principal {pPct.toFixed(0)}%</span>
        <span>Interest {(100 - pPct).toFixed(0)}% ◼</span>
      </div>
    </div>
  );
}
