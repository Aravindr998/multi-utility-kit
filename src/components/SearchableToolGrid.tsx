"use client";

import { useState } from "react";
import { AVAILABLE_TOOLS, activeCategories } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

export default function SearchableToolGrid() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const cats = activeCategories();

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
    <div id="all-tools" className="scroll-mt-20">
      <div className="mb-6 flex flex-col gap-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools (e.g. compress, pdf, word count)…"
            className="input pl-9"
            aria-label="Search tools"
          />
        </div>

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
        <p className="py-10 text-center text-[var(--muted)]">
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
      className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
      style={{
        background: active ? "var(--brand)" : "var(--surface-2)",
        color: active ? "#fff" : "var(--foreground)",
        border: "1px solid var(--border)",
      }}
    >
      {label}
    </button>
  );
}
