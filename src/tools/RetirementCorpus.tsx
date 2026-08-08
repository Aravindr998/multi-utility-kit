"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";
import { monthlyForTarget } from "./savings/shared";

/**
 * Retirement planning: inflate today's expenses to retirement, size the corpus
 * that funds an inflation-adjusted income through retirement, then find the
 * monthly investment needed to build it.
 */
export default function RetirementCorpus() {
  const [ageNow, setAgeNow] = useState("30");
  const [ageRetire, setAgeRetire] = useState("60");
  const [expenses, setExpenses] = useState("50000");
  const [inflation, setInflation] = useState("6");
  const [retYears, setRetYears] = useState("25");
  const [preReturn, setPreReturn] = useState("12");
  const [postReturn, setPostReturn] = useState("8");
  const [current, setCurrent] = useState("500000");

  const result = useMemo(() => {
    const a = parseFloat(ageNow);
    const rt = parseFloat(ageRetire);
    const exp = parseFloat(expenses);
    const inf = parseFloat(inflation) || 0;
    const ry = parseFloat(retYears);
    const pre = parseFloat(preReturn) || 0;
    const post = parseFloat(postReturn) || 0;
    const cur = parseFloat(current) || 0;
    if ([a, rt, exp, ry].some((v) => isNaN(v)) || rt <= a || exp <= 0 || ry <= 0) return null;

    const yearsToRetire = rt - a;
    const monthlyAtRetire = exp * Math.pow(1 + inf / 100, yearsToRetire);
    const annualAtRetire = monthlyAtRetire * 12;

    // Real return during retirement (post-retirement return net of inflation).
    const real = (1 + post / 100) / (1 + inf / 100) - 1;
    let corpus: number;
    if (Math.abs(real) < 1e-9) {
      corpus = annualAtRetire * ry;
    } else {
      corpus = annualAtRetire * ((1 - Math.pow(1 + real, -ry)) / real) * (1 + real);
    }

    const monthlyInvest = monthlyForTarget(cur, corpus, pre, yearsToRetire);
    return { corpus, monthlyAtRetire, monthlyInvest, yearsToRetire };
  }, [ageNow, ageRetire, expenses, inflation, retYears, preReturn, postReturn, current]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Current age" htmlFor="rc-a">
          <input id="rc-a" type="number" className="input" value={ageNow} onChange={(e) => setAgeNow(e.target.value)} />
        </Field>
        <Field label="Retirement age" htmlFor="rc-rt">
          <input id="rc-rt" type="number" className="input" value={ageRetire} onChange={(e) => setAgeRetire(e.target.value)} />
        </Field>
        <Field label="Monthly expenses (today)" htmlFor="rc-exp">
          <input id="rc-exp" type="number" className="input" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
        </Field>
        <Field label="Inflation (% / year)" htmlFor="rc-inf">
          <input id="rc-inf" type="number" step="0.1" className="input" value={inflation} onChange={(e) => setInflation(e.target.value)} />
        </Field>
        <Field label="Years in retirement" htmlFor="rc-ry">
          <input id="rc-ry" type="number" className="input" value={retYears} onChange={(e) => setRetYears(e.target.value)} />
        </Field>
        <Field label="Return before retirement (%)" htmlFor="rc-pre">
          <input id="rc-pre" type="number" step="0.1" className="input" value={preReturn} onChange={(e) => setPreReturn(e.target.value)} />
        </Field>
        <Field label="Return during retirement (%)" htmlFor="rc-post">
          <input id="rc-post" type="number" step="0.1" className="input" value={postReturn} onChange={(e) => setPostReturn(e.target.value)} />
        </Field>
        <Field label="Current savings" htmlFor="rc-cur" hint="optional">
          <input id="rc-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult
            label="Retirement corpus needed"
            value={money(result.corpus)}
            sub={`at age ${ageRetire}, ${result.yearsToRetire} years away`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label="Monthly expenses at retirement" value={money(result.monthlyAtRetire)} hint="inflation-adjusted" />
            <Stat label="Monthly investment needed" value={money(result.monthlyInvest)} />
          </div>
        </>
      )}
    </div>
  );
}
