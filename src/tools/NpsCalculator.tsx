"use client";

import { useMemo, useState } from "react";
import {
  BigResult,
  Field,
  GrowthChart,
  SplitBar,
  Stat,
  money,
  monthlyRate,
  pct,
  type YearPoint,
} from "./finance/shared";

/**
 * NPS: monthly contribution until age 60, growing at an expected return. At 60,
 * a portion is used to buy an annuity (the rest can be withdrawn as a lump sum).
 * The annuity portion generates a monthly pension at the annuity rate.
 */
function simulate(ageNow: number, monthly: number, ratePct: number) {
  const months = Math.round((60 - ageNow) * 12);
  const mRate = monthlyRate(ratePct);
  let balance = 0;
  let invested = 0;
  const data: YearPoint[] = [{ year: 0, invested: 0, value: 0 }];
  for (let mo = 1; mo <= months; mo++) {
    balance = (balance + monthly) * (1 + mRate);
    invested += monthly;
    if (mo % 12 === 0 || mo === months) {
      data.push({ year: mo / 12, invested, value: balance });
    }
  }
  return { corpus: balance, invested, gains: balance - invested, data };
}

export default function NpsCalculator() {
  const [ageNow, setAgeNow] = useState("30");
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("10");
  const [annuityPct, setAnnuityPct] = useState("40");
  const [annuityRate, setAnnuityRate] = useState("6");

  const result = useMemo(() => {
    const a = parseFloat(ageNow);
    const m = parseFloat(monthly);
    const r = parseFloat(rate);
    const ap = parseFloat(annuityPct);
    const ar = parseFloat(annuityRate);
    if ([a, m, r, ap, ar].some((v) => isNaN(v)) || a >= 60 || m <= 0) return null;
    const sim = simulate(a, m, r);
    const annuityValue = sim.corpus * (ap / 100);
    const lumpSum = sim.corpus - annuityValue;
    const monthlyPension = (annuityValue * (ar / 100)) / 12;
    return { ...sim, annuityValue, lumpSum, monthlyPension };
  }, [ageNow, monthly, rate, annuityPct, annuityRate]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Current age" htmlFor="nps-a" hint="invests until age 60">
          <input id="nps-a" type="number" className="input" value={ageNow} onChange={(e) => setAgeNow(e.target.value)} />
        </Field>
        <Field label="Monthly contribution" htmlFor="nps-m">
          <input id="nps-m" type="number" className="input" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </Field>
        <Field label="Expected return (% / year)" htmlFor="nps-r">
          <input id="nps-r" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Annuity portion (%)" htmlFor="nps-ap" hint="min 40% at maturity">
          <input id="nps-ap" type="number" step="1" className="input" value={annuityPct} onChange={(e) => setAnnuityPct(e.target.value)} />
        </Field>
        <Field label="Annuity return (% / year)" htmlFor="nps-ar">
          <input id="nps-ar" type="number" step="0.1" className="input" value={annuityRate} onChange={(e) => setAnnuityRate(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Corpus at age 60" value={money(result.corpus)} sub={`estimated monthly pension ${money(result.monthlyPension)}`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total invested" value={money(result.invested)} />
            <Stat label="Total gains" value={money(result.gains)} />
            <Stat label="Lump sum (tax-free)" value={money(result.lumpSum)} hint={pct(100 - parseFloat(annuityPct), 0)} />
            <Stat label="Annuity corpus" value={money(result.annuityValue)} hint={pct(parseFloat(annuityPct), 0)} />
          </div>
          <SplitBar invested={result.invested} gains={result.gains} investedLabel="Invested" gainsLabel="Gains" />
          <GrowthChart data={result.data} />
        </>
      )}
    </div>
  );
}
