"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, cagr, money, pct } from "./finance/shared";

export default function CagrCalculator() {
  const [begin, setBegin] = useState("100000");
  const [end, setEnd] = useState("250000");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const b = parseFloat(begin);
    const e = parseFloat(end);
    const y = parseFloat(years);
    if (isNaN(b) || isNaN(e) || isNaN(y) || b <= 0 || y <= 0) return null;
    const rate = cagr(b, e, y);
    const absReturn = ((e - b) / b) * 100;
    return { rate, absReturn, gain: e - b, multiple: e / b };
  }, [begin, end, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Initial value" htmlFor="cagr-b">
          <input id="cagr-b" type="number" className="input" value={begin} onChange={(e) => setBegin(e.target.value)} />
        </Field>
        <Field label="Final value" htmlFor="cagr-e">
          <input id="cagr-e" type="number" className="input" value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>
        <Field label="Duration (years)" htmlFor="cagr-y">
          <input id="cagr-y" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="CAGR" value={pct(result.rate)} sub={`over ${years} years`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Absolute return" value={pct(result.absReturn)} />
            <Stat label="Total gain" value={money(result.gain)} />
            <Stat label="Growth multiple" value={`${result.multiple.toFixed(2)}×`} />
          </div>
        </>
      )}
    </div>
  );
}
