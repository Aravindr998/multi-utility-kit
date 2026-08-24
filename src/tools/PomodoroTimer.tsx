"use client";

import { useEffect, useRef, useState } from "react";
import { playAlarm, primeAudio } from "@/lib/sound";

// ---------------------------------------------------------------------------
// Pomodoro Timer — focus / short-break / long-break cycles with a chime.
// A long break follows every `roundsBeforeLongBreak` focus sessions.
// ---------------------------------------------------------------------------

type Mode = "focus" | "short" | "long";

const MODE_META: Record<Mode, { label: string; blurb: string }> = {
  focus: { label: "Focus", blurb: "Time to concentrate." },
  short: { label: "Short Break", blurb: "Stretch and relax for a moment." },
  long: { label: "Long Break", blurb: "Great work — take a longer rest." },
};

const ROUNDS_BEFORE_LONG = 4;

function fmt(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  // Durations in minutes (user-editable).
  const [focusMin, setFocusMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);

  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(focusMin * 60 * 1000);
  const [completed, setCompleted] = useState(0); // finished focus sessions
  const endRef = useRef(0);

  const durationFor = (m: Mode) =>
    (m === "focus" ? focusMin : m === "short" ? shortMin : longMin) * 60 * 1000;

  // Update a mode's duration; when idle and editing the active mode, keep the
  // displayed countdown in sync (done here, not in an effect, to avoid a
  // cascading render).
  function changeDuration(m: Mode, minutes: number) {
    if (m === "focus") setFocusMin(minutes);
    else if (m === "short") setShortMin(minutes);
    else setLongMin(minutes);
    if (!running && m === mode) setRemaining(minutes * 60 * 1000);
  }

  // Advance to the next mode in the Pomodoro cycle.
  function advance(fromAuto: boolean) {
    setRunning(false);
    if (mode === "focus") {
      const done = completed + 1;
      setCompleted(done);
      const next: Mode = done % ROUNDS_BEFORE_LONG === 0 ? "long" : "short";
      switchTo(next);
    } else {
      switchTo("focus");
    }
    if (fromAuto) playAlarm(4);
  }

  function switchTo(m: Mode) {
    setMode(m);
    setRunning(false);
    setRemaining(durationFor(m));
  }

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = endRef.current - Date.now();
      if (left <= 0) {
        setRemaining(0);
        advance(true);
      } else {
        setRemaining(left);
      }
    }, 200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function start() {
    primeAudio();
    endRef.current = Date.now() + remaining;
    setRunning(true);
  }
  function pause() {
    setRemaining(endRef.current - Date.now());
    setRunning(false);
  }
  function reset() {
    setRunning(false);
    setRemaining(durationFor(mode));
  }

  const total = durationFor(mode);
  const progress = total > 0 ? 1 - remaining / total : 0;
  const meta = MODE_META[mode];

  return (
    <div className="space-y-4">
      {/* Mode switch */}
      <div className="flex justify-center gap-2">
        {(Object.keys(MODE_META) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchTo(m)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium"
            style={
              mode === m
                ? { background: "var(--brand)", color: "var(--on-brand)" }
                : { color: "var(--muted)", border: "1px solid var(--border)" }
            }
          >
            {MODE_META[m].label}
          </button>
        ))}
      </div>

      {/* Timer */}
      <div className="card p-8 text-center">
        <div
          className="mx-auto grid aspect-square w-56 place-items-center rounded-full sm:w-64"
          style={{
            background: `conic-gradient(var(--brand) ${progress * 360}deg, var(--surface-2) 0deg)`,
          }}
        >
          <div
            className="grid aspect-square w-[85%] place-items-center rounded-full"
            style={{ background: "var(--background)" }}
          >
            <div>
              <div className="font-mono text-5xl font-bold tabular-nums sm:text-6xl">
                {fmt(remaining)}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
                {meta.label}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-[var(--muted)]">{meta.blurb}</p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {running ? (
            <button className="btn btn-primary px-8" onClick={pause}>
              Pause
            </button>
          ) : (
            <button className="btn btn-primary px-8" onClick={start} disabled={remaining <= 0}>
              Start
            </button>
          )}
          <button className="btn btn-secondary px-5" onClick={reset}>
            Reset
          </button>
          <button className="btn btn-secondary px-5" onClick={() => advance(false)} title="Skip to next interval">
            Skip
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: ROUNDS_BEFORE_LONG }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background:
                  i < completed % ROUNDS_BEFORE_LONG || (completed > 0 && completed % ROUNDS_BEFORE_LONG === 0 && mode === "long")
                    ? "var(--brand)"
                    : "var(--surface-2)",
              }}
            />
          ))}
          <span className="ml-2 text-xs text-[var(--muted)]">
            {completed} completed
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="card p-4 sm:p-5">
        <div className="mb-3 text-sm font-semibold">Durations (minutes)</div>
        <div className="grid grid-cols-3 gap-3">
          <Setting label="Focus" value={focusMin} onChange={(n) => changeDuration("focus", n)} />
          <Setting label="Short break" value={shortMin} onChange={(n) => changeDuration("short", n)} />
          <Setting label="Long break" value={longMin} onChange={(n) => changeDuration("long", n)} />
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          A long break follows every {ROUNDS_BEFORE_LONG} focus sessions. Changing a
          duration resets the current interval.
        </p>
      </div>
    </div>
  );
}

function Setting({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex flex-col">
      <span className="mb-1 text-xs text-[var(--muted)]">{label}</span>
      <input
        type="number"
        min={1}
        max={180}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange(isFinite(n) && n > 0 ? Math.min(180, n) : 1);
        }}
        className="input text-center font-semibold"
      />
    </label>
  );
}
