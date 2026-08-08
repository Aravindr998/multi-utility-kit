"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

/**
 * Senior Citizen Savings Scheme: a lumpsum that pays simple interest every
 * quarter for 5 years; the principal is returned at maturity.
 */
export default function ScssCalculator() {
  const [principal, setPrincipal] = useState("1500000");
  const [rate, setRate] = useState("8.2");
  const [years] = useState(5);

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    if (isNaN(P) || isNaN(r) || P <= 0) return null;
    const quarterly = (P * (r / 100)) / 4;
    const totalInterest = P * (r / 100) * years;
    return { quarterly, totalInterest, maturity: P, total: P + totalInterest, principal: P };
  }, [principal, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Deposit amount" htmlFor="scss-p" hint="max ₹30 lakh">
          <input id="scss-p" type="number" className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="scss-r" hint="paid quarterly · 5-year term">
          <input id="scss-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Quarterly interest payout" value={money(result.quarterly)} sub="every 3 months for 5 years" />
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
