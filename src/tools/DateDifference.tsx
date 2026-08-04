"use client";

import { useMemo, useState } from "react";
import DateField from "@/components/DateField";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function diffYMD(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export default function DateDifference() {
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);

  const data = useMemo(() => {
    if (!start || !end) return null;
    let from = new Date(start + "T00:00:00");
    let to = new Date(end + "T00:00:00");
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
    if (to < from) [from, to] = [to, from];

    const ymd = diffYMD(from, to);
    const msPerDay = 86400000;
    let totalDays = Math.round((to.getTime() - from.getTime()) / msPerDay);
    if (includeEnd) totalDays += 1;
    const totalMonths = ymd.years * 12 + ymd.months;

    return {
      ymd,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      remWeekDays: totalDays % 7,
      totalHours: totalDays * 24,
      totalMonths,
    };
  }, [start, end, includeEnd]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="dd-start">Start date</label>
          <DateField id="dd-start" value={start} onChange={setStart} />
        </div>
        <div>
          <label className="label" htmlFor="dd-end">End date</label>
          <DateField id="dd-end" value={end} onChange={setEnd} />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)] sm:col-span-2">
          <input
            type="checkbox"
            checked={includeEnd}
            onChange={(e) => setIncludeEnd(e.target.checked)}
            className="accent-[var(--brand)]"
          />
          Include the end date in the total-days count
        </label>
      </div>

      {!end && <p className="text-center text-[var(--muted)]">Pick both dates to see the difference.</p>}

      {data && (
        <>
          <div className="card p-6 text-center">
            <p className="text-sm text-[var(--muted)]">Difference</p>
            <p className="mt-1 text-3xl font-bold" style={{ color: "var(--brand)" }}>
              {data.ymd.years} <span className="text-lg font-medium">yr</span>{" "}
              {data.ymd.months} <span className="text-lg font-medium">mo</span>{" "}
              {data.ymd.days} <span className="text-lg font-medium">days</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total days" value={data.totalDays.toLocaleString()} />
            <Stat label="Total weeks" value={`${data.totalWeeks.toLocaleString()}${data.remWeekDays ? ` + ${data.remWeekDays}d` : ""}`} />
            <Stat label="Total months" value={data.totalMonths.toLocaleString()} />
            <Stat label="Total hours" value={data.totalHours.toLocaleString()} />
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
