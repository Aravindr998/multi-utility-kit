"use client";

import { Fragment, useMemo, useState } from "react";

const FLAGS = [
  { f: "g", label: "global" },
  { f: "i", label: "ignore case" },
  { f: "m", label: "multiline" },
  { f: "s", label: "dotall" },
  { f: "u", label: "unicode" },
  { f: "y", label: "sticky" },
] as const;

type Match = { index: number; text: string; groups: string[] };

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b(\\w+)@(\\w+)\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact ada@example.com or grace@navy.mil for details.");

  const { error, matches, re } = useMemo(() => {
    if (!pattern) return { error: null as string | null, matches: [] as Match[], re: null as RegExp | null };
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid regular expression", matches: [], re: null };
    }
    const found: Match[] = [];
    if (flags.includes("g") || flags.includes("y")) {
      let m: RegExpExecArray | null;
      let guard = 0;
      while ((m = regex.exec(text)) !== null && guard++ < 10000) {
        found.push({ index: m.index, text: m[0], groups: m.slice(1).map((g) => g ?? "") });
        if (m[0] === "") regex.lastIndex++;
      }
    } else {
      const m = regex.exec(text);
      if (m) found.push({ index: m.index, text: m[0], groups: m.slice(1).map((g) => g ?? "") });
    }
    return { error: null, matches: found, re: regex };
  }, [pattern, flags, text]);

  const toggleFlag = (f: string) =>
    setFlags((prev) => (prev.includes(f) ? prev.replace(f, "") : prev + f));

  // Build highlighted segments from match ranges.
  const highlighted = useMemo(() => {
    if (error || !matches.length) return null;
    const parts: { text: string; hit: boolean }[] = [];
    let last = 0;
    for (const m of matches) {
      if (m.index > last) parts.push({ text: text.slice(last, m.index), hit: false });
      parts.push({ text: text.slice(m.index, m.index + m.text.length), hit: true });
      last = m.index + m.text.length;
    }
    if (last < text.length) parts.push({ text: text.slice(last), hit: false });
    return parts;
  }, [matches, text, error]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">Regular expression</label>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[var(--muted)]">/</span>
          <input className="input flex-1" value={pattern} onChange={(e) => setPattern(e.target.value)} spellCheck={false} placeholder="pattern" />
          <span className="text-[var(--muted)]">/{flags}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {FLAGS.map(({ f, label }) => {
            const on = flags.includes(f);
            return (
              <button key={f} onClick={() => toggleFlag(f)} title={label}
                className="rounded-md px-2.5 py-1 font-mono text-sm"
                style={{ background: on ? "var(--brand)" : "var(--surface-2)", color: on ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card flex flex-col p-4">
        <label className="label">Test string</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false}
          className="input scroll-thin min-h-[140px] resize-y font-mono leading-relaxed" placeholder="Text to search…" />
      </div>

      {error ? (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>
          ✗ {error}
        </p>
      ) : (
        <div className="card p-4">
          <p className="mb-3 text-sm font-semibold">
            {matches.length} {matches.length === 1 ? "match" : "matches"}
          </p>
          {highlighted && (
            <div className="scroll-thin mb-4 max-h-52 overflow-auto whitespace-pre-wrap rounded-lg p-3 font-mono text-sm leading-relaxed" style={{ background: "var(--surface-2)" }}>
              {highlighted.map((p, i) =>
                p.hit ? (
                  <mark key={i} style={{ background: "var(--brand)", color: "var(--on-brand)", borderRadius: "3px", padding: "0 1px" }}>{p.text}</mark>
                ) : (
                  <Fragment key={i}>{p.text}</Fragment>
                ),
              )}
            </div>
          )}
          {matches.length > 0 && re && re.source && (
            <div className="scroll-thin max-h-64 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-[var(--muted)]">
                  <tr>
                    <th className="py-1 pr-3">#</th>
                    <th className="py-1 pr-3">Match</th>
                    <th className="py-1">Groups</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {matches.map((m, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="py-1 pr-3 text-[var(--muted)]">{i + 1}</td>
                      <td className="py-1 pr-3">{m.text}</td>
                      <td className="py-1 text-[var(--muted)]">{m.groups.length ? m.groups.map((g, gi) => `$${gi + 1}=${g}`).join("  ") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
