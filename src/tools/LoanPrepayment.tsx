"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { emi } from "./loans/emi";

/**
 * One-time prepayment made after `afterMonths` instalments, keeping the EMI the
 * same so the tenure shortens. Reports interest saved and months shaved off.
 */
function simulate(P: number, ratePct: number, months: number, prepay: number, afterMonths: number) {
  const r = ratePct / 100 / 12;
  const pay = emi(P, ratePct, months);

  const run = (prepayAt: number, prepayAmt: number) => {
    let balance = P;
    let interestPaid = 0;
    let count = 0;
    for (let m = 1; m <= months * 3 && balance > 0.01; m++) {
      const interest = balance * r;
      let principal = pay - interest;
      interestPaid += interest;
      balance -= principal;
      if (m === prepayAt && prepayAmt > 0) balance -= prepayAmt;
      count = m;
      if (balance <= 0.01) break;
    }
    return { interestPaid, count };
  };

  const base = run(0, 0);
  const withPre = run(afterMonths, prepay);
  return {
    pay,
    baseInterest: base.interestPaid,
    newInterest: withPre.interestPaid,
    interestSaved: base.interestPaid - withPre.interestPaid,
    baseMonths: base.count,
    newMonths: withPre.count,
    monthsSaved: base.count - withPre.count,
  };
}

export default function LoanPrepayment() {
  const [amount, setAmount] = useState("3000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");
  const [prepay, setPrepay] = useState("500000");
  const [after, setAfter] = useState("36");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const pp = parseFloat(prepay);
    const af = parseFloat(after);
    if ([P, r, y, pp, af].some((v) => isNaN(v)) || P <= 0 || y <= 0 || pp <= 0) return null;
    return simulate(P, r, Math.round(y * 12), pp, Math.round(af));
  }, [amount, rate, years, prepay, after]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Loan amount" htmlFor="lp-amt">
          <input id="lp-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="lp-rate">
          <input id="lp-rate" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="lp-yrs">
          <input id="lp-yrs" type="number" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Prepayment amount" htmlFor="lp-pp">
          <input id="lp-pp" type="number" className="input" value={prepay} onChange={(e) => setPrepay(e.target.value)} />
        </Field>
        <Field label="Prepay after (months)" htmlFor="lp-af" hint="how many EMIs paid first">
          <input id="lp-af" type="number" className="input" value={after} onChange={(e) => setAfter(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Interest saved" value={money(result.interestSaved)} sub={`EMI stays ${money(result.pay)}, tenure shortens`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Original interest" value={money(result.baseInterest)} />
            <Stat label="New interest" value={money(result.newInterest)} />
            <Stat label="Months saved" value={`${result.monthsSaved}`} hint={`${Math.floor(result.monthsSaved / 12)} yr ${result.monthsSaved % 12} mo`} />
            <Stat label="New tenure" value={`${result.newMonths} mo`} hint={`was ${result.baseMonths} mo`} />
          </div>
        </>
      )}
    </div>
  );
}
