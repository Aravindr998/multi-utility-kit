"use client";

import { useEffect, useMemo, useState } from "react";

function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function breakdown(ms: number) {
  const s = Math.floor(Math.abs(ms) / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor(s / 3600) % 24,
    minutes: Math.floor(s / 60) % 60,
    seconds: s % 60,
  };
}

export default function Countdown() {
  const [target, setTarget] = useState("");
  const [title, setTitle] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetMs = useMemo(() => {
    if (!target) return null;
    const t = new Date(target).getTime();
    return isNaN(t) ? null : t;
  }, [target]);

  function setNewYear() {
    const d = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0);
    setTarget(toLocalInput(d));
    if (!title) setTitle(`New Year ${d.getFullYear()}`);
  }
  function setInHours(hrs: number) {
    setTarget(toLocalInput(new Date(Date.now() + hrs * 3600000)));
  }

  const diff = targetMs != null ? targetMs - now : null;
  const past = diff != null && diff < 0;
  const b = diff != null ? breakdown(diff) : null;

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 sm:items-end">
        <div>
          <label className="label" htmlFor="cd-title">Event title (optional)</label>
          <input
            id="cd-title"
            className="input"
            placeholder="e.g. Product launch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="cd-target">Target date &amp; time</label>
          <input
            id="cd-target"
            type="datetime-local"
            className="input"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button className="btn btn-secondary px-3 py-1.5 text-xs" onClick={setNewYear}>New Year</button>
          <button className="btn btn-secondary px-3 py-1.5 text-xs" onClick={() => setInHours(1)}>In 1 hour</button>
          <button className="btn btn-secondary px-3 py-1.5 text-xs" onClick={() => setInHours(24)}>In 24 hours</button>
        </div>
      </div>

      {b == null ? (
        <p className="text-center text-[var(--muted)]">Pick a target date and time to start the countdown.</p>
      ) : (
        <div className="card p-6 text-center">
          {title && <p className="mb-1 text-lg font-semibold">{title}</p>}
          <p className="mb-5 text-sm text-[var(--muted)]">
            {past ? "That moment has passed —" : "Counting down to"}{" "}
            {new Date(targetMs!).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            <Unit value={b.days} label="Days" />
            <Unit value={b.hours} label="Hours" />
            <Unit value={b.minutes} label="Minutes" />
            <Unit value={b.seconds} label="Seconds" />
          </div>
          {past && (
            <p className="mt-4 text-sm font-medium" style={{ color: "var(--success)" }}>
              🎉 The event has arrived (and it was {b.days > 0 ? `${b.days}d ` : ""}{b.hours}h {b.minutes}m ago).
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl p-3 sm:p-4" style={{ background: "var(--surface-2)" }}>
      <div className="font-mono text-3xl font-bold tabular-nums sm:text-5xl">
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-[var(--muted)] sm:text-xs">
        {label}
      </div>
    </div>
  );
}
