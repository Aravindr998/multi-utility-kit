"use client";

import { useMemo, useState } from "react";
import { CATEGORY_META, ELEMENTS, type Element, type ElementCategory } from "@/lib/elements";

// ---------------------------------------------------------------------------
// Interactive periodic table — colour-coded by category, searchable, with a
// details panel per element. Data ships with the page; nothing is uploaded.
// ---------------------------------------------------------------------------

function tint(color: string, pct: number) {
  return `color-mix(in srgb, ${color} ${pct}%, var(--surface))`;
}

export default function PeriodicTable() {
  const [selected, setSelected] = useState<Element | null>(null);
  const [query, setQuery] = useState("");

  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const set = new Set<number>();
    for (const el of ELEMENTS) {
      if (
        el.name.toLowerCase().includes(q) ||
        el.symbol.toLowerCase() === q ||
        el.symbol.toLowerCase().startsWith(q) ||
        String(el.number) === q
      ) {
        set.add(el.number);
      }
    }
    return set;
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <input
          className="input flex-1"
          placeholder="Search by name, symbol or atomic number…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search elements"
        />
        {query && (
          <button className="btn btn-secondary px-3 py-1.5 text-sm" onClick={() => setQuery("")}>
            Clear
          </button>
        )}
      </div>

      {/* Table — scrolls horizontally on small screens */}
      <div className="overflow-x-auto pb-2">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: "repeat(18, minmax(2.6rem, 1fr))",
            gridTemplateRows: "repeat(10, auto)",
            minWidth: "48rem",
          }}
        >
          {ELEMENTS.map((el) => {
            const meta = CATEGORY_META[el.category];
            const dimmed = matchIds != null && !matchIds.has(el.number);
            const highlight = matchIds != null && matchIds.has(el.number);
            return (
              <button
                key={el.number}
                type="button"
                onClick={() => setSelected(el)}
                title={`${el.name} (${el.symbol})`}
                className="flex aspect-square flex-col items-center justify-center rounded-md p-0.5 text-center leading-none transition-all"
                style={{
                  gridColumn: el.x,
                  gridRow: el.y,
                  background: tint(meta.color, highlight ? 55 : 26),
                  border: `1px solid ${highlight ? meta.color : "transparent"}`,
                  opacity: dimmed ? 0.25 : 1,
                  boxShadow: highlight ? `0 0 0 2px ${meta.color}` : undefined,
                }}
              >
                <span className="text-[0.55rem] text-[var(--muted)]">{el.number}</span>
                <span className="text-sm font-bold sm:text-base">{el.symbol}</span>
                <span className="hidden truncate text-[0.5rem] text-[var(--muted)] sm:block">
                  {el.name}
                </span>
              </button>
            );
          })}

          {/* Row-label markers for the f-block */}
          <div className="flex items-center justify-end pr-1 text-[0.6rem] text-[var(--muted)]" style={{ gridColumn: 2, gridRow: 9 }}>
            57–71
          </div>
          <div className="flex items-center justify-end pr-1 text-[0.6rem] text-[var(--muted)]" style={{ gridColumn: 2, gridRow: 10 }}>
            89–103
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {(Object.entries(CATEGORY_META) as [ElementCategory, { label: string; color: string }][]).map(
          ([key, m]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <span className="h-3 w-3 rounded-sm" style={{ background: m.color }} />
              {m.label}
            </div>
          )
        )}
      </div>

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="card w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div
                className="grid h-20 w-20 place-items-center rounded-xl"
                style={{ background: tint(CATEGORY_META[selected.category].color, 40) }}
              >
                <div className="text-center leading-none">
                  <div className="text-[0.6rem] text-[var(--muted)]">{selected.number}</div>
                  <div className="text-2xl font-bold">{selected.symbol}</div>
                </div>
              </div>
              <button
                className="rounded-md px-2 py-1 text-sm hover:bg-[var(--surface-2)]"
                onClick={() => setSelected(null)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <h3 className="mt-4 text-xl font-bold">{selected.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  background: tint(CATEGORY_META[selected.category].color, 30),
                  color: "var(--foreground)",
                }}
              >
                {CATEGORY_META[selected.category].label}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label="Atomic number" value={String(selected.number)} />
              <Stat label="Atomic mass" value={`${selected.mass} u`} />
              <Stat label="Group" value={selected.y <= 7 ? String(selected.x) : "f-block"} />
              <Stat
                label="Period"
                value={
                  selected.y <= 7
                    ? String(selected.y)
                    : selected.category === "lanthanide"
                    ? "6"
                    : "7"
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}
