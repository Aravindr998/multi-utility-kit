"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, SplitBar, Stat, money } from "./finance/shared";
import { emi } from "./loans/emi";

/**
 * Converts a credit-card purchase to EMIs. Card issuers usually charge a
 * one-time processing fee plus GST on the interest component.
 */
export default function CreditCardEmi() {
  const [amount, setAmount] = useState("50000");
  const [rate, setRate] = useState("16");
  const [months, setMonths] = useState("12");
  const [fee, setFee] = useState("199");
  const [gst, setGst] = useState("18");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const n = parseFloat(months);
    const f = parseFloat(fee) || 0;
    const g = parseFloat(gst) || 0;
    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || n <= 0) return null;
    const baseEmi = emi(P, r, Math.round(n));
    const totalPayment = baseEmi * Math.round(n);
    const interest = totalPayment - P;
    const gstOnInterest = interest * (g / 100);
    const totalCost = totalPayment + f + gstOnInterest;
    return {
      baseEmi,
      interest,
      fee: f,
      gstOnInterest,
      totalCost,
      extra: totalCost - P,
      principal: P,
    };
  }, [amount, rate, months, fee, gst]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Purchase amount" htmlFor="cce-amt">
          <input id="cce-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="cce-rate">
          <input id="cce-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (months)" htmlFor="cce-n">
          <input id="cce-n" type="number" className="input" value={months} onChange={(e) => setMonths(e.target.value)} />
        </Field>
        <Field label="Processing fee" htmlFor="cce-fee" hint="one-time, optional">
          <input id="cce-fee" type="number" className="input" value={fee} onChange={(e) => setFee(e.target.value)} />
        </Field>
        <Field label="GST on interest (%)" htmlFor="cce-gst" hint="usually 18%">
          <input id="cce-gst" type="number" step="1" className="input" value={gst} onChange={(e) => setGst(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Monthly EMI" value={money(result.baseEmi)} sub={`over ${Math.round(parseFloat(months))} months`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Interest" value={money(result.interest)} />
            <Stat label="Processing fee" value={money(result.fee)} />
            <Stat label="GST on interest" value={money(result.gstOnInterest)} />
            <Stat label="Total cost" value={money(result.totalCost)} />
          </div>
          <SplitBar invested={result.principal} gains={result.extra} investedLabel="Purchase" gainsLabel="Extra cost" />
        </>
      )}
    </div>
  );
}
