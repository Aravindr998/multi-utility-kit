"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { emi } from "./loans/emi";

/**
 * Interest-only loan: pay only interest for an initial period, then amortize the
 * full principal over the remaining term (payments jump up after the IO period).
 */
export default function InterestOnlyLoan() {
  const [amount, setAmount] = useState("2000000");
  const [rate, setRate] = useState("9");
  const [ioYears, setIoYears] = useState("3");
  const [totalYears, setTotalYears] = useState("20");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const io = parseFloat(ioYears);
    const tot = parseFloat(totalYears);
    if ([P, r, io, tot].some((v) => isNaN(v)) || P <= 0 || tot <= io || io < 0) return null;
    const monthlyRate = r / 100 / 12;
    const ioMonths = Math.round(io * 12);
    const amortMonths = Math.round((tot - io) * 12);
    const ioPayment = P * monthlyRate;
    const amortEmi = emi(P, r, amortMonths);
    const ioInterest = ioPayment * ioMonths;
    const amortTotal = amortEmi * amortMonths;
    const amortInterest = amortTotal - P;
    const totalInterest = ioInterest + amortInterest;
    return { ioPayment, amortEmi, ioInterest, totalInterest, ioMonths, amortMonths, totalPaid: ioInterest + amortTotal };
  }, [amount, rate, ioYears, totalYears]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Loan amount" htmlFor="io-amt">
          <input id="io-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="io-rate">
          <input id="io-rate" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Interest-only period (years)" htmlFor="io-io">
          <input id="io-io" type="number" step="0.5" className="input" value={ioYears} onChange={(e) => setIoYears(e.target.value)} />
        </Field>
        <Field label="Total loan term (years)" htmlFor="io-tot">
          <input id="io-tot" type="number" step="0.5" className="input" value={totalYears} onChange={(e) => setTotalYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Interest-only payment"
            value={money(result.ioPayment)}
            sub={`for the first ${result.ioMonths} months`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="EMI after IO period" value={money(result.amortEmi)} hint={`for ${result.amortMonths} months`} />
            <Stat label="Interest in IO period" value={money(result.ioInterest)} />
            <Stat label="Total interest" value={money(result.totalInterest)} />
          </div>
          <p className="text-center text-xs text-[var(--faint)]">
            During the interest-only period the principal doesn&apos;t reduce, so payments rise once amortization begins.
          </p>
        </>
      )}
    </div>
  );
}
