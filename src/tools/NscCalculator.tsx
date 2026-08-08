"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  Field,
  SplitBar,
  Stat,
  money,
  type YearPoint,
} from "./finance/shared";

/**
 * National Savings Certificate: a lumpsum that compounds annually for 5 years;
 * interest accrues each year and is paid together with principal at maturity.
 */
const TERM = 5;

export default function NscCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7.7");

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate);
    if (isNaN(P) || isNaN(r) || P <= 0) return null;
    const rows: YearPoint[] = [];
    let bal = P;
    for (let y = 1; y <= TERM; y++) {
      const opening = bal;
      bal = bal * (1 + r / 100);
      rows.push({ year: y, invested: opening, value: bal });
    }
    const maturity = P * Math.pow(1 + r / 100, TERM);
    return { maturity, interest: maturity - P, principal: P, rows };
  }, [principal, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Investment amount" htmlFor="nsc-p">
          <input id="nsc-p" type="number" className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="nsc-r" hint="compounded annually · 5-year term">
          <input id="nsc-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Maturity value" value={money(result.maturity)} sub="after 5 years" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Amount invested" value={money(result.principal)} />
            <Stat label="Interest earned" value={money(result.interest)} />
          </div>
          <SplitBar invested={result.principal} gains={result.interest} investedLabel="Principal" gainsLabel="Interest" />
          <div className="card overflow-x-auto p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--muted)]">
                  <th className="py-1 pr-4 font-medium">Year</th>
                  <th className="py-1 pr-4 font-medium">Opening</th>
                  <th className="py-1 font-medium">Value at year-end</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.year} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="py-1.5 pr-4">{r.year}</td>
                    <td className="py-1.5 pr-4">{money(r.invested)}</td>
                    <td className="py-1.5">{money(r.value)}</td>
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
