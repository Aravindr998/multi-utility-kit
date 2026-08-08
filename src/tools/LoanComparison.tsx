"use client";

import { useMemo, useState } from "react";
import { money } from "./finance/shared";
import { emi } from "./loans/emi";

type LoanInput = { amount: string; rate: string; years: string };

const INITIAL: LoanInput[] = [
  { amount: "3000000", rate: "8.5", years: "20" },
  { amount: "3000000", rate: "9.25", years: "20" },
];

function compute(l: LoanInput) {
  const P = parseFloat(l.amount);
  const r = parseFloat(l.rate);
  const y = parseFloat(l.years);
  if (isNaN(P) || isNaN(r) || isNaN(y) || P <= 0 || y <= 0) return null;
  const months = Math.round(y * 12);
  const pay = emi(P, r, months);
  const total = pay * months;
  return { pay, total, interest: total - P, principal: P, months };
}

export default function LoanComparison() {
  const [loans, setLoans] = useState<LoanInput[]>(INITIAL);

  const update = (i: number, patch: Partial<LoanInput>) =>
    setLoans((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const results = useMemo(() => loans.map(compute), [loans]);
  const validTotals = results.map((r) => (r ? r.total : Infinity));
  const bestIdx = validTotals.every((v) => v === Infinity) ? -1 : validTotals.indexOf(Math.min(...validTotals));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {loans.map((l, i) => (
          <div key={i} className="card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Loan {String.fromCharCode(65 + i)}</h3>
              {loans.length > 2 && (
                <button className="btn btn-ghost px-2 py-1 text-xs" onClick={() => setLoans((ls) => ls.filter((_, idx) => idx !== i))}>
                  Remove
                </button>
              )}
            </div>
            <div>
              <label className="label">Loan amount</label>
              <input type="number" className="input" value={l.amount} onChange={(e) => update(i, { amount: e.target.value })} />
            </div>
            <div>
              <label className="label">Interest rate (% / year)</label>
              <input type="number" step="0.05" className="input" value={l.rate} onChange={(e) => update(i, { rate: e.target.value })} />
            </div>
            <div>
              <label className="label">Tenure (years)</label>
              <input type="number" className="input" value={l.years} onChange={(e) => update(i, { years: e.target.value })} />
            </div>
          </div>
        ))}
      </div>

      {loans.length < 3 && (
        <button className="btn btn-secondary" onClick={() => setLoans((ls) => [...ls, { amount: "3000000", rate: "9", years: "20" }])}>
          + Add a loan
        </button>
      )}

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted)]">
              <th className="py-1 pr-4 font-medium">Loan</th>
              <th className="py-1 pr-4 font-medium">Monthly EMI</th>
              <th className="py-1 pr-4 font-medium">Total interest</th>
              <th className="py-1 font-medium">Total payable</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                className="border-t"
                style={{ borderColor: "var(--border)", background: i === bestIdx ? "var(--brand-soft)" : undefined }}
              >
                <td className="py-2 pr-4 font-medium">
                  Loan {String.fromCharCode(65 + i)} {i === bestIdx && <span style={{ color: "var(--brand)" }}>· cheapest</span>}
                </td>
                <td className="py-2 pr-4">{r ? money(r.pay) : "—"}</td>
                <td className="py-2 pr-4">{r ? money(r.interest) : "—"}</td>
                <td className="py-2">{r ? money(r.total) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bestIdx >= 0 && results.filter(Boolean).length > 1 && (
        <p className="text-center text-sm text-[var(--muted)]">
          Loan {String.fromCharCode(65 + bestIdx)} costs the least overall. The gap versus the most expensive option is{" "}
          <strong style={{ color: "var(--brand)" }}>
            {money(Math.max(...validTotals.filter((v) => v !== Infinity)) - Math.min(...validTotals.filter((v) => v !== Infinity)))}
          </strong>{" "}
          in total payments.
        </p>
      )}
    </div>
  );
}
