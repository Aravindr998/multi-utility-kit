"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

/**
 * Time and interest to clear a card balance with a fixed monthly payment.
 * Interest compounds monthly on the outstanding balance.
 */
function simulate(balance: number, aprPct: number, payment: number) {
  const r = aprPct / 100 / 12;
  const monthlyInterest0 = balance * r;
  if (payment <= monthlyInterest0) return { never: true, monthlyInterest0 };
  let bal = balance;
  let months = 0;
  let interestPaid = 0;
  while (bal > 0.01 && months < 1200) {
    const interest = bal * r;
    interestPaid += interest;
    bal = bal + interest - payment;
    months++;
  }
  const totalPaid = balance + interestPaid;
  return { never: false, months, interestPaid, totalPaid };
}

export default function CreditCardPayoff() {
  const [balance, setBalance] = useState("100000");
  const [apr, setApr] = useState("36");
  const [payment, setPayment] = useState("5000");

  const result = useMemo(() => {
    const b = parseFloat(balance);
    const a = parseFloat(apr);
    const p = parseFloat(payment);
    if (isNaN(b) || isNaN(a) || isNaN(p) || b <= 0 || p <= 0) return null;
    return simulate(b, a, p);
  }, [balance, apr, payment]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Card balance" htmlFor="ccp-bal">
          <input id="ccp-bal" type="number" className="input" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </Field>
        <Field label="APR (% / year)" htmlFor="ccp-apr">
          <input id="ccp-apr" type="number" step="0.1" className="input" value={apr} onChange={(e) => setApr(e.target.value)} />
        </Field>
        <Field label="Monthly payment" htmlFor="ccp-pay">
          <input id="ccp-pay" type="number" className="input" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </Field>
      </div>

      {result && result.never && (
        <div className="card p-4 text-sm" style={{ color: "var(--danger, #d33)" }}>
          Your monthly payment ({money(parseFloat(payment))}) is less than the first month&apos;s interest ({money(result.monthlyInterest0!)}).
          The balance will never reduce — increase the payment.
        </div>
      )}

      {result && !result.never && (
        <>
          <BigResult
            label="Time to pay off"
            value={`${result.months} months`}
            sub={`${Math.floor(result.months! / 12)} yr ${result.months! % 12} mo`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Total interest paid" value={money(result.interestPaid!)} />
            <Stat label="Total amount paid" value={money(result.totalPaid!)} />
          </div>
        </>
      )}
    </div>
  );
}
