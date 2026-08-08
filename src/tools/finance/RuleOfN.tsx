"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, num } from "./shared";

export type RuleConfig = {
  divisor: 72 | 114 | 144;
  /** What the money does: "double", "triple", "quadruple". */
  action: string;
  /** The multiple as a number, e.g. 2, 3, 4. */
  multiple: number;
};

/**
 * Rule of 72 / 114 / 144 — quick mental-math estimates.
 * years ≈ divisor / rate   and   rate ≈ divisor / years.
 */
export default function RuleOfN({ config }: { config: RuleConfig }) {
  const { divisor, action, multiple } = config;
  const [mode, setMode] = useState<"years" | "rate">("years");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("9");

  const result = useMemo(() => {
    if (mode === "years") {
      const r = parseFloat(rate);
      if (isNaN(r) || r <= 0) return null;
      return { primary: divisor / r, exact: Math.log(multiple) / Math.log(1 + r / 100) };
    }
    const y = parseFloat(years);
    if (isNaN(y) || y <= 0) return null;
    return { primary: divisor / y, exact: (Math.pow(multiple, 1 / y) - 1) * 100 };
  }, [mode, rate, years, divisor, multiple]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          className={`btn ${mode === "years" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("years")}
        >
          Years to {action}
        </button>
        <button
          className={`btn ${mode === "rate" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setMode("rate")}
        >
          Rate to {action}
        </button>
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        {mode === "years" ? (
          <Field label="Annual return / interest (%)" htmlFor="rn-rate">
            <input id="rn-rate" type="number" step="0.1" className="input" value={rate} onChange={(e) => setRate(e.target.value)} />
          </Field>
        ) : (
          <Field label="Number of years" htmlFor="rn-yrs">
            <input id="rn-yrs" type="number" step="0.5" className="input" value={years} onChange={(e) => setYears(e.target.value)} />
          </Field>
        )}
      </div>

      {result && (
        <>
          <BigResult
            label={mode === "years" ? `Years to ${action} your money` : `Return needed to ${action} your money`}
            value={mode === "years" ? `${num(result.primary, 1)} yrs` : `${num(result.primary, 2)}%`}
            sub={`Rule of ${divisor} estimate`}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
            <Stat
              label="Precise value (exact compounding)"
              value={mode === "years" ? `${num(result.exact, 2)} yrs` : `${num(result.exact, 2)}%`}
            />
          </div>
          <p className="text-center text-xs text-[var(--faint)]">
            The Rule of {divisor} divides {divisor} by the rate (or years) to quickly estimate how long money
            takes to {action} ({multiple}×). The precise figure uses exact compounding.
          </p>
        </>
      )}
    </div>
  );
}
