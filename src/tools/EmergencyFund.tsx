"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { yearsLabel, yearsToReach } from "./savings/shared";

export default function EmergencyFund() {
  const [expenses, setExpenses] = useState("40000");
  const [months, setMonths] = useState("6");
  const [current, setCurrent] = useState("50000");
  const [contribution, setContribution] = useState("10000");

  const result = useMemo(() => {
    const e = parseFloat(expenses);
    const m = parseFloat(months);
    const c = parseFloat(current) || 0;
    const ct = parseFloat(contribution) || 0;
    if (isNaN(e) || isNaN(m) || e <= 0 || m <= 0) return null;
    const target = e * m;
    const gap = Math.max(0, target - c);
    // Emergency funds are usually parked in low/zero-return liquid accounts.
    const timeYears = gap === 0 ? 0 : ct > 0 ? yearsToReach(c, ct, 0, target) : Infinity;
    return { target, gap, timeYears, covered: c >= target };
  }, [expenses, months, current, contribution]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Monthly essential expenses" htmlFor="ef-exp">
          <input id="ef-exp" type="number" className="input" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
        </Field>
        <Field label="Months of cover" htmlFor="ef-mon" hint="usually 3–12">
          <input id="ef-mon" type="number" className="input" value={months} onChange={(e) => setMonths(e.target.value)} />
        </Field>
        <Field label="Current emergency savings" htmlFor="ef-cur">
          <input id="ef-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Monthly contribution" htmlFor="ef-ct">
          <input id="ef-ct" type="number" className="input" value={contribution} onChange={(e) => setContribution(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Emergency fund target"
            value={money(result.target)}
            sub={result.covered ? "You're fully covered 🎉" : `${money(result.gap)} to go`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Still needed" value={money(result.gap)} />
            <Stat label="Time to reach it" value={yearsLabel(result.timeYears)} />
          </div>
        </>
      )}
    </div>
  );
}
