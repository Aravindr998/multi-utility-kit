"use client";

import { useMemo, useState } from "react";

type Row = { t: "same" | "add" | "del"; text: string };

const A0 = "function sum(a, b) {\n  return a + b;\n}\n\nconst total = sum(2, 3);";
const B0 = "function sum(a, b, c = 0) {\n  return a + b + c;\n}\n\nconst total = sum(2, 3, 4);";

function diffLines(a: string[], b: string[]): Row[] {
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: Row[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ t: "same", text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ t: "del", text: a[i] }); i++; }
    else { out.push({ t: "add", text: b[j] }); j++; }
  }
  while (i < n) out.push({ t: "del", text: a[i++] });
  while (j < m) out.push({ t: "add", text: b[j++] });
  return out;
}

export default function DiffViewer() {
  const [a, setA] = useState(A0);
  const [b, setB] = useState(B0);
  const [ignoreWs, setIgnoreWs] = useState(false);

  const rows = useMemo(() => {
    const norm = (s: string) => (ignoreWs ? s.replace(/[ \t]+/g, " ").trim() : s);
    const linesA = a.split("\n"), linesB = b.split("\n");
    if (linesA.length * linesB.length > 4_000_000) return null; // guard huge inputs
    return diffLines(linesA.map(norm), linesB.map(norm));
  }, [a, b, ignoreWs]);

  const added = rows?.filter((r) => r.t === "add").length ?? 0;
  const removed = rows?.filter((r) => r.t === "del").length ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card flex flex-col p-4">
          <span className="mb-2 text-sm font-semibold">Original</span>
          <textarea className="input scroll-thin min-h-[180px] flex-1 resize-y font-mono text-sm leading-relaxed" value={a} onChange={(e) => setA(e.target.value)} spellCheck={false} />
        </div>
        <div className="card flex flex-col p-4">
          <span className="mb-2 text-sm font-semibold">Changed</span>
          <textarea className="input scroll-thin min-h-[180px] flex-1 resize-y font-mono text-sm leading-relaxed" value={b} onChange={(e) => setB(e.target.value)} spellCheck={false} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs(e.target.checked)} className="accent-[var(--brand)]" />
          Ignore whitespace
        </label>
        {rows && <span className="text-sm text-[var(--muted)]"><span style={{ color: "var(--success)" }}>+{added}</span> / <span style={{ color: "var(--danger)" }}>−{removed}</span></span>}
      </div>

      {rows === null ? (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>Inputs are too large to diff line-by-line. Try smaller chunks.</p>
      ) : (
        <div className="card p-0">
          <div className="scroll-thin max-h-[520px] overflow-auto rounded-lg font-mono text-sm">
            {rows.map((r, i) => (
              <div key={i} className="flex items-start gap-2 px-3 py-0.5"
                style={{
                  background: r.t === "add" ? "color-mix(in srgb, var(--success) 14%, transparent)" : r.t === "del" ? "color-mix(in srgb, var(--danger) 14%, transparent)" : "transparent",
                }}>
                <span className="w-4 shrink-0 select-none text-[var(--muted)]">{r.t === "add" ? "+" : r.t === "del" ? "−" : " "}</span>
                <span className="whitespace-pre-wrap break-all">{r.text || " "}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
