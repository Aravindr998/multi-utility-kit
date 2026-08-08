"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";
import { emi } from "./loans/emi";

/** Find the reducing-balance rate that yields a given EMI, by bisection. */
function rateForEmi(P: number, targetEmi: number, months: number): number {
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const e = emi(P, mid, months);
    if (Math.abs(e - targetEmi) < 1e-6) return mid;
    if (e < targetEmi) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Compares a reducing-balance loan with a flat-rate loan at the same quoted rate,
 * and shows the effective (reducing) rate a flat loan really costs.
 */
export default function ReducingBalance() {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if ([P, r, y].some((v) => isNaN(v)) || P <= 0 || y <= 0) return null;
    const months = Math.round(y * 12);

    const redEmi = emi(P, r, months);
    const redInterest = redEmi * months - P;

    const flatInterest = (P * (r / 100)) * y;
    const flatEmi = (P + flatInterest) / months;
    const flatEffectiveRate = rateForEmi(P, flatEmi, months);

    return {
      months,
      redEmi,
      redInterest,
      flatEmi,
      flatInterest,
      flatEffectiveRate,
      extra: flatInterest - redInterest,
    };
  }, [amount, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Loan amount" htmlFor="rb-amt">
          <input id="rb-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Quoted interest rate (% / year)" htmlFor="rb-rate">
          <input id="rb-rate" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="rb-yrs">
          <input id="rb-yrs" type="number" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Reducing-balance EMI"
            value={money(result.redEmi)}
            sub={`over ${result.months} payments`}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-4">
              <h3 className="mb-2 font-semibold" style={{ color: "var(--brand)" }}>Reducing balance</h3>
              <div className="space-y-1 text-sm">
                <Row label="Monthly EMI" value={money(result.redEmi)} />
                <Row label="Total interest" value={money(result.redInterest)} />
              </div>
            </div>
            <div className="card p-4">
              <h3 className="mb-2 font-semibold" style={{ color: "var(--accent)" }}>Flat rate (same quoted %)</h3>
              <div className="space-y-1 text-sm">
                <Row label="Monthly EMI" value={money(result.flatEmi)} />
                <Row label="Total interest" value={money(result.flatInterest)} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat
              label="A flat rate really costs"
              value={pct(result.flatEffectiveRate)}
              hint={`vs the ${pct(parseFloat(rate))} quoted`}
            />
            <Stat label="Extra you'd pay on a flat loan" value={money(result.extra)} />
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
