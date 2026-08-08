"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { principalForEmi } from "./loans/emi";

/**
 * Loan eligibility from income using FOIR (Fixed Obligation to Income Ratio):
 * the lender caps your total EMIs at FOIR% of income, minus existing EMIs.
 */
export default function LoanEligibility() {
  const [income, setIncome] = useState("80000");
  const [existing, setExisting] = useState("5000");
  const [foir, setFoir] = useState("50");
  const [rate, setRate] = useState("9");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const inc = parseFloat(income);
    const ex = parseFloat(existing) || 0;
    const f = parseFloat(foir);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if ([inc, f, r, y].some((v) => isNaN(v)) || inc <= 0 || y <= 0) return null;
    const maxEmi = Math.max(0, inc * (f / 100) - ex);
    const months = Math.round(y * 12);
    const eligible = principalForEmi(maxEmi, r, months);
    return { maxEmi, eligible, months };
  }, [income, existing, foir, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Net monthly income" htmlFor="le-inc">
          <input id="le-inc" type="number" className="input" value={income} onChange={(e) => setIncome(e.target.value)} />
        </Field>
        <Field label="Existing monthly EMIs" htmlFor="le-ex" hint="other loans, if any">
          <input id="le-ex" type="number" className="input" value={existing} onChange={(e) => setExisting(e.target.value)} />
        </Field>
        <Field label="FOIR (%)" htmlFor="le-foir" hint="share of income for EMIs (usually 40–55%)">
          <input id="le-foir" type="number" step="1" className="input" value={foir} onChange={(e) => setFoir(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="le-rate">
          <input id="le-rate" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="le-yrs">
          <input id="le-yrs" type="number" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Eligible loan amount" value={money(result.eligible)} sub={`over ${result.months} months`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
            <Stat label="Maximum affordable EMI" value={money(result.maxEmi)} />
          </div>
        </>
      )}
    </div>
  );
}
