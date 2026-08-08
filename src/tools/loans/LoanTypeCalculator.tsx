"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, GrowthChart, SplitBar, Stat, money, type YearPoint } from "../finance/shared";
import { buildSchedule, emi, yearlySummary } from "./emi";

export type LoanConfig = {
  amountLabel?: string;
  defaultAmount: string;
  defaultRate: string;
  defaultYears: string;
  amountHint?: string;
};

export default function LoanTypeCalculator({ config }: { config: LoanConfig }) {
  const [amount, setAmount] = useState(config.defaultAmount);
  const [rate, setRate] = useState(config.defaultRate);
  const [tenure, setTenure] = useState(config.defaultYears);
  const [unit, setUnit] = useState<"years" | "months">("years");
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const t = parseFloat(tenure);
    if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || t <= 0) return null;
    const months = unit === "years" ? Math.round(t * 12) : Math.round(t);
    const pay = emi(P, r, months);
    const total = pay * months;
    const interest = total - P;
    const schedule = buildSchedule(P, r, months);
    const years = yearlySummary(schedule);
    const chart: YearPoint[] = [{ year: 0, invested: 0, value: P }];
    years.forEach((y) => chart.push({ year: y.year, invested: 0, value: y.balance }));
    return { pay, total, interest, principal: P, months, years, chart };
  }, [amount, rate, tenure, unit]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label={config.amountLabel ?? "Loan amount"} htmlFor="lt-amt" hint={config.amountHint}>
          <input id="lt-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="lt-rate">
          <input id="lt-rate" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure" htmlFor="lt-ten">
          <div className="flex gap-2">
            <input id="lt-ten" type="number" className="input" value={tenure} onChange={(e) => setTenure(e.target.value)} />
            <select className="input w-28" value={unit} onChange={(e) => setUnit(e.target.value as "years" | "months")}>
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Monthly EMI" value={money(result.pay)} sub={`over ${result.months} payments`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Principal" value={money(result.principal)} />
            <Stat label="Total interest" value={money(result.interest)} />
            <Stat label="Total payable" value={money(result.total)} />
          </div>
          <SplitBar invested={result.principal} gains={result.interest} investedLabel="Principal" gainsLabel="Interest" />
          <GrowthChart data={result.chart} />

          <button className="btn btn-secondary" onClick={() => setShowTable((s) => !s)}>
            {showTable ? "Hide" : "Show"} year-by-year schedule
          </button>
          {showTable && (
            <div className="card overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--muted)]">
                    <th className="py-1 pr-4 font-medium">Year</th>
                    <th className="py-1 pr-4 font-medium">Principal paid</th>
                    <th className="py-1 pr-4 font-medium">Interest paid</th>
                    <th className="py-1 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.years.map((y) => (
                    <tr key={y.year} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="py-1.5 pr-4">{y.year}</td>
                      <td className="py-1.5 pr-4">{money(y.principal)}</td>
                      <td className="py-1.5 pr-4">{money(y.interest)}</td>
                      <td className="py-1.5">{money(y.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
