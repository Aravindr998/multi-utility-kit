"use client";

// ---------------------------------------------------------------------------
// Shared helpers & UI for the Investments calculators.
// Currency-agnostic: numbers are formatted with thousands separators only.
// ---------------------------------------------------------------------------

import type { ReactNode } from "react";

/** Format a number with 2 decimals and thousands separators. */
export function money(n: number): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

/** Format a whole-ish number (no forced decimals), thousands separators. */
export function num(n: number, dp = 0): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: dp });
}

/** Compact large numbers for chart axes: 12.3K, 4.5M, 1.2B. */
export function compact(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toString();
}

/** Percent with up to 2 decimals. */
export function pct(n: number, dp = 2): string {
  if (!isFinite(n)) return "—";
  return n.toFixed(dp) + "%";
}

// -------------------------------- Math -------------------------------------

/**
 * Effective monthly rate for an annual return: (1 + r)^(1/12) − 1.
 * We treat "% p.a." as the effective ANNUAL return (so 12% compounds to 12% in a
 * year, not 12.68%). This matches Groww's SIP calculators and keeps the SIP tools
 * consistent with the lumpsum tool, which already compounds annually.
 */
export function monthlyRate(annualRatePct: number): number {
  return Math.pow(1 + annualRatePct / 100, 1 / 12) - 1;
}

/**
 * Future value of a regular SIP with monthly compounding.
 * Contributions are made at the START of each month (annuity due),
 * which is the convention most Indian SIP calculators use.
 */
export function sipFutureValue(monthly: number, annualRatePct: number, years: number): number {
  const n = Math.round(years * 12);
  const i = monthlyRate(annualRatePct);
  if (n <= 0) return 0;
  if (i === 0) return monthly * n;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

/** Future value of a one-time lumpsum with annual compounding. */
export function lumpsumFutureValue(principal: number, annualRatePct: number, years: number): number {
  return principal * Math.pow(1 + annualRatePct / 100, years);
}

/** Monthly SIP required to reach a target future value. */
export function sipForTarget(target: number, annualRatePct: number, years: number): number {
  const n = Math.round(years * 12);
  const i = monthlyRate(annualRatePct);
  if (n <= 0) return 0;
  if (i === 0) return target / n;
  return target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
}

/** Compound annual growth rate (CAGR) as a percentage. */
export function cagr(begin: number, end: number, years: number): number {
  if (begin <= 0 || years <= 0) return NaN;
  return (Math.pow(end / begin, 1 / years) - 1) * 100;
}

export type YearPoint = { year: number; invested: number; value: number };

// -------------------------------- UI ---------------------------------------

/**
 * Two-series chart palette. The design system is monochrome (--brand and
 * --accent resolve to the SAME neutral), so data viz needs its own distinct
 * colors. Series 0 is the neutral brand (flips light/dark with the theme);
 * series 1 is a fixed indigo that reads on both light and dark cards.
 */
export const CHART_PRIMARY = "var(--brand)";
export const CHART_SECONDARY = "#6366f1";
const CHART_PALETTE = [CHART_PRIMARY, CHART_SECONDARY];

export function BigResult({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card p-6 text-center">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-4xl font-bold" style={{ color: "var(--brand)" }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-sm text-[var(--muted)]">{sub}</p>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs text-[var(--muted)]">{label}</div>
      {hint && <div className="mt-0.5 text-[11px] text-[var(--faint)]">{hint}</div>}
    </div>
  );
}

/** Invested-vs-returns split bar (like the loan principal/interest bar). */
export function SplitBar({
  invested,
  gains,
  investedLabel = "Invested",
  gainsLabel = "Returns",
}: {
  invested: number;
  gains: number;
  investedLabel?: string;
  gainsLabel?: string;
}) {
  const total = invested + gains;
  const iPct = total > 0 ? (invested / total) * 100 : 0;
  const gPct = 100 - iPct;
  return (
    <div>
      <div
        className="flex h-4 w-full overflow-hidden rounded-full"
        style={{ background: "var(--surface-2)" }}
      >
        <div style={{ width: `${iPct}%`, background: CHART_PRIMARY }} />
        <div style={{ width: `${gPct}%`, background: CHART_SECONDARY }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
        <span><span style={{ color: CHART_PRIMARY }}>◼</span> {investedLabel} {iPct.toFixed(0)}%</span>
        <span>{gainsLabel} {gPct.toFixed(0)}% <span style={{ color: CHART_SECONDARY }}>◼</span></span>
      </div>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--faint)]">{hint}</p>}
    </div>
  );
}

/**
 * Labelled numeric input paired with a range slider (Groww-style). The value is
 * shown in a highlighted pill you can also type into; the slider stays in sync.
 */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  hint,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  id?: string;
}) {
  const numeric = parseFloat(value);
  const sliderVal = isFinite(numeric) ? Math.min(max, Math.max(min, numeric)) : min;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-[var(--muted)]" htmlFor={id}>
          {label}
        </label>
        <div
          className="flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-semibold"
          style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
        >
          {prefix && <span className="opacity-70">{prefix}</span>}
          <input
            id={id}
            type="number"
            className="w-24 bg-transparent text-right font-semibold outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {suffix && <span className="opacity-70">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderVal}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full cursor-pointer"
        style={{ accentColor: "var(--brand)" }}
        aria-label={label}
      />
      {hint && <p className="mt-1 text-xs text-[var(--faint)]">{hint}</p>}
    </div>
  );
}

/**
 * Donut chart for a small set of parts (e.g. invested vs returns), with a legend
 * showing each part's amount and share. Center is left open, Groww-style.
 */
export function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color?: string }[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const colorAt = (i: number) => CHART_PALETTE[i % CHART_PALETTE.length];
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1;
  const R = 60;
  const stroke = 24;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="card flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-center">
      <svg viewBox="0 0 160 160" width="180" height="180" role="img" aria-label="Breakdown">
        <g transform="rotate(-90 80 80)">
          <circle cx={80} cy={80} r={R} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
          {segments.map((s, idx) => {
            const frac = Math.max(0, s.value) / total;
            const dash = frac * C;
            const el = (
              <circle
                key={idx}
                cx={80}
                cy={80}
                r={R}
                fill="none"
                stroke={colorAt(idx)}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </g>
        {centerValue && (
          <>
            <text x={80} y={centerLabel ? 76 : 84} textAnchor="middle" fontSize={11} fill="var(--muted)">
              {centerLabel}
            </text>
            <text x={80} y={centerLabel ? 92 : 84} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--foreground)">
              {centerValue}
            </text>
          </>
        )}
      </svg>
      <div className="space-y-2">
        {segments.map((s, idx) => {
          const p = (Math.max(0, s.value) / total) * 100;
          return (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ background: colorAt(idx) }} />
              <span className="text-[var(--muted)]">{s.label}</span>
              <span className="ml-auto pl-4 font-semibold">{money(s.value)}</span>
              <span className="w-12 text-right text-xs text-[var(--faint)]">{p.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Stacked area growth chart from a yearly series.
 * Shows cumulative invested (brand) and total value (accent on top).
 */
export function GrowthChart({ data }: { data: YearPoint[] }) {
  if (data.length < 2) return null;
  const W = 640;
  const H = 220;
  const padL = 16;
  const padR = 16;
  const padT = 14;
  const padB = 26;
  const maxV = Math.max(...data.map((d) => d.value), 1);
  const minYear = data[0].year;
  const maxYear = data[data.length - 1].year;
  const spanYear = Math.max(maxYear - minYear, 1);

  const x = (year: number) => padL + ((year - minYear) / spanYear) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / maxV) * (H - padT - padB);

  const areaPath = (key: "invested" | "value") => {
    const top = data.map((d) => `${x(d.year)},${y(d[key])}`).join(" L ");
    const x0 = x(data[0].year);
    const x1 = x(data[data.length - 1].year);
    const y0 = y(0);
    return `M ${x0},${y0} L ${top} L ${x1},${y0} Z`;
  };

  const ticks = 4;
  return (
    <div className="card overflow-hidden p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Growth over time">
        {/* horizontal gridlines */}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const v = (maxV / ticks) * i;
          const yy = y(v);
          return (
            <g key={i}>
              <line
                x1={padL}
                x2={W - padR}
                y1={yy}
                y2={yy}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text x={padL} y={yy - 3} fontSize={10} fill="var(--faint)">
                {compact(v)}
              </text>
            </g>
          );
        })}
        {/* total value area */}
        <path d={areaPath("value")} fill={CHART_SECONDARY} opacity={0.28} />
        <polyline
          points={data.map((d) => `${x(d.year)},${y(d.value)}`).join(" ")}
          fill="none"
          stroke={CHART_SECONDARY}
          strokeWidth={2}
        />
        {/* invested area on top */}
        <path d={areaPath("invested")} fill={CHART_PRIMARY} opacity={0.35} />
        <polyline
          points={data.map((d) => `${x(d.year)},${y(d.invested)}`).join(" ")}
          fill="none"
          stroke={CHART_PRIMARY}
          strokeWidth={2}
        />
        {/* x labels: first, middle, last */}
        {[data[0], data[Math.floor(data.length / 2)], data[data.length - 1]].map((d, i) => (
          <text
            key={i}
            x={x(d.year)}
            y={H - 8}
            fontSize={10}
            fill="var(--muted)"
            textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
          >
            Yr {d.year}
          </text>
        ))}
      </svg>
      <div className="mt-1 flex justify-center gap-4 text-xs text-[var(--muted)]">
        <span>
          <span style={{ color: CHART_PRIMARY }}>◼</span> Invested
        </span>
        <span>
          <span style={{ color: CHART_SECONDARY }}>◼</span> Total value
        </span>
      </div>
    </div>
  );
}
