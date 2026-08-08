"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

/**
 * Paying only the minimum each month — a percentage of the balance with a fixed
 * floor. The minimum shrinks as the balance falls, dragging out the payoff.
 */
function simulate(balance: number, aprPct: number, minPct: number, floor: number) {
  const r = aprPct / 100 / 12;
  let bal = balance;
  let months = 0;
  let interestPaid = 0;
  let firstPayment = 0;
  while (bal > 0.01 && months < 1200) {
    const interest = bal * r;
    let pay = Math.max(floor, bal * (minPct / 100));
    if (months === 0) firstPayment = Math.min(pay, bal + interest);
    if (pay <= interest) return { never: true, interest };
    if (pay > bal + interest) pay = bal + interest;
    interestPaid += interest;
    bal = bal + interest - pay;
    months++;
  }
  return { never: false, months, interestPaid, totalPaid: balance + interestPaid, firstPayment };
}

export default function MinimumPayment() {
  const [balance, setBalance] = useState("100000");
  const [apr, setApr] = useState("36");
  const [minPct, setMinPct] = useState("5");
  const [floor, setFloor] = useState("500");

  const result = useMemo(() => {
    const b = parseFloat(balance);
    const a = parseFloat(apr);
    const m = parseFloat(minPct);
    const f = parseFloat(floor) || 0;
    if (isNaN(b) || isNaN(a) || isNaN(m) || b <= 0 || m <= 0) return null;
    return simulate(b, a, m, f);
  }, [balance, apr, minPct, floor]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Card balance" htmlFor="mp-bal">
          <input id="mp-bal" type="number" className="input" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </Field>
        <Field label="APR (% / year)" htmlFor="mp-apr">
          <input id="mp-apr" type="number" step="0.1" className="input" value={apr} onChange={(e) => setApr(e.target.value)} />
        </Field>
        <Field label="Minimum due (% of balance)" htmlFor="mp-pct">
          <input id="mp-pct" type="number" step="0.5" className="input" value={minPct} onChange={(e) => setMinPct(e.target.value)} />
        </Field>
        <Field label="Minimum floor" htmlFor="mp-floor" hint="lowest fixed amount">
          <input id="mp-floor" type="number" className="input" value={floor} onChange={(e) => setFloor(e.target.value)} />
        </Field>
      </div>

      {result && result.never && (
        <div className="card p-4 text-sm" style={{ color: "var(--danger, #d33)" }}>
          At this APR the minimum payment barely covers the interest — the balance won&apos;t clear. Pay more than the minimum.
        </div>
      )}

      {result && !result.never && (
        <>
          <BigResult
            label="Time to clear paying only the minimum"
            value={`${result.months} months`}
            sub={`${Math.floor(result.months! / 12)} yr ${result.months! % 12} mo`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="First minimum payment" value={money(result.firstPayment!)} />
            <Stat label="Total interest paid" value={money(result.interestPaid!)} />
            <Stat label="Total amount paid" value={money(result.totalPaid!)} />
          </div>
          <p className="text-center text-xs text-[var(--faint)]">
            Because the minimum shrinks as the balance falls, paying only the minimum stretches repayment for years and multiplies the interest.
          </p>
        </>
      )}
    </div>
  );
}
