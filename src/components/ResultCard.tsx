"use client";

import { formatBytes, pct } from "@/lib/format";
import type { ReactNode } from "react";

type Stat = { label: string; value: string };

type Props = {
  title?: string;
  /** Optional image/preview node shown above stats */
  preview?: ReactNode;
  /** Before/after byte sizes render an automatic savings badge */
  beforeBytes?: number;
  afterBytes?: number;
  /** Arbitrary extra stats */
  stats?: Stat[];
  onDownload?: () => void;
  downloadLabel?: string;
  onReset?: () => void;
  children?: ReactNode;
};

export default function ResultCard({
  title = "Result",
  preview,
  beforeBytes,
  afterBytes,
  stats,
  onDownload,
  downloadLabel = "Download",
  onReset,
  children,
}: Props) {
  const hasSizes = beforeBytes !== undefined && afterBytes !== undefined;
  const savings = hasSizes ? pct(beforeBytes!, afterBytes!) : 0;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {hasSizes && (
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              background: savings >= 0 ? "color-mix(in srgb, var(--success) 15%, transparent)" : "var(--surface-2)",
              color: savings >= 0 ? "var(--success)" : "var(--muted)",
            }}
          >
            {savings >= 0 ? `↓ ${savings}% smaller` : `↑ ${Math.abs(savings)}% larger`}
          </span>
        )}
      </div>

      {preview && <div className="mb-4">{preview}</div>}

      {(hasSizes || stats) && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {hasSizes && (
            <>
              <Cell label="Original" value={formatBytes(beforeBytes!)} />
              <Cell label="New size" value={formatBytes(afterBytes!)} highlight />
            </>
          )}
          {stats?.map((s) => (
            <Cell key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      )}

      {children}

      <div className="mt-4 flex flex-wrap gap-2">
        {onDownload && (
          <button className="btn btn-primary" onClick={onDownload}>
            ⬇ {downloadLabel}
          </button>
        )}
        {onReset && (
          <button className="btn btn-secondary" onClick={onReset}>
            Start over
          </button>
        )}
      </div>
    </div>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 font-semibold" style={highlight ? { color: "var(--brand)" } : undefined}>
        {value}
      </div>
    </div>
  );
}
