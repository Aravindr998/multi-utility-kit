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
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [at, setAt] = useState(todayISO());

  const data = useMemo(() => {
    if (!dob) return null;
    const from = new Date(dob + "T00:00:00");
    const to = new Date(at + "T00:00:00");
    if (isNaN(from.getTime()) || isNaN(to.getTime()) || to < from) return null;

    const ymd = diffYMD(from, to);
    const msPerDay = 86400000;
    const totalDays = Math.floor((to.getTime() - from.getTime()) / msPerDay);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = ymd.years * 12 + ymd.months;

    // Next birthday
    let nextBday = new Date(to.getFullYear(), from.getMonth(), from.getDate());
    if (nextBday < to) nextBday = new Date(to.getFullYear() + 1, from.getMonth(), from.getDate());
    const daysToBday = Math.ceil((nextBday.getTime() - to.getTime()) / msPerDay);

    return { ymd, totalDays, totalWeeks, totalMonths, daysToBday };
  }, [dob, at]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="dob">Date of birth</label>
          <DateField id="dob" value={dob} max={at} onChange={setDob} />
        </div>
        <div>
          <label className="label" htmlFor="at">Age at date</label>
          <DateField id="at" value={at} min={dob} onChange={setAt} />
        </div>
      </div>

      {!dob && <p className="text-center text-[var(--muted)]">Enter your date of birth to calculate your age.</p>}

      {dob && !data && (
        <p className="rounded-lg p-3 text-center text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>
          Please check the dates — the birth date must be on or before the “age at” date.
        </p>
      )}

      {data && (
        <>
          <div className="card p-6 text-center">
            <p className="text-sm text-[var(--muted)]">Your age is</p>
            <p className="mt-1 text-3xl font-bold" style={{ color: "var(--brand)" }}>
              {data.ymd.years} <span className="text-lg font-medium">years</span> {data.ymd.months} <span className="text-lg font-medium">months</span> {data.ymd.days} <span className="text-lg font-medium">days</span>
            </p>
            {data.daysToBday > 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">🎂 {data.daysToBday} day{data.daysToBday === 1 ? "" : "s"} until your next birthday</p>
            ) : (
              <p className="mt-2 text-sm font-medium" style={{ color: "var(--success)" }}>🎉 Happy birthday!</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total months" value={data.totalMonths.toLocaleString()} />
            <Stat label="Total weeks" value={data.totalWeeks.toLocaleString()} />
            <Stat label="Total days" value={data.totalDays.toLocaleString()} />
            <Stat label="Total hours" value={(data.totalDays * 24).toLocaleString()} />
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
