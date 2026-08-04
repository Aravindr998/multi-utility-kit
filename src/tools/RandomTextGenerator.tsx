"use client";

import { useState } from "react";
import { Toggle } from "@/components/textControls";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

function randomString(charset: string, length: number): string {
  const out: string[] = [];
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) out.push(charset[arr[i] % charset.length]);
  return out.join("");
}

export default function RandomTextGenerator() {
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let charset = "";
    if (upper) charset += SETS.upper;
    if (lower) charset += SETS.lower;
    if (digits) charset += SETS.digits;
    if (symbols) charset += SETS.symbols;
    if (!charset) {
      setOutput("Select at least one character set.");
      return;
    }
    const len = Math.min(4096, Math.max(1, length || 1));
    const n = Math.min(1000, Math.max(1, count || 1));
    const lines: string[] = [];
    for (let i = 0; i < n; i++) lines.push(randomString(charset, len));
    setOutput(lines.join("\n"));
  }

  function copy() {
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div>
          <span className="label">Character sets</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Toggle checked={upper} onChange={setUpper} label="Uppercase A–Z" />
            <Toggle checked={lower} onChange={setLower} label="Lowercase a–z" />
            <Toggle checked={digits} onChange={setDigits} label="Digits 0–9" />
            <Toggle checked={symbols} onChange={setSymbols} label="Symbols" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="rt-len">Length (chars each)</label>
            <input id="rt-len" type="number" min={1} max={4096} className="input" value={length} onChange={(e) => setLength(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label" htmlFor="rt-count">How many</label>
            <input id="rt-count" type="number" min={1} max={1000} className="input" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 0)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      {output && (
        <div className="card flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Output</span>
            <button onClick={copy} className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            className="input scroll-thin min-h-[180px] resize-y font-mono leading-relaxed"
            style={{ background: "var(--surface-2)" }}
          />
        </div>
      )}
    </div>
  );
}
