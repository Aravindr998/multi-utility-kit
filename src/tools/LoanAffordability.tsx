"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { emi, principalForEmi } from "./loans/emi";

/**
 * How large a loan you can afford for a given monthly EMI budget — and, with a
 * down payment, the total asset (home/car) price within reach.
 */
export default function LoanAffordability() {
  const [budget, setBudget] = useState("25000");
  const [rate, setRate] = useState("9");
  const [years, setYears] = useState("15");
  const [down, setDown] = useState("500000");

  const result = useMemo(() => {
    const b = parseFloat(budget);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const d = parseFloat(down) || 0;
    if ([b, r, y].some((v) => isNaN(v)) || b <= 0 || y <= 0) return null;
    const months = Math.round(y * 12);
    const loan = principalForEmi(b, r, months);
    const totalPayment = emi(loan, r, months) * months;
    return { loan, months, assetPrice: loan + d, interest: totalPayment - loan, down: d };
  }, [budget, rate, years, down]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Affordable monthly EMI" htmlFor="la-b">
          <input id="la-b" type="number" className="input" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="la-r">
          <input id="la-r" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="la-y">
          <input id="la-y" type="number" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Down payment" htmlFor="la-d" hint="optional, for asset price">
          <input id="la-d" type="number" className="input" value={down} onChange={(e) => setDown(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Loan you can afford" value={money(result.loan)} sub={`at ${money(parseFloat(budget))}/mo for ${result.months} months`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total interest" value={money(result.interest)} />
            <Stat label="Down payment" value={money(result.down)} />
            <Stat label="Affordable asset price" value={money(result.assetPrice)} />
          </div>
        </>
      )}
    </div>
  );
}
