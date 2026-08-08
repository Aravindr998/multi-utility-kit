"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, num } from "./finance/shared";

/**
 * Kisan Vikas Patra: a lumpsum that doubles over a period determined by the
 * interest rate (compounded annually). We derive the doubling time from the rate.
 */
export default function KvpCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7.5");

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    if (isNaN(P) || isNaN(r) || P <= 0 || r <= 0) return null;
    const years = Math.log(2) / Math.log(1 + r / 100);
    const months = Math.round(years * 12);
    return { maturity: P * 2, interest: P, principal: P, years, months };
  }, [principal, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Investment amount" htmlFor="kvp-p">
          <input id="kvp-p" type="number" className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="kvp-r" hint="compounded annually">
          <input id="kvp-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Maturity value (money doubles)"
            value={money(result.maturity)}
            sub={`in about ${Math.floor(result.months / 12)} yr ${result.months % 12} mo`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Amount invested" value={money(result.principal)} />
            <Stat label="Interest earned" value={money(result.interest)} />
            <Stat label="Time to double" value={`${result.months} months`} hint={`${num(result.years, 2)} years`} />
          </div>
        </>
      )}
    </div>
  );
}
