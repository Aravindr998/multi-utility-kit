"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

const FREQ: Record<string, number> = {
  annually: 1,
  "semi-annually": 2,
  quarterly: 4,
  monthly: 12,
};

export default function PresentValue() {
  const [future, setFuture] = useState("1000000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState<keyof typeof FREQ>("annually");

  const result = useMemo(() => {
    const FV = parseFloat(future);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(FV) || isNaN(r) || isNaN(y) || y < 0) return null;
    const n = FREQ[freq];
    const pv = FV / Math.pow(1 + r / 100 / n, n * y);
    return { pv, discount: FV - pv, fv: FV };
  }, [future, rate, years, freq]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Future value" htmlFor="pv-fv">
          <input id="pv-fv" type="number" className="input" value={future} onChange={(e) => setFuture(e.target.value)} />
        </Field>
        <Field label="Discount rate (% / year)" htmlFor="pv-rate">
          <input id="pv-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Time period (years)" htmlFor="pv-yrs">
          <input id="pv-yrs" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Compounding" htmlFor="pv-freq">
          <select id="pv-freq" className="input" value={freq} onChange={(e) => setFreq(e.target.value as keyof typeof FREQ)}>
            <option value="annually">Annually</option>
            <option value="semi-annually">Semi-annually</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Present value" value={money(result.pv)} sub={`to receive ${money(result.fv)} in ${years} years`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Future value" value={money(result.fv)} />
            <Stat label="Total discount" value={money(result.discount)} />
          </div>
        </>
      )}
    </div>
  );
}
