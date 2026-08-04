"use client";

import { useEffect, useRef, useState } from "react";
import { playAlarm, primeAudio } from "@/lib/sound";

type Phase = "idle" | "running" | "paused" | "done";

function fmtDur(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor(s / 60) % 60;
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}

const PRESETS = [
  { label: "1 min", s: 60 },
  { label: "5 min", s: 300 },
  { label: "10 min", s: 600 },
  { label: "25 min", s: 1500 },
];

export default function Timer() {
  const [h, setH] = useState("0");
  const [m, setM] = useState("5");
  const [s, setS] = useState("0");
  const [phase, setPhase] = useState<Phase>("idle");
  const [remaining, setRemaining] = useState(0);
  const endRef = useRef(0);

  const configuredMs =
    ((parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0)) * 1000;

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      const left = endRef.current - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setPhase("done");
        playAlarm(4);
      } else {
        setRemaining(left);
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase]);

  function start() {
    const dur = phase === "paused" ? remaining : configuredMs;
    if (dur <= 0) return;
    primeAudio();
    endRef.current = Date.now() + dur;
    setRemaining(dur);
    setPhase("running");
  }
  function pause() {
    setRemaining(endRef.current - Date.now());
    setPhase("paused");
  }
  function reset() {
    setPhase("idle");
    setRemaining(0);
  }
  function setPreset(sec: number) {
    setH(String(Math.floor(sec / 3600)));
    setM(String(Math.floor(sec / 60) % 60));
    setS(String(sec % 60));
    setPhase("idle");
  }

  const display = phase === "idle" ? configuredMs : remaining;

  return (
    <div className="space-y-4">
      {phase === "done" && (
        <div
          className="flex items-center justify-between gap-3 rounded-lg p-4"
          style={{ background: "color-mix(in srgb, var(--success) 15%, transparent)", color: "var(--foreground)" }}
        >
          <span className="font-semibold">⏰ Time&apos;s up!</span>
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={() => playAlarm(4)}>Ring again</button>
            <button className="btn btn-primary" onClick={reset}>Dismiss</button>
          </div>
        </div>
      )}

      <div className="card p-8 text-center">
        <div className="font-mono text-6xl font-bold tabular-nums sm:text-7xl">
          {fmtDur(display)}
        </div>

        {phase === "idle" && (
          <>
            <div className="mt-6 flex items-end justify-center gap-2">
              <Field label="Hours" value={h} onChange={setH} max={99} />
              <span className="pb-2.5 text-2xl text-[var(--muted)]">:</span>
              <Field label="Minutes" value={m} onChange={setM} max={59} />
              <span className="pb-2.5 text-2xl text-[var(--muted)]">:</span>
              <Field label="Seconds" value={s} onChange={setS} max={59} />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {PRESETS.map((p) => (
                <button key={p.label} className="btn btn-secondary px-3 py-1.5 text-xs" onClick={() => setPreset(p.s)}>
                  {p.label}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {phase === "running" ? (
            <button className="btn btn-primary px-6" onClick={pause}>Pause</button>
          ) : (
            <button className="btn btn-primary px-6" onClick={start} disabled={phase === "idle" && configuredMs <= 0}>
              {phase === "paused" ? "Resume" : "Start"}
            </button>
          )}
          {phase !== "idle" && (
            <button className="btn btn-secondary px-5" onClick={reset}>Reset</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
}) {
  return (
    <label className="flex flex-col items-center">
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input w-20 text-center text-lg font-semibold"
        aria-label={label}
      />
      <span className="mt-1 text-xs text-[var(--muted)]">{label}</span>
    </label>
  );
}
