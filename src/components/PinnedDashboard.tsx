"use client";

import { usePinnedTools } from "@/lib/usePinnedTools";
import { getTool } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

function PinGlyph({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}

export default function PinnedDashboard() {
  const { pinned, clear } = usePinnedTools();

  // Preserve pin order; drop any slugs that no longer resolve to a live tool.
  const tools = pinned.map((slug) => getTool(slug)).filter((t) => t != null);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12">
      {tools.length === 0 ? (
        /* Empty state — teaches the pin feature to first-time visitors. */
        <div
          className="animate-fade-up flex flex-col items-center gap-4 rounded-2xl border border-dashed px-6 py-10 text-center sm:flex-row sm:gap-5 sm:py-8 sm:text-left"
          style={{ borderColor: "var(--border-strong)", background: "var(--surface-3)" }}
        >
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-[var(--muted)]"
            style={{ background: "var(--brand-soft)" }}
            aria-hidden
          >
            <PinGlyph />
          </span>
          <div className="flex-1">
            <h2 className="font-semibold tracking-tight">Your pinned tools will appear here</h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              Open any tool and hit the pin icon
              <span className="mx-1 inline-flex translate-y-0.5 text-[var(--foreground)]"><PinGlyph /></span>
              — or hover a card below — to keep your favourites one click away. Saved to this browser, no account needed.
            </p>
          </div>
          <a
            href="#all-tools"
            className="btn btn-secondary shrink-0"
          >
            Browse tools
          </a>
        </div>
      ) : (
        /* Populated dashboard */
        <div
          className="animate-fade-up rounded-2xl border p-5 sm:p-6"
          style={{ background: "var(--surface-3)", borderColor: "var(--border)" }}
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[var(--foreground)]"
                style={{ background: "var(--brand-soft)" }}
                aria-hidden
              >
                <PinGlyph />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Your tools</h2>
                <p className="text-sm text-[var(--muted)]">
                  {tools.length} pinned · saved on this device
                </p>
              </div>
            </div>
            <button
              onClick={clear}
              className="btn-ghost shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium"
              title="Remove all pinned tools"
            >
              Clear all
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <ToolCard key={t!.slug} tool={t!} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
