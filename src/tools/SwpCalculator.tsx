"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, GrowthChart, Stat, money, monthlyRate, type YearPoint } from "./finance/shared";

/**
 * Systematic Withdrawal Plan: start with a lumpsum, withdraw a fixed amount at
 * the start of each month while the remaining balance keeps growing.
 */
function simulate(principal: number, ratePct: number, withdrawal: number, years: number) {
  const i = monthlyRate(ratePct);
  const totalMonths = Math.round(years * 12);
  let balance = principal;
  let withdrawn = 0;
  let monthsLasted = 0;
  const data: YearPoint[] = [{ year: 0, invested: principal, value: principal }];
  for (let m = 1; m <= totalMonths; m++) {
    if (balance <= 0) break;
    const take = Math.min(withdrawal, balance);
    balance -= take;
    withdrawn += take;
    balance *= 1 + i;
    monthsLasted = m;
    if (m % 12 === 0 || m === totalMonths) {
      data.push({ year: m / 12, invested: principal, value: Math.max(0, balance) });
    }
  }
  const depleted = balance <= 0 && monthsLasted < totalMonths;
  return { balance: Math.max(0, balance), withdrawn, monthsLasted, depleted, data };
}

export default function SwpCalculator() {
  const [amount, setAmount] = useState("1000000");
  const [rate, setRate] = useState("8");
  const [withdrawal, setWithdrawal] = useState("8000");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const w = parseFloat(withdrawal);
    const y = parseFloat(years);
    if (isNaN(P) || isNaN(r) || isNaN(w) || isNaN(y) || P <= 0 || w <= 0 || y <= 0) return null;
    return simulate(P, r, w, y);
  }, [amount, rate, withdrawal, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Total investment" htmlFor="swp-amt">
          <input id="swp-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="swp-rate">
          <input id="swp-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Monthly withdrawal" htmlFor="swp-w">
          <input id="swp-w" type="number" className="input" value={withdrawal} onChange={(e) => setWithdrawal(e.target.value)} />
        </Field>
        <Field label="Time period (years)" htmlFor="swp-yrs">
          <input id="swp-yrs" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Final balance"
            value={money(result.balance)}
            sub={
              result.depleted
                ? `Corpus ran out after ${Math.floor(result.monthsLasted / 12)}y ${result.monthsLasted % 12}m`
                : `after ${years} years of withdrawals`
            }
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Total withdrawn" value={money(result.withdrawn)} />
            <Stat
              label="Months of income"
              value={`${result.monthsLasted}`}
              hint={`${Math.floor(result.monthsLasted / 12)} yr ${result.monthsLasted % 12} mo`}
            />
          </div>
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
