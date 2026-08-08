"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";

const FREQ: Record<string, number> = { annual: 1, "semi-annual": 2, quarterly: 4 };

/** Price a bond given an annual yield, coupon, face, years and coupon frequency. */
function priceAt(annualYield: number, face: number, couponRate: number, years: number, f: number): number {
  const n = Math.round(years * f);
  const c = (face * (couponRate / 100)) / f; // coupon per period
  const y = annualYield / 100 / f; // yield per period
  let pv = 0;
  for (let k = 1; k <= n; k++) pv += c / Math.pow(1 + y, k);
  pv += face / Math.pow(1 + y, n);
  return pv;
}

/** Solve for yield-to-maturity by bisection so priceAt(ytm) == market price. */
function ytm(face: number, couponRate: number, years: number, f: number, marketPrice: number): number {
  let lo = 0.0001;
  let hi = 100;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const p = priceAt(mid, face, couponRate, years, f);
    if (Math.abs(p - marketPrice) < 1e-6) return mid;
    // price falls as yield rises
    if (p > marketPrice) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export default function BondYieldCalculator() {
  const [face, setFace] = useState("1000");
  const [coupon, setCoupon] = useState("8");
  const [price, setPrice] = useState("950");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState<keyof typeof FREQ>("annual");

  const result = useMemo(() => {
    const F = parseFloat(face);
    const c = parseFloat(coupon);
    const P = parseFloat(price);
    const y = parseFloat(years);
    if ([F, c, P, y].some((v) => isNaN(v)) || F <= 0 || P <= 0 || y <= 0) return null;
    const f = FREQ[freq];
    const annualCoupon = F * (c / 100);
    const currentYield = (annualCoupon / P) * 100;
    const maturityYield = ytm(F, c, y, f, P);
    return { annualCoupon, currentYield, ytm: maturityYield, face: F, price: P };
  }, [face, coupon, price, years, freq]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Face value" htmlFor="by-f">
          <input id="by-f" type="number" className="input" value={face} onChange={(e) => setFace(e.target.value)} />
        </Field>
        <Field label="Coupon rate (% / year)" htmlFor="by-c">
          <input id="by-c" type="number" step="0.1" className="input" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
        </Field>
        <Field label="Market price" htmlFor="by-p">
          <input id="by-p" type="number" step="0.01" className="input" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field label="Years to maturity" htmlFor="by-y">
          <input id="by-y" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
        <Field label="Coupon frequency" htmlFor="by-freq">
          <select id="by-freq" className="input" value={freq} onChange={(e) => setFreq(e.target.value as keyof typeof FREQ)}>
            <option value="annual">Annual</option>
            <option value="semi-annual">Semi-annual</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Yield to maturity (YTM)" value={pct(result.ytm)} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Current yield" value={pct(result.currentYield)} />
            <Stat label="Annual coupon" value={money(result.annualCoupon)} />
            <Stat
              label={result.price < result.face ? "Trading at a discount" : result.price > result.face ? "Trading at a premium" : "Trading at par"}
              value={money(result.price)}
            />
          </div>
        </>
      )}
    </div>
  );
}
