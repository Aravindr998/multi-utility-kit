"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";

type Flow = { id: number; date: string; amount: string };

const MS_PER_YEAR = 365 * 24 * 60 * 60 * 1000;

/** Newton–Raphson with a bisection fallback for XIRR. Returns rate as a fraction. */
function xirr(flows: { when: number; amount: number }[]): number {
  if (flows.length < 2) return NaN;
  const t0 = flows[0].when;
  const years = (when: number) => (when - t0) / MS_PER_YEAR;
  const npv = (rate: number) =>
    flows.reduce((s, f) => s + f.amount / Math.pow(1 + rate, years(f.when)), 0);
  const dnpv = (rate: number) =>
    flows.reduce((s, f) => {
      const y = years(f.when);
      return s - (y * f.amount) / Math.pow(1 + rate, y + 1);
    }, 0);

  // Newton–Raphson
  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    const v = npv(rate);
    const d = dnpv(rate);
    if (Math.abs(v) < 1e-7) return rate;
    if (d === 0) break;
    const next = rate - v / d;
    if (!isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-9) return next;
    rate = next <= -0.999999 ? (rate - 0.999999) / 2 : next;
  }

  // Bisection fallback over a wide bracket.
  let lo = -0.9999;
  let hi = 100;
  let flo = npv(lo);
  const fhi = npv(hi);
  if (flo * fhi > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fmid = npv(mid);
    if (Math.abs(fmid) < 1e-7) return mid;
    if (flo * fmid < 0) {
      hi = mid;
    } else {
      lo = mid;
      flo = fmid;
    }
  }
  return (lo + hi) / 2;
}

let nextId = 5;

export default function XirrCalculator() {
  const [flows, setFlows] = useState<Flow[]>([
    { id: 1, date: "2021-01-01", amount: "-100000" },
    { id: 2, date: "2022-01-01", amount: "-100000" },
    { id: 3, date: "2023-01-01", amount: "-100000" },
    { id: 4, date: "2024-01-01", amount: "360000" },
  ]);

  const update = (id: number, patch: Partial<Flow>) =>
    setFlows((f) => f.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setFlows((f) => f.filter((r) => r.id !== id));
  const add = () =>
    setFlows((f) => [...f, { id: nextId++, date: new Date().toISOString().slice(0, 10), amount: "" }]);

  const result = useMemo(() => {
    const parsed = flows
      .map((f) => ({ when: new Date(f.date).getTime(), amount: parseFloat(f.amount) }))
      .filter((f) => isFinite(f.when) && isFinite(f.amount))
      .sort((a, b) => a.when - b.when);
    if (parsed.length < 2) return null;
    const hasNeg = parsed.some((f) => f.amount < 0);
    const hasPos = parsed.some((f) => f.amount > 0);
    if (!hasNeg || !hasPos) return { error: "Add at least one investment (negative) and one return (positive)." };

    const invested = parsed.filter((f) => f.amount < 0).reduce((s, f) => s - f.amount, 0);
    const received = parsed.filter((f) => f.amount > 0).reduce((s, f) => s + f.amount, 0);
    const rate = xirr(parsed);
    if (!isFinite(rate)) return { error: "Could not converge on a rate for these cashflows." };
    return { rate: rate * 100, invested, received, net: received - invested };
  }, [flows]);

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-5">
        <p className="text-sm text-[var(--muted)]">
          Enter each cashflow: investments as <strong>negative</strong> amounts, redemptions or current
          value as <strong>positive</strong>.
        </p>
        <div className="space-y-2">
          {flows.map((f) => (
            <div key={f.id} className="flex items-center gap-2">
              <input
                type="date"
                className="input"
                value={f.date}
                onChange={(e) => update(f.id, { date: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder="Amount"
                value={f.amount}
                onChange={(e) => update(f.id, { amount: e.target.value })}
              />
              <button
                className="btn btn-ghost shrink-0 px-3"
                onClick={() => remove(f.id)}
                aria-label="Remove row"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={add}>
          + Add cashflow
        </button>
      </div>

      {result && "error" in result && (
        <div className="card p-4 text-sm text-[var(--muted)]">{result.error}</div>
      )}

      {result && !("error" in result) && (
        <>
          <BigResult label="XIRR (annualized return)" value={pct(result.rate)} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total invested" value={money(result.invested)} />
            <Stat label="Total received" value={money(result.received)} />
            <Stat label="Net gain" value={money(result.net)} />
          </div>
        </>
      )}
    </div>
  );
}
