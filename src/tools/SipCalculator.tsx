"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  DonutChart,
  GrowthChart,
  SliderField,
  Stat,
  money,
  sipFutureValue,
  type YearPoint,
} from "./finance/shared";

export default function SipCalculator() {
  const [monthly, setMonthly] = useState("25000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const P = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(P) || isNaN(r) || isNaN(y) || P <= 0 || y <= 0) return null;

    const data: YearPoint[] = [{ year: 0, invested: 0, value: 0 }];
    for (let yr = 1; yr <= Math.ceil(y); yr++) {
      const yy = Math.min(yr, y);
      data.push({ year: yy, invested: P * yy * 12, value: sipFutureValue(P, r, yy) });
    }
    const value = sipFutureValue(P, r, y);
    const invested = P * Math.round(y * 12);
    return { value, invested, gains: value - invested, data };
  }, [monthly, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card space-y-6 p-5">
        <SliderField label="Monthly investment" id="sip-amt" prefix="₹" value={monthly} onChange={setMonthly} min={500} max={1000000} step={500} />
        <SliderField label="Expected return rate (p.a)" id="sip-rate" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.5} />
        <SliderField label="Time period" id="sip-yrs" suffix="Yr" value={years} onChange={setYears} min={1} max={40} step={1} />
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
            <Stat label="Total invested" value={money(result.invested)} />
            <Stat label="Estimated returns" value={money(result.gains)} />
          </div>
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
