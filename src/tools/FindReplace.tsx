"use client";

import { useMemo, useState } from "react";
import { Toggle } from "@/components/textControls";

export default function FindReplace() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [repl, setRepl] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regex, setRegex] = useState(false);
  const [copied, setCopied] = useState(false);

  const { output, matches, error } = useMemo(() => {
    if (!find) return { output: input, matches: 0, error: "" };
    try {
      let pattern = regex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (wholeWord) pattern = `\\b(?:${pattern})\\b`;
      const re = new RegExp(pattern, "g" + (ignoreCase ? "i" : ""));
      const matches = (input.match(re) || []).length;
      const replacement = regex ? repl : repl.replace(/\$/g, "$$$$");
      return { output: input.replace(re, replacement), matches, error: "" };
    } catch (e) {
      return { output: input, matches: 0, error: (e as Error).message };
    }
  }, [input, find, repl, ignoreCase, wholeWord, regex]);

  function copy() {
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fr-find">Find</label>
            <input
              id="fr-find"
              className="input font-mono"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder={regex ? "pattern (e.g. \\d+)" : "text to find"}
            />
          </div>
          <div>
            <label className="label" htmlFor="fr-repl">Replace with</label>
            <input
              id="fr-repl"
              className="input font-mono"
              value={repl}
              onChange={(e) => setRepl(e.target.value)}
              placeholder={regex ? "replacement (use $1 for groups)" : "replacement"}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Toggle checked={ignoreCase} onChange={setIgnoreCase} label="Ignore case" />
          <Toggle checked={wholeWord} onChange={setWholeWord} label="Whole word" />
          <Toggle checked={regex} onChange={setRegex} label="Regex" />
        </div>
        {error ? (
          <p className="text-sm" style={{ color: "var(--danger)" }}>Invalid regex: {error}</p>
        ) : (
          find && (
            <p className="text-sm text-[var(--muted)]">
              {matches.toLocaleString()} match{matches === 1 ? "" : "es"} {matches > 0 ? "replaced" : "found"}
            </p>
          )
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card flex flex-col p-4">
          <span className="mb-2 text-sm font-semibold">Input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here…"
            spellCheck={false}
            className="input scroll-thin min-h-[240px] flex-1 resize-y leading-relaxed"
          />
        </div>
        <div className="card flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Result</span>
            <button
              onClick={copy}
              disabled={!output}
              className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] disabled:opacity-40"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            placeholder="Result appears here…"
            className="input scroll-thin min-h-[240px] flex-1 resize-y leading-relaxed"
            style={{ background: "var(--surface-2)" }}
          />
        </div>
      </div>
    </div>
  );
}
