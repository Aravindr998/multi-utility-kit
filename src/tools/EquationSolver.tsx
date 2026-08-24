"use client";

import { useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Equation Solver — linear (ax + b = 0) and quadratic (ax² + bx + c = 0),
// with worked steps and support for complex roots.
// ---------------------------------------------------------------------------

type Kind = "linear" | "quadratic";

function num(v: string): number {
  const n = parseFloat(v);
  return isFinite(n) ? n : NaN;
}

/** Trim floating-point noise for display. */
function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  const rounded = Math.round(n * 1e6) / 1e6;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

type Solution = { steps: string[]; roots: string[]; note?: string };

function solveLinear(a: number, b: number): Solution {
  if (a === 0) {
    return b === 0
      ? { steps: ["0·x + 0 = 0 is true for every x."], roots: [], note: "Infinitely many solutions — any value of x works." }
      : { steps: [`0·x + ${fmt(b)} = 0 has no solution.`], roots: [], note: "No solution — the equation is never true." };
  }
  const x = -b / a;
  return {
    steps: [
      `Start with ${fmt(a)}x + ${fmt(b)} = 0`,
      `Subtract ${fmt(b)}:  ${fmt(a)}x = ${fmt(-b)}`,
      `Divide by ${fmt(a)}:  x = ${fmt(-b)} / ${fmt(a)}`,
    ],
    roots: [`x = ${fmt(x)}`],
  };
}

function solveQuadratic(a: number, b: number, c: number): Solution {
  if (a === 0) {
    // Degenerates to linear.
    const lin = solveLinear(b, c);
    return { ...lin, steps: ["a = 0, so this is actually linear:", ...lin.steps] };
  }
  const disc = b * b - 4 * a * c;
  const steps = [
    `Start with ${fmt(a)}x² + ${fmt(b)}x + ${fmt(c)} = 0`,
    `Discriminant Δ = b² − 4ac = ${fmt(b)}² − 4·${fmt(a)}·${fmt(c)} = ${fmt(disc)}`,
  ];

  if (disc > 0) {
    const sq = Math.sqrt(disc);
    const r1 = (-b + sq) / (2 * a);
    const r2 = (-b - sq) / (2 * a);
    steps.push(
      `Δ > 0 → two distinct real roots.`,
      `x = (−b ± √Δ) / 2a = (${fmt(-b)} ± √${fmt(disc)}) / ${fmt(2 * a)}`,
    );
    return { steps, roots: [`x₁ = ${fmt(r1)}`, `x₂ = ${fmt(r2)}`] };
  }
  if (disc === 0) {
    const r = -b / (2 * a);
    steps.push(`Δ = 0 → one repeated real root.`, `x = −b / 2a = ${fmt(-b)} / ${fmt(2 * a)}`);
    return { steps, roots: [`x = ${fmt(r)}`], note: "Double root (repeated)." };
  }
  // Complex roots.
  const real = -b / (2 * a);
  const imag = Math.sqrt(-disc) / (2 * a);
  steps.push(
    `Δ < 0 → two complex conjugate roots.`,
    `x = (−b ± √Δ) / 2a with √Δ = √(${fmt(disc)}) = ${fmt(Math.sqrt(-disc))}i`,
  );
  return {
    steps,
    roots: [
      `x₁ = ${fmt(real)} + ${fmt(Math.abs(imag))}i`,
      `x₂ = ${fmt(real)} − ${fmt(Math.abs(imag))}i`,
    ],
    note: "Complex conjugate roots.",
  };
}

export default function EquationSolver() {
  const [kind, setKind] = useState<Kind>("quadratic");
  const [a, setA] = useState("1");
  const [b, setB] = useState("-3");
  const [c, setC] = useState("2");

  const solution = useMemo<Solution | null>(() => {
    const na = num(a);
    const nb = num(b);
    if (isNaN(na) || isNaN(nb)) return null;
    if (kind === "linear") return solveLinear(na, nb);
    const nc = num(c);
    if (isNaN(nc)) return null;
    return solveQuadratic(na, nb, nc);
  }, [kind, a, b, c]);

  return (
    <div className="space-y-4">
      {/* Kind switch */}
      <div className="flex gap-2">
        <TypeBtn active={kind === "linear"} onClick={() => setKind("linear")}>
          Linear · ax + b = 0
        </TypeBtn>
        <TypeBtn active={kind === "quadratic"} onClick={() => setKind("quadratic")}>
          Quadratic · ax² + bx + c = 0
        </TypeBtn>
      </div>

      {/* Coefficients */}
      <div className="card p-5">
        <div className="flex flex-wrap items-end gap-3">
          <Coef label="a" value={a} onChange={setA} />
          <Coef label="b" value={b} onChange={setB} />
          {kind === "quadratic" && <Coef label="c" value={c} onChange={setC} />}
        </div>
        <p className="mt-3 font-mono text-sm text-[var(--muted)]">
          {kind === "linear"
            ? `${fmt(num(a) || 0)}x + ${fmt(num(b) || 0)} = 0`
            : `${fmt(num(a) || 0)}x² + ${fmt(num(b) || 0)}x + ${fmt(num(c) || 0)} = 0`}
        </p>
      </div>

      {/* Result */}
      {solution == null ? (
        <p className="text-center text-[var(--muted)]">
          Enter numeric coefficients to solve the equation.
        </p>
      ) : (
        <div className="card p-5">
          <h3 className="mb-3 text-base font-semibold">Solution</h3>
          {solution.roots.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {solution.roots.map((r) => (
                <span
                  key={r}
                  className="rounded-lg px-3 py-2 font-mono text-lg font-semibold"
                  style={{ background: "var(--surface-2)", color: "var(--brand)" }}
                >
                  {r}
                </span>
              ))}
            </div>
          ) : null}
          {solution.note && (
            <p className="mb-4 text-sm" style={{ color: "var(--warning)" }}>
              {solution.note}
            </p>
          )}
          <div className="rounded-lg p-4" style={{ background: "var(--surface-2)" }}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Steps
            </div>
            <ol className="space-y-1.5 font-mono text-sm">
              {solution.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function TypeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-lg px-3 py-2 text-sm font-medium"
      style={
        active
          ? { background: "var(--brand)", color: "var(--on-brand)" }
          : { color: "var(--muted)", border: "1px solid var(--border)" }
      }
    >
      {children}
    </button>
  );
}

function Coef({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col">
      <span className="mb-1 font-mono text-sm font-semibold">{label}</span>
      <input
        type="number"
        step="any"
        className="input w-24 text-center"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Coefficient ${label}`}
      />
    </label>
  );
}
