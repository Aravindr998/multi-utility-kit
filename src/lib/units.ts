// ---------------------------------------------------------------------------
// Unit conversion for the command bar.
// Factor tables mirror the Unit Converter tool (src/tools/UnitConverter.tsx)
// so inline results match the full tool. Adds a rich alias map so natural
// spellings ("centimeter", "inches", "kg", "°f") resolve to canonical units.
// ---------------------------------------------------------------------------

type Cat =
  | "length"
  | "weight"
  | "temperature"
  | "speed"
  | "area"
  | "volume"
  | "data"
  | "time";

// Linear factors to each category's base unit (temperature handled separately).
const FACTORS: Record<Exclude<Cat, "temperature">, Record<string, number>> = {
  length: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  weight: { mg: 0.001, g: 1, kg: 1000, t: 1_000_000, oz: 28.3495, lb: 453.592, st: 6350.29 },
  speed: { "m/s": 1, "km/h": 0.277778, mph: 0.44704, kn: 0.514444 },
  area: { cm2: 0.0001, m2: 1, km2: 1_000_000, ha: 10000, ft2: 0.092903, ac: 4046.86 },
  volume: { ml: 0.001, l: 1, m3: 1000, tsp: 0.00492892, tbsp: 0.0147868, cup: 0.236588, gal: 3.78541 },
  data: { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 },
  time: { ms: 0.001, s: 1, min: 60, h: 3600, d: 86400, wk: 604800 },
};

// Aliases (lowercased) → { cat, unit }. `unit` is the canonical key above.
const ALIASES: Record<string, { cat: Cat; unit: string }> = {};
const add = (cat: Cat, unit: string, names: string[]) => {
  for (const n of names) ALIASES[n.toLowerCase()] = { cat, unit };
};

add("length", "mm", ["mm", "millimeter", "millimeters", "millimetre", "millimetres"]);
add("length", "cm", ["cm", "centimeter", "centimeters", "centimetre", "centimetres"]);
add("length", "m", ["m", "meter", "meters", "metre", "metres"]);
add("length", "km", ["km", "kms", "kilometer", "kilometers", "kilometre", "kilometres"]);
add("length", "in", ["in", "inch", "inches", '"']);
add("length", "ft", ["ft", "foot", "feet", "'"]);
add("length", "yd", ["yd", "yard", "yards"]);
add("length", "mi", ["mi", "mile", "miles"]);

add("weight", "mg", ["mg", "milligram", "milligrams"]);
add("weight", "g", ["g", "gram", "grams", "gm"]);
add("weight", "kg", ["kg", "kgs", "kilogram", "kilograms", "kilo", "kilos"]);
add("weight", "t", ["t", "tonne", "tonnes", "ton", "tons"]);
add("weight", "oz", ["oz", "ounce", "ounces"]);
add("weight", "lb", ["lb", "lbs", "pound", "pounds"]);
add("weight", "st", ["st", "stone", "stones"]);

add("temperature", "C", ["c", "celsius", "centigrade", "°c"]);
add("temperature", "F", ["f", "fahrenheit", "°f"]);
add("temperature", "K", ["k", "kelvin"]);

add("speed", "m/s", ["m/s", "mps"]);
add("speed", "km/h", ["km/h", "kmh", "kph", "kmph"]);
add("speed", "mph", ["mph", "mi/h"]);
add("speed", "kn", ["kn", "knot", "knots"]);

add("area", "cm2", ["cm2", "cm²", "sqcm"]);
add("area", "m2", ["m2", "m²", "sqm"]);
add("area", "km2", ["km2", "km²", "sqkm"]);
add("area", "ha", ["ha", "hectare", "hectares"]);
add("area", "ft2", ["ft2", "ft²", "sqft"]);
add("area", "ac", ["ac", "acre", "acres"]);

add("volume", "ml", ["ml", "milliliter", "milliliters", "millilitre", "millilitres"]);
add("volume", "l", ["l", "liter", "liters", "litre", "litres"]);
add("volume", "m3", ["m3", "m³"]);
add("volume", "tsp", ["tsp", "teaspoon", "teaspoons"]);
add("volume", "tbsp", ["tbsp", "tablespoon", "tablespoons"]);
add("volume", "cup", ["cup", "cups"]);
add("volume", "gal", ["gal", "gallon", "gallons"]);

add("data", "B", ["b", "byte", "bytes"]);
add("data", "KB", ["kb", "kilobyte", "kilobytes"]);
add("data", "MB", ["mb", "megabyte", "megabytes"]);
add("data", "GB", ["gb", "gigabyte", "gigabytes"]);
add("data", "TB", ["tb", "terabyte", "terabytes"]);

add("time", "ms", ["ms", "millisecond", "milliseconds"]);
add("time", "s", ["s", "sec", "secs", "second", "seconds"]);
add("time", "min", ["min", "mins", "minute", "minutes"]);
add("time", "h", ["h", "hr", "hrs", "hour", "hours"]);
add("time", "d", ["d", "day", "days"]);
add("time", "wk", ["wk", "wks", "week", "weeks"]);

function toCelsius(v: number, from: string): number {
  if (from === "C") return v;
  if (from === "F") return (v - 32) * (5 / 9);
  return v - 273.15; // K
}
function fromCelsius(c: number, to: string): number {
  if (to === "C") return c;
  if (to === "F") return c * (9 / 5) + 32;
  return c + 273.15;
}

function format(n: number): string {
  if (!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(8)).toLocaleString(undefined, {
    maximumFractionDigits: 8,
  });
}

export type UnitQuery = {
  value: number;
  from: string; // canonical unit key
  to: string;
  cat: Cat;
  /** Formatted result including the target unit, e.g. "3.937 in". */
  result: string;
};

/**
 * Parse "10 cm to inch", "10cm to in", "72 f to c", "5 kg in lb", etc.
 * Returns null when it isn't a recognised same-category unit conversion.
 */
export function parseUnitQuery(input: string): UnitQuery | null {
  const text = input.trim().toLowerCase();
  // amount + fromToken  <connector>  toToken
  const m = text.match(
    /^([\d,]+(?:\.\d+)?)\s*([a-z°µ"'/²³]+)\s+(?:to|in|into|as|->|→|=)\s+([a-z°µ"'/²³]+)$/
  );
  if (!m) return null;

  const value = parseFloat(m[1].replace(/,/g, ""));
  if (!isFinite(value)) return null;

  const a = ALIASES[m[2]];
  const b = ALIASES[m[3]];
  if (!a || !b || a.cat !== b.cat) return null;

  let out: number;
  if (a.cat === "temperature") {
    out = fromCelsius(toCelsius(value, a.unit), b.unit);
  } else {
    const table = FACTORS[a.cat];
    out = (value * table[a.unit]) / table[b.unit];
  }

  return { value, from: a.unit, to: b.unit, cat: a.cat, result: `${format(out)} ${b.unit}` };
}
