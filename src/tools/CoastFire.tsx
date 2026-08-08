"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";
import { fireNumber, monthlyForTarget } from "./savings/shared";

/**
 * Coast FIRE: the amount invested NOW that, with no further contributions, grows
 * to your full FIRE number by retirement age. Hit it and you can "coast".
 */
export default function CoastFire() {
  const [ageNow, setAgeNow] = useState("30");
  const [ageRetire, setAgeRetire] = useState("60");
  const [expenses, setExpenses] = useState("1200000");
  const [withdrawal, setWithdrawal] = useState("4");
  const [rate, setRate] = useState("10");
  const [current, setCurrent] = useState("800000");

  const result = useMemo(() => {
    const a = parseFloat(ageNow);
    const rt = parseFloat(ageRetire);
    const e = parseFloat(expenses);
    const w = parseFloat(withdrawal);
    const r = parseFloat(rate) || 0;
    const c = parseFloat(current) || 0;
    if ([a, rt, e, w].some((v) => isNaN(v)) || rt <= a || e <= 0 || w <= 0) return null;
    const years = rt - a;
    const fire = fireNumber(e, w);
    const coast = fire / Math.pow(1 + r / 100, years);
    const reached = c >= coast;
    const progress = Math.min(100, (c / coast) * 100);
    // Actionable figure: monthly investment to reach the FULL FIRE number by retirement.
    const monthlyToFire = monthlyForTarget(c, fire, r, years);
    const projected = c * Math.pow(1 + r / 100, years);
    return { fire, coast, reached, progress, monthlyToFire, projected, years };
  }, [ageNow, ageRetire, expenses, withdrawal, rate, current]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Current age" htmlFor="cf-a">
          <input id="cf-a" type="number" className="input" value={ageNow} onChange={(e) => setAgeNow(e.target.value)} />
        </Field>
        <Field label="Retirement age" htmlFor="cf-rt">
          <input id="cf-rt" type="number" className="input" value={ageRetire} onChange={(e) => setAgeRetire(e.target.value)} />
        </Field>
        <Field label="Annual expenses (retirement)" htmlFor="cf-exp">
          <input id="cf-exp" type="number" className="input" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
        </Field>
        <Field label="Safe withdrawal rate (%)" htmlFor="cf-wr">
          <input id="cf-wr" type="number" step="0.1" className="input" value={withdrawal} onChange={(e) => setWithdrawal(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="cf-rate">
          <input id="cf-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Current investments" htmlFor="cf-cur">
          <input id="cf-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Coast FIRE number (needed today)"
            value={money(result.coast)}
            sub={`grows to your ${money(result.fire)} FIRE goal by age ${ageRetire}`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Progress to Coast FIRE" value={pct(result.progress, 1)} />
            <Stat
              label={result.reached ? "Status" : "Monthly to reach full FIRE"}
              value={result.reached ? "Coasting 🎉" : money(result.monthlyToFire)}
            />
            <Stat label="Your savings will grow to" value={money(result.projected)} hint="with no new contributions" />
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
            <div style={{ width: `${result.progress}%`, background: "var(--brand)" }} />
          </div>
          <p className="text-center text-xs text-[var(--faint)]">
            Once your invested amount reaches the Coast FIRE number, compound growth alone can carry you to full FIRE by retirement — you only need to cover current expenses.
          </p>
        </>
      )}
    </div>
  );
}
