"use client";

import { useMemo, useState } from "react";

type Unit = "s" | "ms";

function toDatetimeLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        });
      }}
      className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
      title="Copy"
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-sm">{value}</span>
        <CopyBtn text={value} />
      </span>
    </div>
  );
}

export default function UnixTimestamp() {
  const [unit, setUnit] = useState<Unit>("s");
  const [ts, setTs] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [dt, setDt] = useState(() => toDatetimeLocal(new Date()));

  const fromTs = useMemo(() => {
    const raw = ts.trim();
    if (!raw || !/^-?\d+$/.test(raw)) return null;
    const n = Number(raw);
    const ms = unit === "s" ? n * 1000 : n;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return d;
  }, [ts, unit]);

  const looksLikeMs = unit === "s" && /^\d{13,}$/.test(ts.trim());

  const fromDt = useMemo(() => {
    if (!dt) return null;
    const d = new Date(dt);
    if (isNaN(d.getTime())) return null;
    return d;
  }, [dt]);

  return (
    <div className="space-y-4">
      {/* Unit toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--muted)]">Timestamp unit:</span>
        {(["s", "ms"] as Unit[]).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: unit === u ? "var(--brand)" : "var(--surface-2)",
              color: unit === u ? "var(--on-brand)" : "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            {u === "s" ? "Seconds" : "Milliseconds"}
          </button>
        ))}
      </div>

      {/* Timestamp → Date */}
      <div className="card p-5">
        <h3 className="mb-3 font-semibold">Timestamp → Date</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="input font-mono"
            inputMode="numeric"
            value={ts}
            onChange={(e) => setTs(e.target.value)}
            placeholder={unit === "s" ? "e.g. 1700000000" : "e.g. 1700000000000"}
            aria-label="Unix timestamp"
          />
          <button
            className="btn btn-secondary shrink-0"
            onClick={() => setTs(String(unit === "s" ? Math.floor(Date.now() / 1000) : Date.now()))}
          >
            Now
          </button>
        </div>
        {looksLikeMs && (
          <p className="mt-2 text-xs" style={{ color: "var(--warning)" }}>
            That looks like milliseconds — switch the unit above for a correct date.
          </p>
        )}
        <div className="mt-4">
          {fromTs ? (
            <>
              <Row label="Local time" value={fromTs.toLocaleString(undefined, { dateStyle: "full", timeStyle: "medium" })} />
              <Row label="UTC" value={fromTs.toUTCString()} />
              <Row label="ISO 8601" value={fromTs.toISOString()} />
              <Row label="Relative" value={relative(fromTs)} />
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">Enter a whole number to see the date.</p>
          )}
        </div>
      </div>

      {/* Date → Timestamp */}
      <div className="card p-5">
        <h3 className="mb-3 font-semibold">Date → Timestamp</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="datetime-local"
            step={1}
            className="input"
            value={dt}
            onChange={(e) => setDt(e.target.value)}
            aria-label="Date and time"
          />
          <button className="btn btn-secondary shrink-0" onClick={() => setDt(toDatetimeLocal(new Date()))}>
            Now
          </button>
        </div>
        <div className="mt-4">
          {fromDt ? (
            <>
              <Row label="Unix (seconds)" value={String(Math.floor(fromDt.getTime() / 1000))} />
              <Row label="Unix (milliseconds)" value={String(fromDt.getTime())} />
              <Row label="ISO 8601" value={fromDt.toISOString()} />
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">Pick a date and time.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function relative(d: Date): string {
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [31536000000, "year"],
    [2592000000, "month"],
    [86400000, "day"],
    [3600000, "hour"],
    [60000, "minute"],
    [1000, "second"],
  ];
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [ms, unit] of units) {
    if (abs >= ms || unit === "second") {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }
  return "now";
}
