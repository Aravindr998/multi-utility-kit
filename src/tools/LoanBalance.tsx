"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, SplitBar, Stat, money } from "./finance/shared";
import { balanceAfter, emi } from "./loans/emi";

/** Outstanding balance and split of what's been paid after N instalments. */
export default function LoanBalance() {
  const [amount, setAmount] = useState("3000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");
  const [paid, setPaid] = useState("60");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const k = parseFloat(paid);
    if ([P, r, y, k].some((v) => isNaN(v)) || P <= 0 || y <= 0 || k < 0) return null;
    const months = Math.round(y * 12);
    const n = Math.min(Math.round(k), months);
    const pay = emi(P, r, months);
    const balance = balanceAfter(P, r, months, n);
    const principalPaid = P - balance;
    const interestPaid = pay * n - principalPaid;
    return { balance, principalPaid, interestPaid, pay, n, months, remaining: months - n };
  }, [amount, rate, years, paid]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Loan amount" htmlFor="lb-amt">
          <input id="lb-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="lb-rate">
          <input id="lb-rate" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="lb-yrs">
          <input id="lb-yrs" type="number" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="EMIs paid so far" htmlFor="lb-paid">
          <input id="lb-paid" type="number" className="input" value={paid} onChange={(e) => setPaid(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Outstanding balance"
            value={money(result.balance)}
            sub={`after ${result.n} of ${result.months} EMIs · ${result.remaining} left`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Principal repaid" value={money(result.principalPaid)} />
            <Stat label="Interest paid" value={money(result.interestPaid)} />
            <Stat label="Monthly EMI" value={money(result.pay)} />
          </div>
          <SplitBar
            invested={result.principalPaid}
            gains={result.balance}
            investedLabel="Principal repaid"
            gainsLabel="Balance left"
          />
        </>
      )}
    </div>
  );
}
