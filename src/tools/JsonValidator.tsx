"use client";

import { useMemo, useState } from "react";

const SAMPLE = '{\n  "name": "UtilityHub",\n  "valid": true,\n  "count": 3,\n}';

type Result =
  | { ok: true; type: string; keys: number }
  | { ok: false; message: string; line?: number; col?: number };

function validate(src: string): Result | null {
  if (!src.trim()) return null;
  try {
    const value = JSON.parse(src);
    const type = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
    const keys = value && typeof value === "object" ? Object.keys(value).length : 0;
    return { ok: true, type, keys };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid JSON";
    // V8/Node error messages include "at position N" (and sometimes line/column).
    const posMatch = message.match(/position (\d+)/);
    let line: number | undefined;
    let col: number | undefined;
    if (posMatch) {
      const pos = Number(posMatch[1]);
      const before = src.slice(0, pos);
      line = before.split("\n").length;
      col = pos - before.lastIndexOf("\n");
    }
    return { ok: false, message, line, col };
  }
}

export default function JsonValidator() {
  const [input, setInput] = useState(SAMPLE);
  const result = useMemo(() => validate(input), [input]);

  return (
    <div className="space-y-4">
      <div className="card flex flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">JSON input</span>
          <button
            onClick={() => setInput("")}
            disabled={!input}
            className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] disabled:opacity-40"
          >
            Clear
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste JSON to validate, e.g. {"ok": true}'
          spellCheck={false}
          className="input scroll-thin min-h-[280px] flex-1 resize-y font-mono leading-relaxed"
        />
      </div>

      {result && (
        <div
          className="rounded-lg p-4"
          style={{
            background: result.ok
              ? "color-mix(in srgb, var(--success) 12%, transparent)"
              : "color-mix(in srgb, var(--danger) 12%, transparent)",
            color: result.ok ? "var(--success)" : "var(--danger)",
          }}
        >
          {result.ok ? (
            <p className="font-semibold">
              ✓ Valid JSON <span className="font-normal opacity-80">· {result.type}{result.keys ? ` with ${result.keys} top-level ${result.keys === 1 ? "key/item" : "keys/items"}` : ""}</span>
            </p>
          ) : (
            <div>
              <p className="font-semibold">✗ Invalid JSON</p>
              <p className="mt-1 font-mono text-sm">{result.message}</p>
              {result.line !== undefined && (
                <p className="mt-1 text-sm opacity-80">Near line {result.line}, column {result.col}.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
