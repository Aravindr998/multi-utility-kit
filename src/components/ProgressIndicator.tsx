"use client";

type Props = {
  /** 0-100, or omit for an indeterminate spinner */
  value?: number;
  label?: string;
};

export default function ProgressIndicator({ value, label }: Props) {
  const indeterminate = value === undefined;

  return (
    <div className="flex flex-col gap-2" role="status" aria-live="polite">
      {label && (
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <span>{label}</span>
          {!indeterminate && <span>{Math.round(value!)}%</span>}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: "var(--surface-2)" }}
      >
        <div
          className={`h-full rounded-full ${indeterminate ? "animate-pulse" : ""}`}
          style={{
            width: indeterminate ? "100%" : `${Math.min(100, Math.max(0, value!))}%`,
            background: "var(--brand)",
            transition: indeterminate ? undefined : "width 0.2s ease",
          }}
        />
      </div>
    </div>
  );
}
