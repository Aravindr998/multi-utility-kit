"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCommand, type CommandResult } from "@/lib/commandParser";
import type { Intent } from "@/lib/intents";

/**
 * Global Spotlight-style command bar.
 * ⌘K / Ctrl+K opens it anywhere. Type to search tools or run a quick command
 * ("convert 10 usd to inr", "count words in …", "generate uuid", "make qr for …").
 * Intents can compute their answer inline; Enter opens the tool pre-filled.
 */
export default function CommandBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => parseCommand(query), [query]);
  // Clamp during render so the highlight never points past the list.
  const activeIndex = results.length ? Math.min(active, results.length - 1) : 0;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
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

  const run = useCallback(
    (result: CommandResult | undefined) => {
      if (!result) return;
      close();
      router.push(result.href);
    },
    [router, close]
  );

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) =>
        results.length ? (a - 1 + results.length) % results.length : 0
      );
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
            placeholder="Search tools or try “convert 10 usd to inr”…"
            className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-[var(--faint)]"
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
  onHover,
  onClick,
}: {
  result: CommandResult;
  index: number;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
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
        <IntentBody intent={result} />
      ) : (
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{result.tool.name}</span>
          <span className="block truncate text-sm text-[var(--muted)]">
            {result.tool.cardDescription}
          </span>
        </span>
      )}

      <Enter active={active} />
    </button>
  );
}

/** Renders an intent's title + inline computed result (sync or async). */
function IntentBody({ intent }: { intent: Intent }) {
  const [output, setOutput] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">(
    intent.compute ? "loading" : "idle"
  );

  useEffect(() => {
    // No inline compute → stays "idle" (its initial value); nothing to run.
    if (!intent.compute) return;
    let cancelled = false;
    Promise.resolve()
      .then(() => intent.compute!())
      .then((val) => {
        if (cancelled) return;
        if (val == null) setState("error");
        else {
          setOutput(val);
          setState("ready");
        }
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
    // id captures the specific parsed instance (amount, text, etc.)
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

function EmptyHint() {
  return (
    <div className="px-3 py-6 text-sm text-[var(--muted)]">
      <p className="mb-2 font-medium text-[var(--foreground)]">Try typing…</p>
      <ul className="space-y-1.5">
        <li>🔎 A tool — “compress”, “qr code”, “word count”</li>
        <li>💱 “convert 10 usd to inr”</li>
        <li>📐 “resize image to 1080p”</li>
        <li>🆔 “generate uuid” · 🔳 “make qr for https://…”</li>
        <li>⌨️ ↑↓ to navigate · <kbd className="font-sans">Enter</kbd> to open</li>
      </ul>
    </div>
  );
}

function Enter({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <kbd
      className="shrink-0 rounded border px-1.5 py-0.5 text-xs text-[var(--muted)]"
      style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
    >
      ↵
    </kbd>
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
