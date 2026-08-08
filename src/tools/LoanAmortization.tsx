"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { buildSchedule, emi, yearlySummary } from "./loans/emi";

/** Full amortization schedule with a yearly/monthly view toggle. */
export default function LoanAmortization() {
  const [amount, setAmount] = useState("1000000");
  const [rate, setRate] = useState("9");
  const [years, setYears] = useState("10");
  const [view, setView] = useState<"yearly" | "monthly">("yearly");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if ([P, r, y].some((v) => isNaN(v)) || P <= 0 || y <= 0) return null;
    const months = Math.round(y * 12);
    const pay = emi(P, r, months);
    const schedule = buildSchedule(P, r, months);
    const years$ = yearlySummary(schedule);
    const total = pay * months;
    return { pay, total, interest: total - P, principal: P, schedule, years: years$ };
  }, [amount, rate, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Loan amount" htmlFor="am-amt">
          <input id="am-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="am-rate">
          <input id="am-rate" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)" htmlFor="am-yrs">
          <input id="am-yrs" type="number" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Monthly EMI" value={money(result.pay)} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Principal" value={money(result.principal)} />
            <Stat label="Total interest" value={money(result.interest)} />
            <Stat label="Total payable" value={money(result.total)} />
          </div>

          <div className="flex gap-2">
            <button className={`btn ${view === "yearly" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("yearly")}>
              Yearly
            </button>
            <button className={`btn ${view === "monthly" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("monthly")}>
              Monthly
            </button>
          </div>

          <div className="card max-h-[28rem] overflow-auto p-4">
            <table className="w-full text-sm">
              <thead className="sticky top-0" style={{ background: "var(--surface)" }}>
                <tr className="text-left text-[var(--muted)]">
                  <th className="py-1 pr-4 font-medium">{view === "yearly" ? "Year" : "Month"}</th>
                  <th className="py-1 pr-4 font-medium">Principal</th>
                  <th className="py-1 pr-4 font-medium">Interest</th>
                  <th className="py-1 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {view === "yearly"
                  ? result.years.map((y) => (
                      <tr key={y.year} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="py-1.5 pr-4">{y.year}</td>
                        <td className="py-1.5 pr-4">{money(y.principal)}</td>
                        <td className="py-1.5 pr-4">{money(y.interest)}</td>
                        <td className="py-1.5">{money(y.balance)}</td>
                      </tr>
                    ))
                  : result.schedule.map((m) => (
                      <tr key={m.month} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="py-1.5 pr-4">{m.month}</td>
                        <td className="py-1.5 pr-4">{money(m.principal)}</td>
                        <td className="py-1.5 pr-4">{money(m.interest)}</td>
                        <td className="py-1.5">{money(m.balance)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
