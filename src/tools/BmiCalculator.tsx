"use client";

import { useMemo, useState } from "react";

type System = "metric" | "imperial";

const CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "var(--accent)" },
  { max: 25, label: "Normal weight", color: "var(--success)" },
  { max: 30, label: "Overweight", color: "#f59e0b" },
  { max: Infinity, label: "Obese", color: "var(--danger)" },
];

export default function BmiCalculator() {
  const [system, setSystem] = useState<System>("metric");
  const [cm, setCm] = useState("170");
  const [kg, setKg] = useState("70");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("7");
  const [lb, setLb] = useState("154");

  const result = useMemo(() => {
    let heightM: number;
    let weightKg: number;
    if (system === "metric") {
      heightM = parseFloat(cm) / 100;
      weightKg = parseFloat(kg);
    } else {
      const totalIn = parseFloat(ft) * 12 + parseFloat(inch || "0");
      heightM = totalIn * 0.0254;
      weightKg = parseFloat(lb) * 0.453592;
    }
    if (!isFinite(heightM) || !isFinite(weightKg) || heightM <= 0 || weightKg <= 0) return null;
    const bmi = weightKg / (heightM * heightM);
    const cat = CATEGORIES.find((c) => bmi < c.max)!;
    const lowKg = 18.5 * heightM * heightM;
    const highKg = 24.9 * heightM * heightM;
    const range = system === "metric"
      ? `${lowKg.toFixed(1)}–${highKg.toFixed(1)} kg`
      : `${(lowKg / 0.453592).toFixed(0)}–${(highKg / 0.453592).toFixed(0)} lb`;
    return { bmi, cat, range };
  }, [system, cm, kg, ft, inch, lb]);

  // Position on a 15–40 scale for the marker
  const markerPct = result ? Math.min(100, Math.max(0, ((result.bmi - 15) / (40 - 15)) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Tab active={system === "metric"} onClick={() => setSystem("metric")} label="Metric (cm / kg)" />
        <Tab active={system === "imperial"} onClick={() => setSystem("imperial")} label="Imperial (ft / lb)" />
      </div>

      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        {system === "metric" ? (
          <>
            <div><label className="label" htmlFor="cm">Height (cm)</label><input id="cm" type="number" className="input" value={cm} onChange={(e) => setCm(e.target.value)} /></div>
            <div><label className="label" htmlFor="kg">Weight (kg)</label><input id="kg" type="number" className="input" value={kg} onChange={(e) => setKg(e.target.value)} /></div>
          </>
        ) : (
          <>
            <div>
              <label className="label">Height</label>
              <div className="flex gap-2">
                <input type="number" className="input" placeholder="ft" value={ft} onChange={(e) => setFt(e.target.value)} aria-label="Feet" />
                <input type="number" className="input" placeholder="in" value={inch} onChange={(e) => setInch(e.target.value)} aria-label="Inches" />
              </div>
            </div>
            <div><label className="label" htmlFor="lb">Weight (lb)</label><input id="lb" type="number" className="input" value={lb} onChange={(e) => setLb(e.target.value)} /></div>
          </>
        )}
      </div>

      {result && (
        <div className="card p-6">
          <div className="text-center">
            <p className="text-sm text-[var(--muted)]">Your BMI</p>
            <p className="mt-1 text-4xl font-bold" style={{ color: result.cat.color }}>{result.bmi.toFixed(1)}</p>
            <p className="mt-1 text-lg font-semibold" style={{ color: result.cat.color }}>{result.cat.label}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Healthy weight for your height: {result.range}</p>
          </div>

          <div className="relative mt-6">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              <div style={{ width: "14%", background: "var(--accent)" }} />
              <div style={{ width: "26%", background: "var(--success)" }} />
              <div style={{ width: "20%", background: "#f59e0b" }} />
              <div style={{ width: "40%", background: "var(--danger)" }} />
            </div>
            <div className="absolute -top-1 h-5 w-1 -translate-x-1/2 rounded" style={{ left: `${markerPct}%`, background: "var(--foreground)" }} aria-hidden />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--muted)]"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-semibold"
      style={{ background: active ? "var(--brand)" : "var(--surface-2)", color: active ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
    >
      {label}
    </button>
  );
}
