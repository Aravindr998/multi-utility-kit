"use client";

import { useMemo, useState } from "react";
import {
  getTimeZones,
  localZone,
  offsetLabel,
  offsetMinutes,
  formatInZone,
  zoneLabel,
  zonedWallTimeToUTC,
} from "@/lib/timezones";

function nowParts() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    time: `${p(d.getHours())}:${p(d.getMinutes())}`,
  };
}

export default function TimeZoneConverter() {
  const zones = useMemo(() => getTimeZones(), []);
  const local = useMemo(() => localZone(), []);
  const init = useMemo(() => nowParts(), []);
  const [date, setDate] = useState(init.date);
  const [time, setTime] = useState(init.time);
  const [from, setFrom] = useState(local);
  const [to, setTo] = useState(local === "UTC" ? "America/New_York" : "UTC");

  const out = useMemo(() => {
    const [y, mo, d] = date.split("-").map(Number);
    const [h, mi] = time.split(":").map(Number);
    if (!y || !mo || !d || h == null || mi == null || isNaN(h) || isNaN(mi)) return null;
    const instant = new Date(zonedWallTimeToUTC(y, mo, d, h, mi, from));
    if (isNaN(instant.getTime())) return null;
    const diffMin = offsetMinutes(to, instant) - offsetMinutes(from, instant);
    return {
      instant,
      converted: formatInZone(instant, to, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      fromOffset: offsetLabel(from, instant),
      toOffset: offsetLabel(to, instant),
      diffMin,
    };
  }, [date, time, from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const diffLabel = (() => {
    if (!out) return "";
    const m = out.diffMin;
    if (m === 0) return "Same time";
    const sign = m > 0 ? "ahead" : "behind";
    const abs = Math.abs(m);
    const hh = Math.floor(abs / 60);
    const mm = abs % 60;
    return `${hh}h${mm ? ` ${mm}m` : ""} ${sign}`;
  })();

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="tzc-date">Date</label>
          <input id="tzc-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="tzc-time">Time</label>
          <input id="tzc-time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="tzc-from">From time zone</label>
          <ZoneSelect id="tzc-from" zones={zones} value={from} onChange={setFrom} refInstant={out?.instant} />
        </div>
        <div>
          <label className="label" htmlFor="tzc-to">To time zone</label>
          <ZoneSelect id="tzc-to" zones={zones} value={to} onChange={setTo} refInstant={out?.instant} />
        </div>
        <div className="sm:col-span-2">
          <button className="btn btn-secondary" onClick={swap}>⇅ Swap zones</button>
        </div>
      </div>

      {out && (
        <div className="card p-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            {zoneLabel(from)} · {out.fromOffset} → {zoneLabel(to)} · {out.toOffset}
          </p>
          <p className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: "var(--brand)" }}>
            {out.converted}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {zoneLabel(to)} is {diffLabel} of {zoneLabel(from)}
          </p>
        </div>
      )}
    </div>
  );
}

function ZoneSelect({
  id,
  zones,
  value,
  onChange,
  refInstant,
}: {
  id: string;
  zones: string[];
  value: string;
  onChange: (v: string) => void;
  refInstant?: Date;
}) {
  const when = refInstant ?? new Date();
  return (
    <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      {zones.map((z) => (
        <option key={z} value={z}>
          {zoneLabel(z)} · {offsetLabel(z, when)}
        </option>
      ))}
    </select>
  );
}
