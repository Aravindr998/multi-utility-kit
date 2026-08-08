"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  DonutChart,
  GrowthChart,
  SliderField,
  Stat,
  lumpsumFutureValue,
  money,
  type YearPoint,
} from "./finance/shared";

export default function LumpsumCalculator() {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(P) || isNaN(r) || isNaN(y) || P <= 0 || y <= 0) return null;

    const data: YearPoint[] = [];
    for (let yr = 0; yr <= Math.ceil(y); yr++) {
      const yy = Math.min(yr, y);
      data.push({ year: yy, invested: P, value: lumpsumFutureValue(P, r, yy) });
    }
    const value = lumpsumFutureValue(P, r, y);
    return { value, invested: P, gains: value - P, data };
  }, [amount, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card space-y-6 p-5">
        <SliderField label="Total investment" id="ls-amt" prefix="₹" value={amount} onChange={setAmount} min={1000} max={10000000} step={1000} />
        <SliderField label="Expected return rate (p.a)" id="ls-rate" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.5} />
        <SliderField label="Time period" id="ls-yrs" suffix="Yr" value={years} onChange={setYears} min={1} max={40} step={1} />
      </div>

      {result && (
        <>
          <BigResult label="Total value" value={money(result.value)} sub={`after ${years} years`} />
          <DonutChart
            segments={[
              { label: "Invested amount", value: result.invested, color: "var(--brand)" },
              { label: "Est. returns", value: result.gains, color: "var(--accent)" },
            ]}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Amount invested" value={money(result.invested)} />
            <Stat label="Estimated returns" value={money(result.gains)} />
          </div>
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
