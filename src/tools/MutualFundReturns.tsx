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
  pct,
  sipFutureValue,
  type YearPoint,
} from "./finance/shared";

export default function MutualFundReturns() {
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (isNaN(P) || isNaN(r) || isNaN(y) || P <= 0 || y <= 0) return null;

    const data: YearPoint[] = [{ year: 0, invested: mode === "lumpsum" ? P : 0, value: mode === "lumpsum" ? P : 0 }];
    for (let yr = 1; yr <= Math.ceil(y); yr++) {
      const yy = Math.min(yr, y);
      if (mode === "sip") {
        data.push({ year: yy, invested: P * yy * 12, value: sipFutureValue(P, r, yy) });
      } else {
        data.push({ year: yy, invested: P, value: lumpsumFutureValue(P, r, yy) });
      }
    }

    const value = mode === "sip" ? sipFutureValue(P, r, y) : lumpsumFutureValue(P, r, y);
    const invested = mode === "sip" ? P * Math.round(y * 12) : P;
    const gains = value - invested;
    const absReturn = invested > 0 ? (gains / invested) * 100 : 0;
    return { value, invested, gains, absReturn, data };
  }, [mode, amount, rate, years]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button className={`btn ${mode === "sip" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("sip")}>
          Monthly SIP
        </button>
        <button className={`btn ${mode === "lumpsum" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("lumpsum")}>
          One-time lumpsum
        </button>
      </div>

      <div className="card space-y-6 p-5">
        <SliderField
          label={mode === "sip" ? "Monthly investment" : "Investment amount"}
          id="mf-amt"
          prefix="₹"
          value={amount}
          onChange={setAmount}
          min={mode === "sip" ? 500 : 1000}
          max={mode === "sip" ? 1000000 : 10000000}
          step={mode === "sip" ? 500 : 1000}
        />
        <SliderField label="Expected return rate (p.a)" id="mf-rate" suffix="%" value={rate} onChange={setRate} min={1} max={30} step={0.5} />
        <SliderField label="Time period" id="mf-yrs" suffix="Yr" value={years} onChange={setYears} min={1} max={40} step={1} />
      </div>

      {result && (
        <>
          <BigResult label="Maturity value" value={money(result.value)} sub={`after ${years} years`} />
          <DonutChart
            segments={[
              { label: "Invested amount", value: result.invested, color: "var(--brand)" },
              { label: "Est. returns", value: result.gains, color: "var(--accent)" },
            ]}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total invested" value={money(result.invested)} />
            <Stat label="Estimated returns" value={money(result.gains)} />
            <Stat label="Absolute return" value={pct(result.absReturn)} />
          </div>
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
