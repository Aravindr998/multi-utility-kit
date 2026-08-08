"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

const FREQ: Record<string, number> = {
  annually: 1,
  "semi-annually": 2,
  quarterly: 4,
  monthly: 12,
};

export default function FutureValue() {
  const [present, setPresent] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState<keyof typeof FREQ>("annually");

  const result = useMemo(() => {
    const PV = parseFloat(present);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(PV) || isNaN(r) || isNaN(y) || y < 0) return null;
    const n = FREQ[freq];
    const fv = PV * Math.pow(1 + r / 100 / n, n * y);
    return { fv, interest: fv - PV, pv: PV };
  }, [present, rate, years, freq]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Present value" htmlFor="fv-pv">
          <input id="fv-pv" type="number" className="input" value={present} onChange={(e) => setPresent(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="fv-rate">
          <input id="fv-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Time period (years)" htmlFor="fv-yrs">
          <input id="fv-yrs" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Compounding" htmlFor="fv-freq">
          <select id="fv-freq" className="input" value={freq} onChange={(e) => setFreq(e.target.value as keyof typeof FREQ)}>
            <option value="annually">Annually</option>
            <option value="semi-annually">Semi-annually</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Future value" value={money(result.fv)} sub={`after ${years} years`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Present value" value={money(result.pv)} />
            <Stat label="Interest earned" value={money(result.interest)} />
          </div>
        </>
      )}
    </div>
  );
}
