"use client";

import { useEffect, useRef, useState } from "react";
import { AVAILABLE_TOOLS, activeCategories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

export default function SearchableToolGrid() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cats = activeCategories();

  // ⌘K / Ctrl+K focuses the search.
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = AVAILABLE_TOOLS.filter((t) => {
    const matchesCat = cat === "all" || t.category === cat;
    if (!matchesCat) return false;
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.cardDescription.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div id="all-tools" className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-4">
        {/* Search bar */}
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--faint)]"
            aria-hidden
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools (e.g. compress, pdf, word count)…"
            className="input py-3.5 pl-11 pr-16 text-base shadow-[var(--shadow-sm)]"
            aria-label="Search tools"
          />
          <kbd
            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded border px-1.5 py-0.5 font-sans text-xs font-medium text-[var(--muted)] sm:inline-flex"
            style={{ background: "var(--surface-2)", borderColor: "var(--border-strong)" }}
          >
            {isMac ? "⌘" : "Ctrl"} K
          </kbd>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")} label="All" />
          {cats.map((c) => (
            <FilterChip
              key={c.slug}
              active={cat === c.slug}
              onClick={() => setCat(c.slug)}
              label={`${c.icon} ${c.name}`}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[var(--muted)]">
          No tools match “{query}”. Try a different search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
      style={{
        background: active ? "var(--brand)" : "var(--surface)",
        color: active ? "var(--on-brand)" : "var(--muted)",
        border: `1px solid ${active ? "var(--brand)" : "var(--border-strong)"}`,
      }}
    >
      {label}
    </button>
  );
}
