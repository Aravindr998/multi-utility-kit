"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getTimeZones,
  localZone,
  offsetLabel,
  formatInZone,
  zoneLabel,
} from "@/lib/timezones";

const KEY = "utilityhub:worldclock:v1";

export default function WorldClock() {
  const zones = useMemo(() => getTimeZones(), []);
  const [clocks, setClocks] = useState<string[]>([]);
  const [now, setNow] = useState(() => new Date());
  const [sel, setSel] = useState("");
  const local = useMemo(() => localZone(), []);

  useEffect(() => {
    let init: string[] = [];
    try {
      const s = localStorage.getItem(KEY);
      if (s) init = JSON.parse(s);
    } catch {}
    if (!Array.isArray(init) || init.length === 0) {
      init = [local, "America/New_York", "Europe/London", "Asia/Tokyo"].filter(
        (z, i, a) => a.indexOf(z) === i,
      );
    }
    setClocks(init);
  }, [local]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  function persist(next: string[]) {
    setClocks(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }
  function add() {
    if (sel && !clocks.includes(sel)) persist([...clocks, sel]);
    setSel("");
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="label" htmlFor="tz-add">Add a city / time zone</label>
          <select
            id="tz-add"
            className="input"
            value={sel}
            onChange={(e) => setSel(e.target.value)}
          >
            <option value="">Select a time zone…</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {zoneLabel(z)} · {offsetLabel(z, now)}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={add} disabled={!sel}>
          Add clock
        </button>
      </div>

      {clocks.length === 0 ? (
        <p className="text-center text-[var(--muted)]">No clocks yet — add a time zone above.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {clocks.map((z) => (
            <div key={z} className="card flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{zoneLabel(z)}</span>
                  {z === local && (
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{ background: "var(--brand-soft)", color: "var(--muted)" }}
                    >
                      Local
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-[var(--muted)]">
                  {formatInZone(now, z, { weekday: "short", month: "short", day: "numeric" })} ·{" "}
                  {offsetLabel(z, now)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-semibold tabular-nums">
                  {formatInZone(now, z, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </span>
                <button
                  onClick={() => persist(clocks.filter((c) => c !== z))}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
                  aria-label={`Remove ${zoneLabel(z)}`}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
