"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { describeCron, nextRuns } from "@/lib/cron";

type Freq = "minutes" | "hourly" | "daily" | "weekly" | "monthly";
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CronGenerator() {
  const [freq, setFreq] = useState<Freq>("daily");
  const [everyN, setEveryN] = useState(15);
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(9);
  const [dom, setDom] = useState(1);
  const [weekdays, setWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);

  const expr = useMemo(() => {
    const m = Math.min(59, Math.max(0, minute));
    const h = Math.min(23, Math.max(0, hour));
    switch (freq) {
      case "minutes": return `*/${Math.min(59, Math.max(1, everyN))} * * * *`;
      case "hourly": return `${m} * * * *`;
      case "daily": return `${m} ${h} * * *`;
      case "weekly": return `${m} ${h} * * ${(weekdays.length ? [...weekdays].sort() : [1]).join(",")}`;
      case "monthly": return `${m} ${h} ${Math.min(31, Math.max(1, dom))} * *`;
    }
  }, [freq, everyN, minute, hour, dom, weekdays]);

  const preview = useMemo(() => {
    try { return { desc: describeCron(expr), runs: nextRuns(expr, 4) }; }
    catch { return null; }
  }, [expr]);

  const toggleDay = (d: number) => setWeekdays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">Run…</label>
        <div className="flex flex-wrap gap-2">
          {(["minutes", "hourly", "daily", "weekly", "monthly"] as Freq[]).map((f) => (
            <button key={f} onClick={() => setFreq(f)}
              className="rounded-md px-3 py-1.5 text-sm font-medium capitalize"
              style={{ background: freq === f ? "var(--brand)" : "var(--surface-2)", color: freq === f ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
              {f === "minutes" ? "Every N min" : f}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          {freq === "minutes" && (
            <Num label="Every (minutes)" value={everyN} set={setEveryN} min={1} max={59} />
          )}
          {freq === "hourly" && <Num label="At minute" value={minute} set={setMinute} min={0} max={59} />}
          {(freq === "daily" || freq === "weekly" || freq === "monthly") && (
            <>
              <Num label="Hour" value={hour} set={setHour} min={0} max={23} />
              <Num label="Minute" value={minute} set={setMinute} min={0} max={59} />
            </>
          )}
          {freq === "monthly" && <Num label="Day of month" value={dom} set={setDom} min={1} max={31} />}
        </div>

        {freq === "weekly" && (
          <div className="mt-4">
            <label className="label">On days</label>
            <div className="flex flex-wrap gap-2">
              {DOW.map((d, i) => (
                <button key={d} onClick={() => toggleDay(i)}
                  className="rounded-md px-3 py-1.5 text-sm font-medium"
                  style={{ background: weekdays.includes(i) ? "var(--brand)" : "var(--surface-2)", color: weekdays.includes(i) ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">Cron expression</span>
          <CopyButton value={expr} />
        </div>
        <p className="rounded-lg p-3 text-center font-mono text-xl tracking-wide" style={{ background: "var(--surface-2)" }}>{expr}</p>
        {preview && (
          <>
            <p className="mt-3 text-sm">{preview.desc}</p>
            <p className="mt-3 text-xs font-semibold text-[var(--muted)]">NEXT RUNS</p>
            <ul className="mt-1 space-y-1 font-mono text-sm text-[var(--muted)]">
              {preview.runs.map((d, i) => <li key={i}>{d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</li>)}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function Num({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" min={min} max={max} value={value} onChange={(e) => set(Number(e.target.value))} className="input w-28" />
    </div>
  );
}
