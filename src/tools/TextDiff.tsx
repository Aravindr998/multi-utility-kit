"use client";

import { useState } from "react";

type Op = { t: "eq" | "del" | "ins"; v: string };
// A diff row aligns one original line against one changed line. `replace` holds
// both, `delete`/`insert` hold only one side, `equal` holds an unchanged line.
type RowType = "equal" | "replace" | "delete" | "insert";
type Row = { type: RowType; orig?: string; chg?: string };
type Seg = { t: "eq" | "del" | "ins"; v: string };
type Choice = "orig" | "chg";

const toLines = (s: string) => (s.length ? s.split("\n") : []);

// Split into words, whitespace runs and individual punctuation so intra-line
// changes highlight at a word (and symbol) granularity.
const tokenize = (s: string) => s.match(/\s+|[A-Za-z0-9_]+|[^\sA-Za-z0-9_]/g) ?? [];

// Longest-common-subsequence diff over any string array (lines or tokens).
// Falls back to a whole replace when the O(n·m) table would be too heavy.
function diff(a: string[], b: string[]): Op[] {
  const n = a.length;
  const m = b.length;
  if (n * m > 4_000_000) {
    return [...a.map((v) => ({ t: "del" as const, v })), ...b.map((v) => ({ t: "ins" as const, v }))];
  }
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ t: "eq", v: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ t: "del", v: a[i] });
      i++;
    } else {
      ops.push({ t: "ins", v: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ t: "del", v: a[i++] });
  while (j < m) ops.push({ t: "ins", v: b[j++] });
  return ops;
}

// Turn a line diff into aligned rows: within each changed run, pair deletions
// with insertions by position (those become `replace` rows that get a word diff);
// leftovers become pure `delete` / `insert` rows.
function toRows(ops: Op[]): Row[] {
  const rows: Row[] = [];
  let i = 0;
  while (i < ops.length) {
    if (ops[i].t === "eq") {
      rows.push({ type: "equal", orig: ops[i].v, chg: ops[i].v });
      i++;
      continue;
    }
    const dels: string[] = [];
    const inss: string[] = [];
    while (i < ops.length && ops[i].t !== "eq") {
      if (ops[i].t === "del") dels.push(ops[i].v);
      else inss.push(ops[i].v);
      i++;
    }
    const n = Math.max(dels.length, inss.length);
    for (let k = 0; k < n; k++) {
      if (k < dels.length && k < inss.length) rows.push({ type: "replace", orig: dels[k], chg: inss[k] });
      else if (k < dels.length) rows.push({ type: "delete", orig: dels[k] });
      else rows.push({ type: "insert", chg: inss[k] });
    }
  }
  return rows;
}

// Word-level segments for a replace row: which tokens were removed vs added.
function wordSegments(a: string, b: string): { left: Seg[]; right: Seg[] } {
  const ops = diff(tokenize(a), tokenize(b));
  const left: Seg[] = [];
  const right: Seg[] = [];
  for (const op of ops) {
    if (op.t === "eq") {
      left.push({ t: "eq", v: op.v });
      right.push({ t: "eq", v: op.v });
    } else if (op.t === "del") {
      left.push({ t: "del", v: op.v });
    } else {
      right.push({ t: "ins", v: op.v });
    }
  }
  return { left, right };
}

const SAMPLE_A = `function greet(name) {
  console.log("Hello " + name);
  return true;
}`;
const SAMPLE_B = `function greet(name, greeting) {
  console.log(greeting + ", " + name);
  return true;
}`;

export default function TextDiff() {
  const [original, setOriginal] = useState(SAMPLE_A);
  const [changed, setChanged] = useState(SAMPLE_B);
  // Per-row merge picks. Keyed by row index; unset rows default to the changed
  // version. The source textareas are NEVER modified by these picks.
  const [picks, setPicks] = useState<Record<number, Choice>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const rows = toRows(diff(toLines(original), toLines(changed)));
  const additions = rows.filter((r) => r.type === "insert" || r.type === "replace").length;
  const deletions = rows.filter((r) => r.type === "delete" || r.type === "replace").length;
  const changeCount = rows.filter((r) => r.type !== "equal").length;
  const identical = changeCount === 0;

  // Line numbers per row, precomputed immutably so the JSX stays mutation-free.
  const nums = rows.reduce<{ oNo?: number; cNo?: number; o: number; c: number }[]>((acc, r) => {
    const prev = acc.length ? acc[acc.length - 1] : { o: 0, c: 0 };
    const o = prev.o + (r.orig !== undefined ? 1 : 0);
    const c = prev.c + (r.chg !== undefined ? 1 : 0);
    acc.push({ o, c, oNo: r.orig !== undefined ? o : undefined, cNo: r.chg !== undefined ? c : undefined });
    return acc;
  }, []);

  const choiceFor = (i: number): Choice => picks[i] ?? "chg";

  // The merged output — assembled read-only from the per-row picks. Unpicked
  // changed rows default to the changed version (i.e. "accept all changes").
  const merged = rows
    .map((r, i) => {
      if (r.type === "equal") return r.orig;
      return choiceFor(i) === "orig" ? r.orig : r.chg; // may be undefined ⇒ line dropped
    })
    .filter((l): l is string => l !== undefined)
    .join("\n");

  // Editing either source resets the picks, since row indices no longer line up.
  const editOriginal = (v: string) => {
    setOriginal(v);
    setPicks({});
  };
  const editChanged = (v: string) => {
    setChanged(v);
    setPicks({});
  };

  const pick = (i: number, side: Choice) => setPicks((p) => ({ ...p, [i]: side }));
  const pickAll = (side: Choice) => {
    const next: Record<number, Choice> = {};
    rows.forEach((r, i) => {
      if (r.type !== "equal") next[i] = side;
    });
    setPicks(next);
  };

  const copy = async (text: string, which: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied((c) => (c === which ? null : c)), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Original</label>
          <textarea
            value={original}
            onChange={(e) => editOriginal(e.target.value)}
            rows={8}
            placeholder="Paste the original text or code…"
            className="input scroll-thin font-mono text-sm"
            style={{ resize: "vertical" }}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="label">Changed</label>
          <textarea
            value={changed}
            onChange={(e) => editChanged(e.target.value)}
            rows={8}
            placeholder="Paste the changed text or code…"
            className="input scroll-thin font-mono text-sm"
            style={{ resize: "vertical" }}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-md px-2 py-1 font-semibold" style={{ background: "color-mix(in srgb, var(--success) 16%, transparent)", color: "var(--success)" }}>
          +{additions} added
        </span>
        <span className="rounded-md px-2 py-1 font-semibold" style={{ background: "color-mix(in srgb, var(--danger) 16%, transparent)", color: "var(--danger)" }}>
          −{deletions} removed
        </span>
        <span className="text-[var(--muted)]">{identical ? "No differences" : `${changeCount} changed line(s)`}</span>
      </div>

      <div className="card overflow-hidden p-0">
        {/* Column headers — each side has its own copy button. */}
        <div
          className="grid items-center border-b text-xs font-semibold"
          style={{ gridTemplateColumns: "minmax(0,1fr) 72px minmax(0,1fr)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ borderRight: "1px solid var(--border)" }}>
            <span className="uppercase tracking-wide text-[var(--muted)]">Original</span>
            <CopyBtn text={original} id="orig" label="Copy" copiedId={copied} onCopy={copy} />
          </div>
          <div className="px-1 py-2 text-center uppercase tracking-wide text-[var(--muted)]">Keep</div>
          <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ borderLeft: "1px solid var(--border)" }}>
            <span className="uppercase tracking-wide text-[var(--muted)]">Changed</span>
            <CopyBtn text={changed} id="chg" label="Copy" copiedId={copied} onCopy={copy} />
          </div>
        </div>

        {!original && !changed ? (
          <p className="p-6 text-center text-sm text-[var(--muted)]">Paste text into both boxes to compare them.</p>
        ) : identical ? (
          <p className="p-6 text-center text-sm text-[var(--muted)]">The two texts are identical.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full font-mono text-sm">
              {rows.map((r, i) => {
                const leftTone = r.type === "equal" ? "equal" : r.orig !== undefined ? "del" : "empty";
                const rightTone = r.type === "equal" ? "equal" : r.chg !== undefined ? "ins" : "empty";
                let leftSegs: Seg[] = [];
                let rightSegs: Seg[] = [];
                if (r.type === "equal") {
                  leftSegs = [{ t: "eq", v: r.orig ?? "" }];
                  rightSegs = [{ t: "eq", v: r.chg ?? "" }];
                } else if (r.type === "replace") {
                  const seg = wordSegments(r.orig ?? "", r.chg ?? "");
                  leftSegs = seg.left;
                  rightSegs = seg.right;
                } else if (r.type === "delete") {
                  leftSegs = [{ t: "del", v: r.orig ?? "" }];
                } else {
                  rightSegs = [{ t: "ins", v: r.chg ?? "" }];
                }
                const sel = choiceFor(i);
                return (
                  <div
                    key={i}
                    className="grid items-stretch"
                    style={{ gridTemplateColumns: "minmax(0,1fr) 72px minmax(0,1fr)" }}
                  >
                    <DiffCell no={nums[i].oNo} segs={leftSegs} tone={leftTone} side="left" />
                    <div className="flex items-center justify-center gap-1 border-y px-1" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
                      {r.type !== "equal" && (
                        <>
                          {/* ◀ merges right→left (keep changed); ▶ merges left→right (keep original) */}
                          <ArrowBtn dir="left" active={sel === "chg"} onClick={() => pick(i, "chg")} />
                          <ArrowBtn dir="right" active={sel === "orig"} onClick={() => pick(i, "orig")} />
                        </>
                      )}
                    </div>
                    <DiffCell no={nums[i].cNo} segs={rightSegs} tone={rightTone} side="right" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!identical && (original || changed) && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="label m-0">Merged result</label>
            <span className="text-xs text-[var(--muted)]">Use the ◀ / ▶ arrows per line above to build this — your input boxes stay untouched.</span>
            <span className="ml-auto flex flex-wrap gap-2">
              <button className="rounded-md px-2 py-1 text-xs font-semibold hover:bg-[var(--surface-2)]" style={{ border: "1px solid var(--border)" }} onClick={() => pickAll("orig")}>
                Keep all original
              </button>
              <button className="rounded-md px-2 py-1 text-xs font-semibold hover:bg-[var(--surface-2)]" style={{ border: "1px solid var(--border)" }} onClick={() => pickAll("chg")}>
                Keep all changed
              </button>
              <button className="btn btn-primary" onClick={() => copy(merged, "merged")}>
                {copied === "merged" ? "Copied!" : "Copy merged"}
              </button>
            </span>
          </div>
          <textarea readOnly value={merged} rows={Math.min(12, Math.max(4, merged.split("\n").length))} className="input scroll-thin font-mono text-sm" style={{ resize: "vertical" }} aria-label="Merged result" />
        </div>
      )}
    </div>
  );
}

function CopyBtn({ text, id, label, copiedId, onCopy }: { text: string; id: string; label: string; copiedId: string | null; onCopy: (text: string, id: string) => void }) {
  return (
    <button
      onClick={() => onCopy(text, id)}
      disabled={!text}
      className="rounded-md px-2 py-0.5 text-xs font-semibold hover:bg-[var(--surface-2)] disabled:opacity-40"
      style={{ border: "1px solid var(--border)" }}
    >
      {copiedId === id ? "Copied!" : label}
    </button>
  );
}

// Uncoloured merge arrows. ◀ merges right→left (keep the changed line); ▶ merges
// left→right (keep the original line). The active pick is shown with a neutral
// (non-semantic) fill, per feedback to not colour the arrows.
function ArrowBtn({ dir, active, onClick }: { dir: "left" | "right"; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={dir === "left" ? "Merge right → left (keep the changed line)" : "Merge left → right (keep the original line)"}
      className="grid h-6 w-6 place-items-center rounded text-sm font-bold"
      style={{
        border: "1px solid var(--border)",
        background: active ? "color-mix(in srgb, var(--foreground) 14%, transparent)" : "transparent",
        opacity: active ? 1 : 0.45,
      }}
    >
      {dir === "left" ? "◀" : "▶"}
    </button>
  );
}

function DiffCell({
  no,
  segs,
  tone,
  side,
}: {
  no: number | undefined;
  segs: Seg[];
  tone: "equal" | "del" | "ins" | "empty";
  side: "left" | "right";
}) {
  const bg =
    tone === "del"
      ? "color-mix(in srgb, var(--danger) 10%, transparent)"
      : tone === "ins"
        ? "color-mix(in srgb, var(--success) 10%, transparent)"
        : tone === "empty"
          ? "color-mix(in srgb, var(--muted) 7%, transparent)"
          : "transparent";
  const marker = tone === "del" ? "−" : tone === "ins" ? "+" : " ";
  return (
    <div
      className="flex items-start gap-2 px-2 py-0.5"
      style={{
        background: bg,
        borderRight: side === "left" ? "1px solid var(--border)" : undefined,
        borderLeft: side === "right" ? "1px solid var(--border)" : undefined,
      }}
    >
      <span className="w-8 shrink-0 select-none text-right text-xs text-[var(--muted)]">{no ?? ""}</span>
      <span className="w-3 shrink-0 select-none text-center text-[var(--muted)]">{tone === "empty" ? "" : marker}</span>
      <span className="whitespace-pre-wrap break-words">
        {segs.map((s, i) =>
          s.t === "eq" ? (
            <span key={i}>{s.v}</span>
          ) : (
            <span
              key={i}
              style={{
                background:
                  s.t === "del"
                    ? "color-mix(in srgb, var(--danger) 32%, transparent)"
                    : "color-mix(in srgb, var(--success) 32%, transparent)",
                borderRadius: "3px",
              }}
            >
              {s.v}
            </span>
          ),
        )}
      </span>
    </div>
  );
}
