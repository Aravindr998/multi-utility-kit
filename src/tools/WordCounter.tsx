"use client";

import { useMemo, useState } from "react";

function fmtTime(totalSeconds: number): string {
  if (totalSeconds < 1) return "0 sec";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  if (m === 0) return `${s} sec`;
  return `${m} min${s ? ` ${s} sec` : ""}`;
}

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || []).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter((p) => p.trim()).length : 0;
    const lines = text ? text.split(/\n/).length : 0;
    const readingTime = fmtTime((words / 200) * 60);
    const speakingTime = fmtTime((words / 130) * 60);
    return { words, charsWithSpaces, charsNoSpaces, sentences, paragraphs, lines, readingTime, speakingTime };
  }, [text]);

  const cells: { label: string; value: string | number }[] = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.charsWithSpaces },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Reading time", value: stats.readingTime },
    { label: "Speaking time", value: stats.speakingTime },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cells.slice(0, 4).map((c) => (
          <Stat key={c.label} {...c} />
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here…"
        rows={12}
        className="input scroll-thin font-sans"
        style={{ resize: "vertical" }}
        aria-label="Text to analyze"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cells.slice(4).map((c) => (
          <Stat key={c.label} {...c} />
        ))}
      </div>

      <div className="flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(text)} disabled={!text}>
          Copy text
        </button>
        <button className="btn btn-secondary" onClick={() => setText("")} disabled={!text}>
          Clear
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-2xl font-bold" style={{ color: "var(--brand)" }}>{value}</div>
      <div className="mt-0.5 text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}
