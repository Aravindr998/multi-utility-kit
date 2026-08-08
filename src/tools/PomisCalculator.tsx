"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

/**
 * Post Office Monthly Income Scheme: a lumpsum that pays simple interest every
 * month for 5 years; the principal is returned at maturity.
 */
export default function PomisCalculator() {
  const [principal, setPrincipal] = useState("900000");
  const [rate, setRate] = useState("7.4");
  const [years] = useState(5);

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    if (isNaN(P) || isNaN(r) || P <= 0) return null;
    const monthly = (P * (r / 100)) / 12;
    const totalInterest = P * (r / 100) * years;
    return { monthly, totalInterest, maturity: P, total: P + totalInterest };
  }, [principal, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Deposit amount" htmlFor="mis-p" hint="max ₹9 lakh single / ₹15 lakh joint">
          <input id="mis-p" type="number" className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="mis-r" hint="paid monthly · 5-year term">
          <input id="mis-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Monthly income" value={money(result.monthly)} sub="every month for 5 years" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total interest (5 yrs)" value={money(result.totalInterest)} />
            <Stat label="Principal returned" value={money(result.maturity)} />
            <Stat label="Total value" value={money(result.total)} />
          </div>
        </>
      )}
    </div>
  );
}
