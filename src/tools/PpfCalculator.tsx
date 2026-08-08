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

/** PPF: yearly deposit at the start of each year, interest compounded annually. */
function simulate(yearly: number, ratePct: number, years: number) {
  const r = ratePct / 100;
  let balance = 0;
  let deposited = 0;
  const data: YearPoint[] = [{ year: 0, invested: 0, value: 0 }];
  for (let y = 1; y <= years; y++) {
    balance = (balance + yearly) * (1 + r);
    deposited += yearly;
    data.push({ year: y, invested: deposited, value: balance });
  }
  return { maturity: balance, deposited, interest: balance - deposited, data };
}

export default function PpfCalculator() {
  const [yearly, setYearly] = useState("150000");
  const [rate, setRate] = useState("7.1");
  const [years, setYears] = useState("15");

  const result = useMemo(() => {
    const P = parseFloat(yearly);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(P) || isNaN(r) || isNaN(y) || P <= 0 || y <= 0) return null;
    return simulate(P, r, Math.round(y));
  }, [yearly, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Yearly deposit" htmlFor="ppf-p" hint="max ₹1.5 lakh / year">
          <input id="ppf-p" type="number" className="input" value={yearly} onChange={(e) => setYearly(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="ppf-r">
          <input id="ppf-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="ppf-y" hint="15 yrs, extendable in blocks of 5">
          <input id="ppf-y" type="number" step="1" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Maturity value" value={money(result.maturity)} sub={`after ${Math.round(parseFloat(years))} years`} />
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
