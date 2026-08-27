"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCommand, type CommandResult } from "@/lib/commandParser";
import type { Intent } from "@/lib/intents";

/**
 * Global Spotlight-style command bar.
 * ⌘K / Ctrl+K opens it anywhere. Type to search tools, convert units/currency,
 * run a quick calculation, or generate things ("generate uuid", "make qr …").
 *
 * A "direct result" row (one that computes an answer inline) copies that answer
 * on Enter; a tool row navigates to the tool (pre-filled where possible).
 */
export default function CommandBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Computed inline results, keyed by intent id, so Enter copies what's shown.
  const computed = useRef<Map<string, string>>(new Map());

  const results = useMemo(() => parseCommand(query), [query]);
  const activeIndex = results.length ? Math.min(active, results.length - 1) : 0;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    setCopiedId(null);
  }, []);

  // Global open shortcut + Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Focus the input and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const flashCopied = useCallback((id: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1400);
  }, []);

  const run = useCallback(
    (result: CommandResult | undefined) => {
      if (!result) return;
      // Direct result → copy the computed value (stay open to show feedback).
      if (result.kind === "intent" && result.compute) {
        const value = computed.current.get(result.id);
        if (value != null) {
          flashCopied(result.id, value);
          return;
        }
      }
      close();
      router.push(result.href);
    },
    [router, close, flashCopied]
  );

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[activeIndex]);
    }
  };

  // Scroll the active row into view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command bar"
      onMouseDown={close}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "color-mix(in srgb, var(--background) 55%, transparent)" }}
        aria-hidden
      />

      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-[0_24px_60px_-15px_rgba(0,0,0,0.45)]"
        style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b px-4" style={{ borderColor: "var(--border)" }}>
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search tools, or try “10 cm to inch”, “2+2*3”, “generate uuid”…"
            className="flex-1 border-0 bg-transparent py-4 text-base placeholder:text-[var(--faint)]"
            style={{ outline: "none", boxShadow: "none" }}
            aria-label="Search tools or run a command"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd
            className="rounded border px-1.5 py-0.5 text-xs text-[var(--muted)]"
            style={{ background: "var(--surface-2)", borderColor: "var(--border-strong)" }}
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <EmptyHint />
          ) : results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[var(--muted)]">
              No results for “{query.trim()}”.
            </p>
          ) : (
            results.map((r, i) => (
              <ResultRow
                key={r.id}
                result={r}
                index={i}
                active={i === activeIndex}
                copied={copiedId === r.id}
                onResult={(id, val) => {
                  if (val == null) computed.current.delete(id);
                  else computed.current.set(id, val);
                }}
                onHover={() => setActive(i)}
                onClick={() => run(r)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  result,
  index,
  active,
  copied,
  onResult,
  onHover,
  onClick,
}: {
  result: CommandResult;
  index: number;
  active: boolean;
  copied: boolean;
  onResult: (id: string, value: string | null) => void;
  onHover: () => void;
  onClick: () => void;
}) {
  const isCopyable = result.kind === "intent" && !!result.compute;
  return (
    <button
      data-index={index}
      onMouseMove={onHover}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
      style={{ background: active ? "var(--surface-2)" : "transparent" }}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-lg"
        style={{ background: "var(--brand-soft)" }}
        aria-hidden
      >
        {result.kind === "intent" ? result.icon : result.tool.icon}
      </span>

      {result.kind === "intent" ? (
        <IntentBody intent={result} onResult={onResult} />
      ) : (
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{result.tool.name}</span>
          <span className="block truncate text-sm text-[var(--muted)]">
            {result.tool.cardDescription}
          </span>
        </span>
      )}

      <Hint active={active} copied={copied} action={isCopyable ? "copy" : "open"} />
    </button>
  );
}

/** Renders an intent's title + inline computed result (sync or async). */
function IntentBody({
  intent,
  onResult,
}: {
  intent: Intent;
  onResult: (id: string, value: string | null) => void;
}) {
  const [output, setOutput] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    intent.compute ? "loading" : "idle"
  );

  useEffect(() => {
    if (!intent.compute) return; // navigate-only intent; nothing to compute
    let cancelled = false;
    Promise.resolve()
      .then(() => intent.compute!())
      .then((val) => {
        if (cancelled) return;
        if (val == null) {
          setState("error");
          onResult(intent.id, null);
        } else {
          setOutput(val);
          setState("ready");
          onResult(intent.id, val);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
        onResult(intent.id, null);
      });
    return () => {
      cancelled = true;
    };
    // id encodes the parsed inputs (amount, text, expression, …)
  }, [intent.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate font-medium">{intent.title}</span>
      {state === "idle" ? (
        <span className="block truncate text-sm text-[var(--muted)]">{intent.subtitle}</span>
      ) : (
        <span className="block truncate font-mono text-sm" style={{ color: "var(--brand)" }}>
          {state === "loading" ? "…" : state === "error" ? "—" : output}
        </span>
      )}
    </span>
  );
}

function Hint({
  active,
  copied,
  action,
}: {
  active: boolean;
  copied: boolean;
  action: "copy" | "open";
}) {
  if (copied) {
    return (
      <span className="shrink-0 text-xs font-medium" style={{ color: "var(--brand)" }}>
        Copied ✓
      </span>
    );
  }
  if (!active) return null;
  return (
    <span className="flex shrink-0 items-center gap-1 text-xs text-[var(--muted)]">
      <kbd
        className="rounded border px-1.5 py-0.5"
        style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
      >
        ↵
      </kbd>
      {action === "copy" ? "copy" : "open"}
    </span>
  );
}

function EmptyHint() {
  return (
    <div className="px-3 py-6 text-sm text-[var(--muted)]">
      <p className="mb-2 font-medium text-[var(--foreground)]">Try typing…</p>
      <ul className="space-y-1.5">
        <li>🔎 A tool — “compress”, “qr code”, “word count”</li>
        <li>📏 “10 cm to inch” · 💱 “convert 10 usd to inr”</li>
        <li>🧮 “2+2*3” · “sqrt(144)” · “20% of 150”</li>
        <li>🆔 “generate uuid” · 🔳 “make qr for https://…”</li>
        <li>⌨️ ↑↓ to navigate · <kbd className="font-sans">Enter</kbd> to run</li>
      </ul>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[var(--faint)]"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
