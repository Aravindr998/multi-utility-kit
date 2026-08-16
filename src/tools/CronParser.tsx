"use client";

import { useMemo, useState } from "react";

import { describeCron, nextRuns } from "@/lib/cron";

const FIELD_LABELS = ["Minute", "Hour", "Day of month", "Month", "Day of week"];

export default function CronParser() {
  const [expr, setExpr] = useState("*/15 9-17 * * 1-5");

  const result = useMemo(() => {
    if (!expr.trim()) return null;
    try {
      return { ok: true as const, desc: describeCron(expr), runs: nextRuns(expr, 6), parts: expr.trim().split(/\s+/) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid cron expression" };
    }
  }, [expr]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">Cron expression</label>
        <input className="input text-center font-mono text-lg tracking-wide" value={expr} onChange={(e) => setExpr(e.target.value)} spellCheck={false} placeholder="* * * * *" />
        {result?.ok && (
          <div className="mt-3 grid grid-cols-5 gap-2 text-center">
            {result.parts.map((p, i) => (
              <div key={i} className="rounded-md p-2" style={{ background: "var(--surface-2)" }}>
                <div className="font-mono text-sm font-semibold">{p}</div>
                <div className="text-[10px] text-[var(--muted)]">{FIELD_LABELS[i]}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {result?.ok ? (
        <>
          <div className="card p-4">
            <p className="text-xs font-semibold text-[var(--muted)]">MEANS</p>
            <p className="mt-1 text-lg font-medium">{result.desc}</p>
          </div>
          <div className="card p-4">
            <p className="mb-2 text-sm font-semibold">Next {result.runs.length} runs</p>
            <ul className="space-y-1 font-mono text-sm">
              {result.runs.map((d, i) => (
                <li key={i} className="rounded-md px-3 py-1.5" style={{ background: "var(--surface-2)" }}>
                  {d.toLocaleString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : result && !result.ok ? (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {result.error}</p>
      ) : null}
    </div>
  );
}
