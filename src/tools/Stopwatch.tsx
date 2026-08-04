"use client";

import { useEffect, useRef, useState } from "react";

function fmt(ms: number): { main: string; cs: string } {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  const main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  return { main, cs: pad(cs) };
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setElapsed(baseRef.current + (performance.now() - startRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  function start() {
    startRef.current = performance.now();
    setRunning(true);
  }
  function stop() {
    baseRef.current = elapsed;
    setRunning(false);
  }
  function reset() {
    setRunning(false);
    baseRef.current = 0;
    setElapsed(0);
    setLaps([]);
  }
  function lap() {
    setLaps((l) => [elapsed, ...l]);
  }

  const t = fmt(elapsed);

  return (
    <div className="space-y-4">
      <div className="card p-8 text-center">
        <div className="font-mono font-bold tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
          <span className="text-5xl sm:text-6xl">{t.main}</span>
          <span className="text-2xl text-[var(--muted)] sm:text-3xl">.{t.cs}</span>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {!running ? (
            <button className="btn btn-primary px-6" onClick={start}>
              {elapsed > 0 ? "Resume" : "Start"}
            </button>
          ) : (
            <button className="btn btn-primary px-6" onClick={stop}>
              Stop
            </button>
          )}
          <button className="btn btn-secondary px-5" onClick={lap} disabled={!running}>
            Lap
          </button>
          <button className="btn btn-secondary px-5" onClick={reset} disabled={elapsed === 0 && !running}>
            Reset
          </button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-3 border-b px-4 py-2.5 text-xs font-semibold text-[var(--muted)]">
            <span>Lap</span>
            <span>Split</span>
            <span className="text-right">Total</span>
          </div>
          <ul className="scroll-thin max-h-72 overflow-auto">
            {laps.map((total, i) => {
              const idx = laps.length - i;
              const prev = i < laps.length - 1 ? laps[i + 1] : 0;
              return (
                <li key={idx} className="grid grid-cols-3 px-4 py-2.5 text-sm tabular-nums odd:bg-[var(--surface-2)]">
                  <span className="font-medium">#{idx}</span>
                  <span className="font-mono">{fmt(total - prev).main}.{fmt(total - prev).cs}</span>
                  <span className="text-right font-mono">{fmt(total).main}.{fmt(total).cs}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
