"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  Field,
  Stat,
  lumpsumFutureValue,
  money,
  sipForTarget,
} from "./finance/shared";

/** Present lumpsum needed today to reach a target. */
function lumpsumForTarget(target: number, ratePct: number, years: number): number {
  return target / Math.pow(1 + ratePct / 100, years);
}

export default function GoalCalculator() {
  const [goal, setGoal] = useState("5000000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("15");
  const [current, setCurrent] = useState("0");

  const result = useMemo(() => {
    const G = parseFloat(goal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const c = parseFloat(current) || 0;
    if (isNaN(G) || isNaN(r) || isNaN(y) || G <= 0 || y <= 0) return null;
    // Growth of existing savings offsets the goal.
    const futureOfCurrent = lumpsumFutureValue(c, r, y);
    const shortfall = Math.max(0, G - futureOfCurrent);
    const monthly = sipForTarget(shortfall, r, y);
    const lumpNow = lumpsumForTarget(shortfall, r, y);
    return { monthly, lumpNow, shortfall, futureOfCurrent, invested: monthly * Math.round(y * 12) };
  }, [goal, rate, years, current]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Target amount" htmlFor="goal-amt">
          <input id="goal-amt" type="number" className="input" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="goal-rate">
          <input id="goal-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Years to goal" htmlFor="goal-yrs">
          <input id="goal-yrs" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Current savings" htmlFor="goal-cur" hint="optional">
          <input id="goal-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Monthly SIP needed" value={money(result.monthly)} sub={`to reach ${money(parseFloat(goal))} in ${years} years`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Or invest lumpsum today" value={money(result.lumpNow)} />
            <Stat label="Existing savings grow to" value={money(result.futureOfCurrent)} />
            <Stat label="Gap to fund via SIP" value={money(result.shortfall)} />
          </div>
        </>
      )}
    </div>
  );
}
