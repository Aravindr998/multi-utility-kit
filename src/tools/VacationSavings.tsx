"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { monthlyForTarget } from "./savings/shared";

export default function VacationSavings() {
  const [cost, setCost] = useState("200000");
  const [months, setMonths] = useState("10");
  const [current, setCurrent] = useState("20000");
  const [rate, setRate] = useState("4");

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const m = parseFloat(months);
    const cur = parseFloat(current) || 0;
    const r = parseFloat(rate) || 0;
    if (isNaN(c) || isNaN(m) || c <= 0 || m <= 0) return null;
    const monthly = monthlyForTarget(cur, c, r, m / 12);
    const weekly = (monthly * 12) / 52;
    const daily = (monthly * 12) / 365;
    return { monthly, weekly, daily, remaining: Math.max(0, c - cur) };
  }, [cost, months, current, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Trip cost" htmlFor="vs-cost">
          <input id="vs-cost" type="number" className="input" value={cost} onChange={(e) => setCost(e.target.value)} />
        </Field>
        <Field label="Months until the trip" htmlFor="vs-mon">
          <input id="vs-mon" type="number" className="input" value={months} onChange={(e) => setMonths(e.target.value)} />
        </Field>
        <Field label="Already saved" htmlFor="vs-cur" hint="optional">
          <input id="vs-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Savings return (% / year)" htmlFor="vs-rate" hint="0 for a plain jar">
          <input id="vs-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Save each month" value={money(result.monthly)} sub={`${money(result.remaining)} left to save`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Per week" value={money(result.weekly)} />
            <Stat label="Per day" value={money(result.daily)} />
          </div>
        </>
      )}
    </div>
  );
}
