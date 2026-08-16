// Standard 5-field cron parsing: description + next run times.
// Fields: minute hour day-of-month month day-of-week

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Field = { values: Set<number>; star: boolean };

const RANGES: [number, number][] = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 6]];

function parseField(spec: string, min: number, max: number, dow = false): Field {
  const star = spec === "*" || spec === "*/1";
  const values = new Set<number>();
  for (const part of spec.split(",")) {
    const [rangePart, stepPart] = part.split("/");
    const step = stepPart ? parseInt(stepPart, 10) : 1;
    if (!isFinite(step) || step < 1) throw new Error(`Invalid step in "${part}"`);
    let lo = min, hi = max;
    if (rangePart !== "*" && rangePart !== "") {
      const [a, b] = rangePart.split("-");
      lo = parseInt(a, 10);
      hi = b !== undefined ? parseInt(b, 10) : (stepPart ? max : lo);
      if (dow && lo === 7) lo = 0;
      if (dow && hi === 7) hi = 0;
      if (isNaN(lo) || isNaN(hi)) throw new Error(`Invalid range in "${part}"`);
    }
    for (let v = lo; v <= hi; v += step) {
      const val = dow && v === 7 ? 0 : v;
      if (val < min || val > max) throw new Error(`Value ${val} out of range (${min}-${max})`);
      values.add(val);
    }
  }
  return { values, star };
}

export type ParsedCron = { fields: Field[]; parts: string[] };

export function parseCron(expr: string): ParsedCron {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error("A cron expression needs exactly 5 fields (minute hour day month weekday).");
  const fields = parts.map((p, i) => parseField(p, RANGES[i][0], RANGES[i][1], i === 4));
  return { fields, parts };
}

export function describeCron(expr: string): string {
  const { fields, parts } = parseCron(expr);
  const [min, hour, dom, mon, dow] = fields;
  const seg: string[] = [];

  // Time of day
  if (min.star && hour.star) seg.push("Every minute");
  else if (parts[0].startsWith("*/") && hour.star) seg.push(`Every ${parts[0].slice(2)} minutes`);
  else if (min.values.size === 1 && hour.star) seg.push(`At minute ${[...min.values][0]} of every hour`);
  else if (min.values.size === 1 && hour.values.size === 1) {
    const h = [...hour.values][0], m = [...min.values][0];
    seg.push(`At ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  } else seg.push(`At minute(s) ${[...min.values].join(", ")} past hour(s) ${hour.star ? "every" : [...hour.values].join(", ")}`);

  // Day of week
  if (!dow.star) seg.push(`on ${[...dow.values].sort().map((d) => DAYS[d]).join(", ")}`);
  // Day of month
  if (!dom.star) seg.push(`on day-of-month ${[...dom.values].sort((a, b) => a - b).join(", ")}`);
  // Month
  if (!mon.star) seg.push(`in ${[...mon.values].sort((a, b) => a - b).map((m) => MONTHS[m - 1]).join(", ")}`);

  return seg.join(" ");
}

export function nextRuns(expr: string, count = 5, from = new Date()): Date[] {
  const { fields } = parseCron(expr);
  const [min, hour, dom, mon, dow] = fields;
  const out: Date[] = [];
  const d = new Date(from.getTime());
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const limit = 366 * 24 * 60; // scan up to a year of minutes
  let steps = 0;
  while (out.length < count && steps++ < limit) {
    const matchMonth = mon.values.has(d.getMonth() + 1);
    const matchMin = min.values.has(d.getMinutes());
    const matchHour = hour.values.has(d.getHours());
    // dom/dow OR-semantics when both restricted
    const domR = !dom.star, dowR = !dow.star;
    const matchDom = dom.values.has(d.getDate());
    const matchDow = dow.values.has(d.getDay());
    const matchDay = domR && dowR ? matchDom || matchDow : (domR ? matchDom : true) && (dowR ? matchDow : true);
    if (matchMonth && matchDay && matchHour && matchMin) out.push(new Date(d.getTime()));
    d.setMinutes(d.getMinutes() + 1);
  }
  return out;
}
