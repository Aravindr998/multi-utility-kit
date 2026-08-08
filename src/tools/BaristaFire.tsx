"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";
import { fireNumber, yearsLabel, yearsToReach } from "./savings/shared";

/**
 * Barista FIRE: part-time income covers part of your expenses, so your portfolio
 * only needs to fund the remainder — a smaller corpus than full FIRE.
 */
export default function BaristaFire() {
  const [expenses, setExpenses] = useState("1200000");
  const [partTime, setPartTime] = useState("400000");
  const [withdrawal, setWithdrawal] = useState("4");
  const [current, setCurrent] = useState("1500000");
  const [monthly, setMonthly] = useState("50000");
  const [rate, setRate] = useState("10");

  const result = useMemo(() => {
    const e = parseFloat(expenses);
    const pt = parseFloat(partTime) || 0;
    const w = parseFloat(withdrawal);
    const c = parseFloat(current) || 0;
    const m = parseFloat(monthly) || 0;
    const r = parseFloat(rate) || 0;
    if (isNaN(e) || isNaN(w) || e <= 0 || w <= 0) return null;
    const covered = Math.max(0, e - pt);
    const target = fireNumber(covered, w);
    const fullFire = fireNumber(e, w);
    const years = yearsToReach(c, m, r, target);
    const progress = Math.min(100, (c / target) * 100);
    return { target, fullFire, years, progress, saved: fullFire - target };
  }, [expenses, partTime, withdrawal, current, monthly, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Annual expenses" htmlFor="bf-exp">
          <input id="bf-exp" type="number" className="input" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
        </Field>
        <Field label="Part-time annual income" htmlFor="bf-pt" hint="covers part of expenses">
          <input id="bf-pt" type="number" className="input" value={partTime} onChange={(e) => setPartTime(e.target.value)} />
        </Field>
        <Field label="Safe withdrawal rate (%)" htmlFor="bf-wr">
          <input id="bf-wr" type="number" step="0.1" className="input" value={withdrawal} onChange={(e) => setWithdrawal(e.target.value)} />
        </Field>
        <Field label="Current investments" htmlFor="bf-cur">
          <input id="bf-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Monthly investment" htmlFor="bf-mon">
          <input id="bf-mon" type="number" className="input" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="bf-rate">
          <input id="bf-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Your Barista FIRE number"
            value={money(result.target)}
            sub={`${money(result.saved)} less than full FIRE (${money(result.fullFire)})`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Time to reach it" value={yearsLabel(result.years)} />
            <Stat label="Progress so far" value={pct(result.progress, 1)} />
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
            <div style={{ width: `${result.progress}%`, background: "var(--brand)" }} />
          </div>
          <p className="text-center text-xs text-[var(--faint)]">
            Barista FIRE covers the gap between part-time income and expenses from your portfolio, so you can downshift to lighter work sooner.
          </p>
        </>
      )}
    </div>
  );
}
