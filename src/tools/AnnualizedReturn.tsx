"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";

export default function AnnualizedReturn() {
  const [invested, setInvested] = useState("100000");
  const [current, setCurrent] = useState("180000");
  const [duration, setDuration] = useState("3");
  const [unit, setUnit] = useState<"years" | "months" | "days">("years");

  const result = useMemo(() => {
    const inv = parseFloat(invested);
    const cur = parseFloat(current);
    const d = parseFloat(duration);
    if (isNaN(inv) || isNaN(cur) || isNaN(d) || inv <= 0 || d <= 0) return null;
    const years = unit === "years" ? d : unit === "months" ? d / 12 : d / 365;
    const absReturn = ((cur - inv) / inv) * 100;
    const annualized = (Math.pow(cur / inv, 1 / years) - 1) * 100;
    return { absReturn, annualized, gain: cur - inv, years };
  }, [invested, current, duration, unit]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Amount invested" htmlFor="anr-inv">
          <input id="anr-inv" type="number" className="input" value={invested} onChange={(e) => setInvested(e.target.value)} />
        </Field>
        <Field label="Current / final value" htmlFor="anr-cur">
          <input id="anr-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Holding period" htmlFor="anr-dur">
          <div className="flex gap-2">
            <input id="anr-dur" type="number" step="0.1" className="input" value={duration} onChange={(e) => setDuration(e.target.value)} />
            <select className="input w-32" value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}>
              <option value="years">Years</option>
              <option value="months">Months</option>
              <option value="days">Days</option>
            </select>
          </div>
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Annualized return" value={pct(result.annualized)} sub="compounded per year" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Absolute return" value={pct(result.absReturn)} />
            <Stat label={result.gain >= 0 ? "Total gain" : "Total loss"} value={money(result.gain)} />
          </div>
        </>
      )}
    </div>
  );
}
