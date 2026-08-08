"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  DonutChart,
  SliderField,
  Stat,
  money,
  sipFutureValue,
} from "./finance/shared";

export default function InflationSip() {
  const [monthly, setMonthly] = useState("25000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("15");
  const [inflation, setInflation] = useState("6");

  const result = useMemo(() => {
    const P = parseFloat(monthly);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const inf = parseFloat(inflation);
    if ([P, r, y, inf].some((v) => isNaN(v)) || P <= 0 || y <= 0) return null;

    const nominal = sipFutureValue(P, r, y);
    const invested = P * Math.round(y * 12);
    // Discount the nominal corpus back to today's purchasing power.
    const real = nominal / Math.pow(1 + inf / 100, y);
    // Real (inflation-adjusted) rate of return.
    const realRate = ((1 + r / 100) / (1 + inf / 100) - 1) * 100;
    return { nominal, real, invested, gains: nominal - invested, realRate };
  }, [monthly, rate, years, inflation]);

  return (
    <div className="space-y-4">
      <div className="card space-y-6 p-5">
        <SliderField label="Monthly investment" id="isip-amt" prefix="₹" value={monthly} onChange={setMonthly} min={500} max={1000000} step={500} />
        <SliderField label="Expected return rate (p.a)" id="isip-rate" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.5} />
        <SliderField label="Time period" id="isip-yrs" suffix="Yr" value={years} onChange={setYears} min={1} max={40} step={1} />
        <SliderField label="Inflation rate (p.a)" id="isip-inf" suffix="%" value={inflation} onChange={setInflation} min={0} max={15} step={0.5} />
      </div>

      {result && (
        <>
          <BigResult
            label="Inflation-adjusted value"
            value={money(result.real)}
            sub={`in today's money · nominal ${money(result.nominal)}`}
          />
          <DonutChart
            segments={[
              { label: "Invested amount", value: result.invested, color: "var(--brand)" },
              { label: "Est. returns (nominal)", value: result.gains, color: "var(--accent)" },
            ]}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total invested" value={money(result.invested)} />
            <Stat label="Nominal returns" value={money(result.gains)} />
            <Stat label="Real rate of return" value={`${result.realRate.toFixed(2)}%`} />
          </div>
        </>
      )}
    </div>
  );
}
