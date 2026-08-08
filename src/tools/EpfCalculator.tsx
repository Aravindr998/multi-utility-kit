"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  Field,
  GrowthChart,
  SplitBar,
  Stat,
  money,
  type YearPoint,
} from "./finance/shared";

/**
 * EPF: employee and employer contribute a % of monthly basic (Basic + DA) each
 * month; the balance earns interest (credited annually, modelled monthly on the
 * running balance). Basic salary grows each year by the increment rate.
 */
function simulate(
  ageNow: number,
  ageRetire: number,
  basic: number,
  empPct: number,
  erPct: number,
  growthPct: number,
  ratePct: number
) {
  const months = Math.round((ageRetire - ageNow) * 12);
  const mRate = ratePct / 100 / 12;
  let balance = 0;
  let contributed = 0;
  let curBasic = basic;
  const data: YearPoint[] = [{ year: 0, invested: 0, value: 0 }];
  for (let mo = 1; mo <= months; mo++) {
    const contrib = curBasic * (empPct + erPct) / 100;
    balance = (balance + contrib) * (1 + mRate);
    contributed += contrib;
    if (mo % 12 === 0) {
      curBasic *= 1 + growthPct / 100;
      data.push({ year: mo / 12, invested: contributed, value: balance });
    }
  }
  if (months % 12 !== 0) data.push({ year: months / 12, invested: contributed, value: balance });
  return { corpus: balance, contributed, interest: balance - contributed, data };
}

export default function EpfCalculator() {
  const [ageNow, setAgeNow] = useState("30");
  const [ageRetire, setAgeRetire] = useState("58");
  const [basic, setBasic] = useState("30000");
  const [empPct, setEmpPct] = useState("12");
  const [erPct, setErPct] = useState("3.67");
  const [growth, setGrowth] = useState("6");
  const [rate, setRate] = useState("8.25");

  const result = useMemo(() => {
    const a = parseFloat(ageNow);
    const rt = parseFloat(ageRetire);
    const b = parseFloat(basic);
    const ep = parseFloat(empPct);
    const er = parseFloat(erPct);
    const g = parseFloat(growth);
    const r = parseFloat(rate);
    if ([a, rt, b, ep, er, g, r].some((v) => isNaN(v)) || rt <= a || b <= 0) return null;
    return simulate(a, rt, b, ep, er, g, r);
  }, [ageNow, ageRetire, basic, empPct, erPct, growth, rate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Current age" htmlFor="epf-a">
          <input id="epf-a" type="number" className="input" value={ageNow} onChange={(e) => setAgeNow(e.target.value)} />
        </Field>
        <Field label="Retirement age" htmlFor="epf-rt">
          <input id="epf-rt" type="number" className="input" value={ageRetire} onChange={(e) => setAgeRetire(e.target.value)} />
        </Field>
        <Field label="Monthly basic (Basic + DA)" htmlFor="epf-b">
          <input id="epf-b" type="number" className="input" value={basic} onChange={(e) => setBasic(e.target.value)} />
        </Field>
        <Field label="Annual increment (%)" htmlFor="epf-g">
          <input id="epf-g" type="number" step="0.5" className="input" value={growth} onChange={(e) => setGrowth(e.target.value)} />
        </Field>
        <Field label="Employee contribution (%)" htmlFor="epf-ep">
          <input id="epf-ep" type="number" step="0.01" className="input" value={empPct} onChange={(e) => setEmpPct(e.target.value)} />
        </Field>
        <Field label="Employer to EPF (%)" htmlFor="epf-er" hint="8.33% of the 12% goes to EPS">
          <input id="epf-er" type="number" step="0.01" className="input" value={erPct} onChange={(e) => setErPct(e.target.value)} />
        </Field>
        <Field label="Interest rate (% / year)" htmlFor="epf-r">
          <input id="epf-r" type="number" step="0.05" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="EPF corpus at retirement" value={money(result.corpus)} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Total contributed" value={money(result.contributed)} />
            <Stat label="Interest earned" value={money(result.interest)} />
          </div>
          <SplitBar invested={result.contributed} gains={result.interest} investedLabel="Contributed" gainsLabel="Interest" />
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
