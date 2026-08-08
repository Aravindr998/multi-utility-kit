"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { monthlyForTarget } from "./savings/shared";

export default function SavingsGoal() {
  const [goal, setGoal] = useState("1000000");
  const [years, setYears] = useState("5");
  const [current, setCurrent] = useState("100000");
  const [rate, setRate] = useState("6");

  const result = useMemo(() => {
    const g = parseFloat(goal);
    const y = parseFloat(years);
    const c = parseFloat(current) || 0;
    const r = parseFloat(rate) || 0;
    if (isNaN(g) || isNaN(y) || g <= 0 || y <= 0) return null;
    const monthly = monthlyForTarget(c, g, r, y);
    const months = Math.round(y * 12);
    const contributions = monthly * months;
    const growth = g - c - contributions;
    return { monthly, contributions, growth: Math.max(0, growth), months };
  }, [goal, years, current, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Savings goal" htmlFor="sg-goal">
          <input id="sg-goal" type="number" className="input" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </Field>
        <Field label="Time to goal (years)" htmlFor="sg-yrs">
          <input id="sg-yrs" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Current savings" htmlFor="sg-cur" hint="optional">
          <input id="sg-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="sg-rate" hint="0 for a plain savings goal">
          <input id="sg-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Monthly saving needed" value={money(result.monthly)} sub={`for ${result.months} months`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Total you'll contribute" value={money(result.contributions)} />
            <Stat label="Growth from returns" value={money(result.growth)} />
          </div>
        </>
      )}
    </div>
  );
}
