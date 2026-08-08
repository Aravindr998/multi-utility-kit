"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { monthlyForTarget } from "./savings/shared";

/**
 * Projects the future cost of a multi-year course (each year inflated to when it
 * falls due) and the monthly saving needed to fund it by the time college starts.
 */
export default function CollegeSavings() {
  const [annualCost, setAnnualCost] = useState("300000");
  const [yearsUntil, setYearsUntil] = useState("12");
  const [courseYears, setCourseYears] = useState("4");
  const [inflation, setInflation] = useState("8");
  const [rate, setRate] = useState("10");
  const [current, setCurrent] = useState("100000");

  const result = useMemo(() => {
    const cost = parseFloat(annualCost);
    const until = parseFloat(yearsUntil);
    const dur = parseFloat(courseYears);
    const inf = parseFloat(inflation) || 0;
    const r = parseFloat(rate) || 0;
    const cur = parseFloat(current) || 0;
    if ([cost, until, dur].some((v) => isNaN(v)) || cost <= 0 || until < 0 || dur <= 0) return null;

    let total = 0;
    for (let k = 0; k < Math.round(dur); k++) {
      total += cost * Math.pow(1 + inf / 100, until + k);
    }
    const firstYear = cost * Math.pow(1 + inf / 100, until);
    const monthly = monthlyForTarget(cur, total, r, until);
    return { total, firstYear, monthly };
  }, [annualCost, yearsUntil, courseYears, inflation, rate, current]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Current annual cost" htmlFor="cs-cost">
          <input id="cs-cost" type="number" className="input" value={annualCost} onChange={(e) => setAnnualCost(e.target.value)} />
        </Field>
        <Field label="Years until college" htmlFor="cs-until">
          <input id="cs-until" type="number" className="input" value={yearsUntil} onChange={(e) => setYearsUntil(e.target.value)} />
        </Field>
        <Field label="Course length (years)" htmlFor="cs-dur">
          <input id="cs-dur" type="number" className="input" value={courseYears} onChange={(e) => setCourseYears(e.target.value)} />
        </Field>
        <Field label="Education inflation (% / year)" htmlFor="cs-inf">
          <input id="cs-inf" type="number" step="0.5" className="input" value={inflation} onChange={(e) => setInflation(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="cs-rate">
          <input id="cs-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Current savings" htmlFor="cs-cur" hint="optional">
          <input id="cs-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Monthly saving needed" value={money(result.monthly)} sub="to fully fund the course" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Total future cost" value={money(result.total)} />
            <Stat label="First-year cost (inflated)" value={money(result.firstYear)} />
          </div>
        </>
      )}
    </div>
  );
}
