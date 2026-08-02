"use client";

import { usePinnedTools } from "@/lib/usePinnedTools";
import { getTool } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

export default function PinnedDashboard() {
  const { pinned, clear } = usePinnedTools();

  // Preserve pin order; drop any slugs that no longer resolve to a live tool.
  const tools = pinned.map((slug) => getTool(slug)).filter((t) => t != null);

  if (tools.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17v5" fill="none" />
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
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
    </section>
  );
}
