"use client";

import { useMemo, useState } from "react";
import DateField from "@/components/DateField";

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayISO() {
  return toISO(new Date());
}

// Display order Mon…Sun, mapped to JS getDay() indices (0=Sun).
const DAYS: { idx: number; label: string }[] = [
  { idx: 1, label: "Mon" },
  { idx: 2, label: "Tue" },
  { idx: 3, label: "Wed" },
  { idx: 4, label: "Thu" },
  { idx: 5, label: "Fri" },
  { idx: 6, label: "Sat" },
  { idx: 0, label: "Sun" },
];

const MAX_DAYS = 200000;

export default function WorkingDays() {
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState("");
  const [weekend, setWeekend] = useState<Set<number>>(() => new Set([0, 6]));
  const [holidays, setHolidays] = useState<string[]>([]);
  const [holInput, setHolInput] = useState("");

  const result = useMemo(() => {
    if (!start || !end) return null;
    let from = new Date(start + "T00:00:00");
    let to = new Date(end + "T00:00:00");
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
    if (to < from) [from, to] = [to, from];

    const totalDays = Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
    if (totalDays > MAX_DAYS) return { tooLarge: true } as const;

    const holSet = new Set(holidays);
    let work = 0;
    let weekendCount = 0;
    let holCount = 0;
    const d = new Date(from);
    while (d <= to) {
      const dow = d.getDay();
      if (weekend.has(dow)) weekendCount++;
      else if (holSet.has(toISO(d))) holCount++;
      else work++;
      d.setDate(d.getDate() + 1);
    }
    return { tooLarge: false as const, totalDays, work, weekendCount, holCount };
  }, [start, end, weekend, holidays]);

  function toggleDay(idx: number) {
    setWeekend((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }
  function addHoliday() {
    if (holInput && !holidays.includes(holInput)) {
      setHolidays((h) => [...h, holInput].sort());
    }
    setHolInput("");
  }

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="wd-start">Start date</label>
          <DateField id="wd-start" value={start} onChange={setStart} />
        </div>
        <div>
          <label className="label" htmlFor="wd-end">End date</label>
          <DateField id="wd-end" value={end} onChange={setEnd} />
        </div>

        <div className="sm:col-span-2">
          <span className="label">Weekend days (excluded)</span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const on = weekend.has(d.idx);
              return (
                <button
                  key={d.idx}
                  onClick={() => toggleDay(d.idx)}
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    background: on ? "var(--brand)" : "var(--surface-2)",
                    color: on ? "var(--on-brand)" : "var(--foreground)",
                    border: "1px solid var(--border)",
                  }}
                  aria-pressed={on}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:col-span-2">
          <span className="label">Holidays to exclude (optional)</span>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1">
              <DateField id="wd-hol" value={holInput} onChange={setHolInput} placeholder="Pick a holiday" />
            </div>
            <button className="btn btn-secondary" onClick={addHoliday} disabled={!holInput}>
              Add holiday
            </button>
          </div>
          {holidays.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {holidays.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs"
                  style={{ background: "var(--surface-2)" }}
                >
                  {new Date(h + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  <button
                    onClick={() => setHolidays((prev) => prev.filter((x) => x !== h))}
                    className="text-[var(--muted)] hover:text-[var(--foreground)]"
                    aria-label="Remove holiday"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {!end && <p className="text-center text-[var(--muted)]">Pick both dates to count the working days.</p>}

      {result?.tooLarge && (
        <p className="rounded-lg p-3 text-center text-sm" style={{ background: "var(--surface-2)", color: "var(--muted)" }}>
          That range is too large to compute — please choose dates closer together.
        </p>
      )}

      {result && !result.tooLarge && (
        <>
          <div className="card p-6 text-center">
            <p className="text-sm text-[var(--muted)]">Working days</p>
            <p className="mt-1 text-4xl font-bold" style={{ color: "var(--brand)" }}>
              {result.work.toLocaleString()}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Calendar days" value={result.totalDays.toLocaleString()} />
            <Stat label="Weekend days" value={result.weekendCount.toLocaleString()} />
            <Stat label="Holidays" value={result.holCount.toLocaleString()} />
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}
