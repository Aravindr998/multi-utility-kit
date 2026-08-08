"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";

/**
 * Treasury Bills are zero-coupon: bought at a discount to face value and redeemed
 * at face value. Given price you get the yield; given yield you get the price.
 */
export default function TreasuryBillCalculator() {
  const [mode, setMode] = useState<"price" | "yield">("price");
  const [face, setFace] = useState("100");
  const [price, setPrice] = useState("98.25");
  const [yieldPct, setYieldPct] = useState("7.13");
  const [days, setDays] = useState("91");

  const result = useMemo(() => {
    const F = parseFloat(face);
    const d = parseFloat(days);
    if (isNaN(F) || isNaN(d) || F <= 0 || d <= 0) return null;

    let P: number;
    let y: number;
    if (mode === "price") {
      P = parseFloat(price);
      if (isNaN(P) || P <= 0 || P >= F) return { error: "Purchase price must be positive and below face value." };
      y = ((F - P) / P) * (365 / d) * 100;
    } else {
      y = parseFloat(yieldPct);
      if (isNaN(y) || y <= 0) return { error: "Enter a positive yield." };
      P = F / (1 + (y / 100) * (d / 365));
    }
    const discount = F - P;
    return { price: P, yield: y, discount, face: F, days: d };
  }, [mode, face, price, yieldPct, days]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button className={`btn ${mode === "price" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("price")}>
          I know the price
        </button>
        <button className={`btn ${mode === "yield" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("yield")}>
          I know the yield
        </button>
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-3">
        <Field label="Face value" htmlFor="tb-f">
          <input id="tb-f" type="number" className="input" value={face} onChange={(e) => setFace(e.target.value)} />
        </Field>
        {mode === "price" ? (
          <Field label="Purchase price" htmlFor="tb-p">
            <input id="tb-p" type="number" step="0.01" className="input" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Field>
        ) : (
          <Field label="Yield (% / year)" htmlFor="tb-y">
            <input id="tb-y" type="number" step="0.01" className="input" value={yieldPct} onChange={(e) => setYieldPct(e.target.value)} />
          </Field>
        )}
        <Field label="Tenure (days)" htmlFor="tb-d">
          <select id="tb-d" className="input" value={days} onChange={(e) => setDays(e.target.value)}>
            <option value="91">91 days</option>
            <option value="182">182 days</option>
            <option value="364">364 days</option>
          </select>
        </Field>
      </div>

      {result && "error" in result && (
        <div className="card p-4 text-sm text-[var(--muted)]">{result.error}</div>
      )}

      {result && !("error" in result) && (
        <>
          <BigResult
            label={mode === "price" ? "Annualized yield" : "Purchase price"}
            value={mode === "price" ? pct(result.yield) : money(result.price)}
            sub={`${result.days}-day T-bill`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Purchase price" value={money(result.price)} />
            <Stat label="Face value at maturity" value={money(result.face)} />
            <Stat label="Discount (return)" value={money(result.discount)} />
          </div>
        </>
      )}
    </div>
  );
}
