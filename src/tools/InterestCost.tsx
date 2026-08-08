"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

/**
 * The cost of carrying a credit-card balance: daily, monthly and (if carried)
 * the interest accrued over a chosen number of months with no repayment.
 */
export default function InterestCost() {
  const [balance, setBalance] = useState("100000");
  const [apr, setApr] = useState("36");
  const [months, setMonths] = useState("6");

  const result = useMemo(() => {
    const b = parseFloat(balance);
    const a = parseFloat(apr);
    const n = parseFloat(months);
    if (isNaN(b) || isNaN(a) || b <= 0) return null;
    const dailyRate = a / 100 / 365;
    const monthlyRate = a / 100 / 12;
    const daily = b * dailyRate;
    const monthly = b * monthlyRate;
    const yearly = b * (a / 100);
    // Interest compounded monthly over n months with no repayment.
    const carried = isNaN(n) || n <= 0 ? 0 : b * (Math.pow(1 + monthlyRate, n) - 1);
    return { daily, monthly, yearly, carried, months: n };
  }, [balance, apr, months]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Balance carried" htmlFor="ic-bal">
          <input id="ic-bal" type="number" className="input" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </Field>
        <Field label="APR (% / year)" htmlFor="ic-apr">
          <input id="ic-apr" type="number" step="0.1" className="input" value={apr} onChange={(e) => setApr(e.target.value)} />
        </Field>
        <Field label="Carried for (months)" htmlFor="ic-n" hint="no repayment assumed">
          <input id="ic-n" type="number" className="input" value={months} onChange={(e) => setMonths(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label={result.months > 0 ? `Interest over ${result.months} months` : "Monthly interest"}
            value={money(result.months > 0 ? result.carried : result.monthly)}
            sub={result.months > 0 ? "compounded, no repayment" : undefined}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Interest per day" value={money(result.daily)} />
            <Stat label="Interest per month" value={money(result.monthly)} />
            <Stat label="Interest per year" value={money(result.yearly)} />
          </div>
        </>
      )}
    </div>
  );
}
