"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  Field,
  GrowthChart,
  SplitBar,
  Stat,
  money,
  type YearPoint,
} from "./finance/shared";

/**
 * Recurring Deposit: a fixed sum deposited each month, with interest compounded
 * quarterly (the bank convention). We grow the balance by an equivalent monthly
 * rate m where (1+m)^3 = 1 + quarterly rate.
 */
function simulate(monthly: number, ratePct: number, years: number) {
  const q = ratePct / 100 / 4; // quarterly rate
  const m = Math.pow(1 + q, 1 / 3) - 1; // equivalent monthly rate
  const totalMonths = Math.round(years * 12);
  let balance = 0;
  let deposited = 0;
  const data: YearPoint[] = [{ year: 0, invested: 0, value: 0 }];
  for (let mo = 1; mo <= totalMonths; mo++) {
    balance = (balance + monthly) * (1 + m);
    deposited += monthly;
    if (mo % 12 === 0 || mo === totalMonths) {
      data.push({ year: mo / 12, invested: deposited, value: balance });
    }
  }
  return { maturity: balance, deposited, interest: balance - deposited, data };
}

export default function RdCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const P = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(P) || isNaN(r) || isNaN(y) || P <= 0 || y <= 0) return null;
    return simulate(P, r, y);
  }, [monthly, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Monthly deposit" htmlFor="rd-p">
          <input id="rd-p" type="number" className="input" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="rd-r" hint="compounded quarterly">
          <input id="rd-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="rd-y">
          <input id="rd-y" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Maturity value" value={money(result.maturity)} sub={`after ${years} years`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Total deposited" value={money(result.deposited)} />
            <Stat label="Interest earned" value={money(result.interest)} />
          </div>
          <SplitBar invested={result.deposited} gains={result.interest} investedLabel="Deposited" gainsLabel="Interest" />
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
