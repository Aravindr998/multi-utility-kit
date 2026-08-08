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

/**
 * Simulate a SIP whose monthly amount changes by `stepPct` at the start of
 * every year (positive = step-up, negative = step-down). Contributions are made
 * at the start of each month and grow at the monthly rate.
 */
function simulate(base: number, ratePct: number, years: number, stepPct: number) {
  const i = monthlyRate(ratePct);
  const totalMonths = Math.round(years * 12);
  const data: YearPoint[] = [{ year: 0, invested: 0, value: 0 }];
  let balance = 0;
  let invested = 0;
  let monthly = base;
  for (let m = 1; m <= totalMonths; m++) {
    // deposit at start of month, then grow for the month
    balance = (balance + monthly) * (1 + i);
    invested += monthly;
    if (m % 12 === 0) {
      data.push({ year: m / 12, invested, value: balance });
      monthly = Math.max(0, monthly * (1 + stepPct / 100));
    }
  }
  if (totalMonths % 12 !== 0) {
    data.push({ year: years, invested, value: balance });
  }
  return { value: balance, invested, gains: balance - invested, data };
}

export default function StepUpSip({ mode = "up" }: { mode?: "up" | "down" }) {
  const [monthly, setMonthly] = useState("25000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const [step, setStep] = useState("10");

  const result = useMemo(() => {
    const P = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const s = parseFloat(step);
    if (isNaN(P) || isNaN(r) || isNaN(y) || isNaN(s) || P <= 0 || y <= 0) return null;
    const signed = mode === "down" ? -Math.abs(s) : Math.abs(s);
    return simulate(P, r, y, signed);
  }, [monthly, rate, years, step, mode]);

  const stepLabel = mode === "down" ? "Annual step-down" : "Annual step up";

  return (
    <div className="space-y-4">
      <div className="card space-y-6 p-5">
        <SliderField label="Monthly investment" id="su-amt" prefix="₹" value={monthly} onChange={setMonthly} min={500} max={1000000} step={500} />
        <SliderField label={stepLabel} id="su-step" suffix="%" value={step} onChange={setStep} min={0} max={50} step={1} />
        <SliderField label="Expected return rate (p.a)" id="su-rate" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.5} />
        <SliderField label="Time period" id="su-yrs" suffix="Yr" value={years} onChange={setYears} min={1} max={40} step={1} />
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
