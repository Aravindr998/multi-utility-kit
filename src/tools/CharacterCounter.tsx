"use client";

import { useMemo, useState } from "react";

const LIMITS = [
  { label: "Twitter / X post", limit: 280 },
  { label: "SMS (single)", limit: 160 },
  { label: "Meta description", limit: 160 },
  { label: "Instagram caption", limit: 2200 },
];

export default function CharacterCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text === "" ? 0 : text.split("\n").length;
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const bytes = new TextEncoder().encode(text).length;
    return { chars, noSpaces, words, lines, sentences, paragraphs, bytes };
  }, [text]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          spellCheck={false}
          className="input scroll-thin min-h-[200px] resize-y leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Characters" value={stats.chars} primary />
        <Stat label="No spaces" value={stats.noSpaces} />
        <Stat label="Words" value={stats.words} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Bytes (UTF-8)" value={stats.bytes} />
      </div>

      <div className="card p-5">
        <h3 className="mb-3 text-sm font-semibold">Platform limits</h3>
        <div className="space-y-3">
          {LIMITS.map((l) => {
            const pctRaw = (stats.chars / l.limit) * 100;
            const pct = Math.min(100, pctRaw);
            const over = stats.chars > l.limit;
            return (
              <div key={l.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{l.label}</span>
                  <span style={{ color: over ? "var(--danger)" : "var(--muted)" }}>
                    {stats.chars} / {l.limit}
                    {over ? ` (${stats.chars - l.limit} over)` : ""}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: over ? "var(--danger)" : "var(--brand)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, primary }: { label: string; value: number; primary?: boolean }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl font-bold" style={primary ? { color: "var(--brand)" } : undefined}>
        {value.toLocaleString()}
      </div>
      <div className="mt-0.5 text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}
