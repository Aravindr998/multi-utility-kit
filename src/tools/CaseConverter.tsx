"use client";

import { useState } from "react";

const toTitle = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const toSentence = (s: string) =>
  s
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

const words = (s: string) =>
  s
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const toCamel = (s: string) =>
  words(s)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join("");

const toSnake = (s: string) => words(s).map((w) => w.toLowerCase()).join("_");
const toKebab = (s: string) => words(s).map((w) => w.toLowerCase()).join("-");

const CASES: { label: string; fn: (s: string) => string }[] = [
  { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { label: "lowercase", fn: (s) => s.toLowerCase() },
  { label: "Title Case", fn: toTitle },
  { label: "Sentence case", fn: toSentence },
  { label: "camelCase", fn: toCamel },
  { label: "snake_case", fn: toSnake },
  { label: "kebab-case", fn: toKebab },
];

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const apply = (fn: (s: string) => string) => setText(fn(text));

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied("Copied!");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text…"
        rows={8}
        className="input scroll-thin"
        style={{ resize: "vertical" }}
        aria-label="Text to convert"
      />

      <div className="flex flex-wrap gap-2">
        {CASES.map((c) => (
          <button
            key={c.label}
            onClick={() => apply(c.fn)}
            className="rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button className="btn btn-primary" onClick={copy} disabled={!text}>
          {copied || "Copy result"}
        </button>
        <button className="btn btn-secondary" onClick={() => setText("")} disabled={!text}>
          Clear
        </button>
        <span className="text-sm text-[var(--muted)]">{text.length} chars</span>
      </div>
    </div>
  );
}
