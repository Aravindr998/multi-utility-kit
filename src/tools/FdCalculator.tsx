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

const FREQ: Record<string, number> = {
  annually: 1,
  "half-yearly": 2,
  quarterly: 4,
  monthly: 12,
};

export default function FdCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState<keyof typeof FREQ>("quarterly");
  const [simple, setSimple] = useState(false);

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(P) || isNaN(r) || isNaN(y) || P <= 0 || y <= 0) return null;
    const n = FREQ[freq];

    const valueAt = (t: number) =>
      simple ? P * (1 + (r / 100) * t) : P * Math.pow(1 + r / 100 / n, n * t);

    const data: YearPoint[] = [];
    for (let yr = 0; yr <= Math.ceil(y); yr++) {
      const yy = Math.min(yr, y);
      data.push({ year: yy, invested: P, value: valueAt(yy) });
    }
    const maturity = valueAt(y);
    return { maturity, interest: maturity - P, principal: P, data };
  }, [principal, rate, years, freq, simple]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Deposit amount" htmlFor="fd-p">
          <input id="fd-p" type="number" className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="fd-r">
          <input id="fd-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="fd-y">
          <input id="fd-y" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Compounding" htmlFor="fd-f">
          <select id="fd-f" className="input" value={freq} disabled={simple} onChange={(e) => setFreq(e.target.value as keyof typeof FREQ)}>
            <option value="annually">Annually</option>
            <option value="half-yearly">Half-yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <input type="checkbox" checked={simple} onChange={(e) => setSimple(e.target.checked)} />
        Use simple interest instead of compound
      </label>

      {result && (
        <>
          <BigResult label="Maturity value" value={money(result.maturity)} sub={`after ${years} years`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Principal" value={money(result.principal)} />
            <Stat label="Interest earned" value={money(result.interest)} />
          </div>
          <SplitBar invested={result.principal} gains={result.interest} investedLabel="Principal" gainsLabel="Interest" />
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
