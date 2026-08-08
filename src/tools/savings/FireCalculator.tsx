"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "../finance/shared";
import { fireNumber, yearsLabel, yearsToReach } from "./shared";

export type FireConfig = {
  /** Label for the corpus target, e.g. "FIRE number", "FI number". */
  targetLabel: string;
  expensesLabel: string;
  defaultExpenses: string;
  defaultWithdrawal: string;
  currentLabel: string;
  note?: string;
};

export default function FireCalculator({ config }: { config: FireConfig }) {
  const [expenses, setExpenses] = useState(config.defaultExpenses);
  const [withdrawal, setWithdrawal] = useState(config.defaultWithdrawal);
  const [current, setCurrent] = useState("1500000");
  const [monthly, setMonthly] = useState("50000");
  const [rate, setRate] = useState("10");

  const result = useMemo(() => {
    const e = parseFloat(expenses);
    const w = parseFloat(withdrawal);
    const c = parseFloat(current) || 0;
    const m = parseFloat(monthly) || 0;
    const r = parseFloat(rate) || 0;
    if (isNaN(e) || isNaN(w) || e <= 0 || w <= 0) return null;
    const target = fireNumber(e, w);
    const years = yearsToReach(c, m, r, target);
    const progress = Math.min(100, (c / target) * 100);
    return { target, years, progress, multiple: 100 / w };
  }, [expenses, withdrawal, current, monthly, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={config.expensesLabel} htmlFor="fire-exp">
          <input id="fire-exp" type="number" className="input" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
        </Field>
        <Field label="Safe withdrawal rate (%)" htmlFor="fire-wr" hint="4% is the common rule">
          <input id="fire-wr" type="number" step="0.1" className="input" value={withdrawal} onChange={(e) => setWithdrawal(e.target.value)} />
        </Field>
        <Field label={config.currentLabel} htmlFor="fire-cur">
          <input id="fire-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
        <Field label="Monthly investment" htmlFor="fire-mon">
          <input id="fire-mon" type="number" className="input" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="fire-rate">
          <input id="fire-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label={config.targetLabel}
            value={money(result.target)}
            sub={`${result.multiple.toFixed(0)}× annual expenses`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Time to reach it" value={yearsLabel(result.years)} />
            <Stat label="Progress so far" value={pct(result.progress, 1)} />
          </div>
          <div>
            <div className="flex h-4 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
              <div style={{ width: `${result.progress}%`, background: "var(--brand)" }} />
            </div>
            <div className="mt-2 text-center text-xs text-[var(--muted)]">
              {result.progress >= 100 ? "You've reached your target 🎉" : `${pct(result.progress, 1)} of the way there`}
            </div>
          </div>
          {config.note && <p className="text-center text-xs text-[var(--faint)]">{config.note}</p>}
        </>
      )}
    </div>
  );
}
