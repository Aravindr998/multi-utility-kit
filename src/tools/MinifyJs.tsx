"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import { formatBytes } from "@/lib/format";

const SAMPLE = "function greet(name) {\n  // say hello\n  const message = 'Hello, ' + name + '!';\n  console.log(message);\n  return message;\n}\n\ngreet('world');";

export default function MinifyJs() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [mangle, setMangle] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!input.trim()) return;
    setBusy(true);
    setError(null);
    setOutput("");
    try {
      const { minify } = await import("terser");
      const result = await minify(input, {
        mangle,
        compress: true,
        format: { comments: false },
      });
      setOutput(result.code ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not minify — check for syntax errors.");
    } finally {
      setBusy(false);
    }
  };

  const savings = output ? Math.round((1 - output.length / input.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">JavaScript input</span>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
            <input type="checkbox" checked={mangle} onChange={(e) => setMangle(e.target.checked)} className="accent-[var(--brand)]" />
            Mangle names
          </label>
        </div>
        <textarea className="input scroll-thin min-h-[200px] w-full resize-y font-mono text-sm leading-relaxed" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="Paste JavaScript here…" />
        <button className="btn btn-primary mt-3" onClick={run} disabled={busy}>{busy ? "Minifying…" : "Minify JavaScript"}</button>
      </div>

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {error}</p>}

      {output && (
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Minified {savings > 0 && <span className="font-normal text-[var(--success)]">· {savings}% smaller ({formatBytes(input.length)} → {formatBytes(output.length)})</span>}</span>
            <CopyButton value={output} />
          </div>
          <textarea readOnly className="input scroll-thin min-h-[160px] w-full resize-y font-mono text-sm" value={output} style={{ background: "var(--surface-2)" }} />
        </div>
      )}
    </div>
  );
}
