"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  DonutChart,
  GrowthChart,
  SliderField,
  Stat,
  money,
  monthlyRate,
  type YearPoint,
} from "./finance/shared";

/** Initial lumpsum plus recurring monthly contributions, monthly compounding. */
function simulate(initial: number, monthly: number, ratePct: number, years: number) {
  const i = monthlyRate(ratePct);
  const totalMonths = Math.round(years * 12);
  let balance = initial;
  let invested = initial;
  const data: YearPoint[] = [{ year: 0, invested, value: balance }];
  for (let m = 1; m <= totalMonths; m++) {
    balance = (balance + monthly) * (1 + i);
    invested += monthly;
    if (m % 12 === 0 || m === totalMonths) {
      data.push({ year: m / 12, invested, value: balance });
    }
  }
  return { value: balance, invested, gains: balance - invested, data };
}

export default function InvestmentGrowth() {
  const [initial, setInitial] = useState("100000");
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const P = parseFloat(initial) || 0;
    const m = parseFloat(monthly) || 0;
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(r) || isNaN(y) || y <= 0 || P + m <= 0) return null;
    return simulate(P, m, r, y);
  }, [initial, monthly, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card space-y-6 p-5">
        <SliderField label="Initial amount" id="ig-init" prefix="₹" value={initial} onChange={setInitial} min={0} max={10000000} step={1000} />
        <SliderField label="Monthly contribution" id="ig-mon" prefix="₹" value={monthly} onChange={setMonthly} min={0} max={500000} step={500} />
        <SliderField label="Expected return rate (p.a)" id="ig-rate" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.5} />
        <SliderField label="Time period" id="ig-yrs" suffix="Yr" value={years} onChange={setYears} min={1} max={40} step={1} />
      </div>

      {result && (
        <>
          <BigResult label="Future value" value={money(result.value)} sub={`after ${years} years`} />
          <DonutChart
            segments={[
              { label: "Total invested", value: result.invested, color: "var(--brand)" },
              { label: "Total growth", value: result.gains, color: "var(--accent)" },
            ]}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Total invested" value={money(result.invested)} />
            <Stat label="Total growth" value={money(result.gains)} />
          </div>
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
