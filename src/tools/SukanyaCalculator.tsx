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
 * Sukanya Samriddhi Yojana: deposits are made for the first 15 years, but the
 * account matures 21 years from opening. Interest (compounded annually) keeps
 * accruing during the final 6 years with no further deposits.
 */
const DEPOSIT_YEARS = 15;
const MATURITY_YEARS = 21;

function simulate(yearly: number, ratePct: number) {
  const r = ratePct / 100;
  let balance = 0;
  let deposited = 0;
  const data: YearPoint[] = [{ year: 0, invested: 0, value: 0 }];
  for (let y = 1; y <= MATURITY_YEARS; y++) {
    if (y <= DEPOSIT_YEARS) {
      balance += yearly;
      deposited += yearly;
    }
    balance *= 1 + r;
    data.push({ year: y, invested: deposited, value: balance });
  }
  return { maturity: balance, deposited, interest: balance - deposited, data };
}

export default function SukanyaCalculator() {
  const [yearly, setYearly] = useState("150000");
  const [rate, setRate] = useState("8.2");

  const result = useMemo(() => {
    const P = parseFloat(yearly);
    const r = parseFloat(rate);
    if (isNaN(P) || isNaN(r) || P <= 0) return null;
    return simulate(P, r);
  }, [yearly, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Yearly deposit" htmlFor="ssy-p" hint="₹250 to ₹1.5 lakh / year">
          <input id="ssy-p" type="number" className="input" value={yearly} onChange={(e) => setYearly(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="ssy-r">
          <input id="ssy-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Maturity value" value={money(result.maturity)} sub="after 21 years (15 years of deposits)" />
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
