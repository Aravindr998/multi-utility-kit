"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, GrowthChart, Stat, money, monthlyRate, type YearPoint } from "./finance/shared";

/**
 * Systematic Transfer Plan: park a lumpsum in a source fund (e.g. debt/liquid)
 * and transfer a fixed amount every month into a destination fund (e.g. equity).
 * Both balances grow at their own rates.
 */
function simulate(
  lumpsum: number,
  srcRate: number,
  destRate: number,
  transfer: number,
  years: number
) {
  const si = monthlyRate(srcRate);
  const di = monthlyRate(destRate);
  const totalMonths = Math.round(years * 12);
  let src = lumpsum;
  let dest = 0;
  let transferred = 0;
  const data: YearPoint[] = [{ year: 0, invested: lumpsum, value: lumpsum }];
  for (let m = 1; m <= totalMonths; m++) {
    const move = Math.min(transfer, src);
    src -= move;
    dest += move;
    transferred += move;
    src *= 1 + si;
    dest *= 1 + di;
    if (m % 12 === 0 || m === totalMonths) {
      data.push({ year: m / 12, invested: lumpsum, value: src + dest });
    }
  }
  return { src: Math.max(0, src), dest, total: src + dest, transferred, invested: lumpsum, data };
}

export default function StpCalculator() {
  const [amount, setAmount] = useState("1000000");
  const [srcRate, setSrcRate] = useState("6");
  const [destRate, setDestRate] = useState("12");
  const [transfer, setTransfer] = useState("20000");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const s = parseFloat(srcRate);
    const d = parseFloat(destRate);
    const t = parseFloat(transfer);
    const y = parseFloat(years);
    if ([P, s, d, t, y].some((v) => isNaN(v)) || P <= 0 || t <= 0 || y <= 0) return null;
    return simulate(P, s, d, t, y);
  }, [amount, srcRate, destRate, transfer, years]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Source lumpsum" htmlFor="stp-amt">
          <input id="stp-amt" type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Source return (% / year)" htmlFor="stp-src" hint="e.g. debt / liquid fund">
          <input id="stp-src" type="number" step="0.1" className="input" value={srcRate} onChange={(e) => setSrcRate(e.target.value)} />
        </Field>
        <Field label="Destination return (% / year)" htmlFor="stp-dest" hint="e.g. equity fund">
          <input id="stp-dest" type="number" step="0.1" className="input" value={destRate} onChange={(e) => setDestRate(e.target.value)} />
        </Field>
        <Field label="Monthly transfer" htmlFor="stp-t">
          <input id="stp-t" type="number" className="input" value={transfer} onChange={(e) => setTransfer(e.target.value)} />
        </Field>
        <Field label="Time period (years)" htmlFor="stp-yrs">
          <input id="stp-yrs" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Total value" value={money(result.total)} sub={`after ${years} years`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Destination fund" value={money(result.dest)} />
            <Stat label="Source remaining" value={money(result.src)} />
            <Stat label="Total transferred" value={money(result.transferred)} />
          </div>
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
