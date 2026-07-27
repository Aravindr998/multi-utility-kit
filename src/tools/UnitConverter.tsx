"use client";

import { useMemo, useState } from "react";

type Unit = { name: string; toBase: number };
type Cat = { key: string; label: string; units: Record<string, Unit> };

// Non-temperature categories use linear factors to a base unit.
const CATS: Cat[] = [
  {
    key: "length",
    label: "Length",
    units: {
      mm: { name: "Millimeter", toBase: 0.001 },
      cm: { name: "Centimeter", toBase: 0.01 },
      m: { name: "Meter", toBase: 1 },
      km: { name: "Kilometer", toBase: 1000 },
      in: { name: "Inch", toBase: 0.0254 },
      ft: { name: "Foot", toBase: 0.3048 },
      yd: { name: "Yard", toBase: 0.9144 },
      mi: { name: "Mile", toBase: 1609.344 },
    },
  },
  {
    key: "weight",
    label: "Weight",
    units: {
      mg: { name: "Milligram", toBase: 0.001 },
      g: { name: "Gram", toBase: 1 },
      kg: { name: "Kilogram", toBase: 1000 },
      t: { name: "Tonne", toBase: 1_000_000 },
      oz: { name: "Ounce", toBase: 28.3495 },
      lb: { name: "Pound", toBase: 453.592 },
      st: { name: "Stone", toBase: 6350.29 },
    },
  },
  {
    key: "temperature",
    label: "Temperature",
    units: {
      C: { name: "Celsius", toBase: 1 },
      F: { name: "Fahrenheit", toBase: 1 },
      K: { name: "Kelvin", toBase: 1 },
    },
  },
  {
    key: "speed",
    label: "Speed",
    units: {
      "m/s": { name: "Meters/sec", toBase: 1 },
      "km/h": { name: "Km/hour", toBase: 0.277778 },
      "mph": { name: "Miles/hour", toBase: 0.44704 },
      "kn": { name: "Knot", toBase: 0.514444 },
    },
  },
  {
    key: "area",
    label: "Area",
    units: {
      "cm2": { name: "cm²", toBase: 0.0001 },
      "m2": { name: "m²", toBase: 1 },
      "km2": { name: "km²", toBase: 1_000_000 },
      "ha": { name: "Hectare", toBase: 10000 },
      "ft2": { name: "ft²", toBase: 0.092903 },
      "ac": { name: "Acre", toBase: 4046.86 },
    },
  },
  {
    key: "volume",
    label: "Volume",
    units: {
      ml: { name: "Milliliter", toBase: 0.001 },
      l: { name: "Liter", toBase: 1 },
      m3: { name: "m³", toBase: 1000 },
      tsp: { name: "Teaspoon (US)", toBase: 0.00492892 },
      tbsp: { name: "Tablespoon (US)", toBase: 0.0147868 },
      cup: { name: "Cup (US)", toBase: 0.236588 },
      gal: { name: "Gallon (US)", toBase: 3.78541 },
    },
  },
  {
    key: "data",
    label: "Digital storage",
    units: {
      B: { name: "Byte", toBase: 1 },
      KB: { name: "Kilobyte", toBase: 1024 },
      MB: { name: "Megabyte", toBase: 1024 ** 2 },
      GB: { name: "Gigabyte", toBase: 1024 ** 3 },
      TB: { name: "Terabyte", toBase: 1024 ** 4 },
    },
  },
  {
    key: "time",
    label: "Time",
    units: {
      ms: { name: "Millisecond", toBase: 0.001 },
      s: { name: "Second", toBase: 1 },
      min: { name: "Minute", toBase: 60 },
      h: { name: "Hour", toBase: 3600 },
      d: { name: "Day", toBase: 86400 },
      wk: { name: "Week", toBase: 604800 },
    },
  },
];

function toCelsius(v: number, from: string) {
  if (from === "C") return v;
  if (from === "F") return (v - 32) * (5 / 9);
  return v - 273.15; // K
}
function fromCelsius(c: number, to: string) {
  if (to === "C") return c;
  if (to === "F") return c * (9 / 5) + 32;
  return c + 273.15;
}

function trim(n: number): string {
  if (!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 8 });
}

export default function UnitConverter() {
  const [catKey, setCatKey] = useState("length");
  const cat = CATS.find((c) => c.key === catKey)!;
  const unitKeys = Object.keys(cat.units);
  const [from, setFrom] = useState(unitKeys[0]);
  const [to, setTo] = useState(unitKeys[1]);
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    if (cat.key === "temperature") return trim(fromCelsius(toCelsius(v, from), to));
    return trim((v * cat.units[from].toBase) / cat.units[to].toBase);
  }, [value, from, to, cat]);

  const changeCat = (key: string) => {
    const c = CATS.find((x) => x.key === key)!;
    const ks = Object.keys(c.units);
    setCatKey(key);
    setFrom(ks[0]);
    setTo(ks[1]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => changeCat(c.key)}
            className="rounded-full px-3 py-1.5 text-sm font-medium"
            style={{ background: catKey === c.key ? "var(--brand)" : "var(--surface-2)", color: catKey === c.key ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="card grid gap-3 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <label className="label">From</label>
          <input type="number" className="input mb-2" value={value} onChange={(e) => setValue(e.target.value)} />
          <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
            {unitKeys.map((k) => (
              <option key={k} value={k}>{cat.units[k].name}</option>
            ))}
          </select>
        </div>

        <button aria-label="Swap units" className="btn btn-secondary h-10 self-center sm:mb-1" onClick={swap}>⇄</button>

        <div>
          <label className="label">To</label>
          <div className="input mb-2 flex items-center font-semibold" style={{ background: "var(--surface-2)" }}>
            {result || "—"}
          </div>
          <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
            {unitKeys.map((k) => (
              <option key={k} value={k}>{cat.units[k].name}</option>
            ))}
          </select>
        </div>
      </div>

      {result && !isNaN(parseFloat(value)) && (
        <p className="text-center text-[var(--muted)]">
          {trim(parseFloat(value))} {cat.units[from].name} = <span className="font-semibold text-[var(--foreground)]">{result} {cat.units[to].name}</span>
        </p>
      )}
    </div>
  );
}
