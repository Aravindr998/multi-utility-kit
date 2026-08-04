"use client";

/** Shared option controls for the text tools. */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: on ? "var(--brand)" : "var(--surface-2)",
              color: on ? "var(--on-brand)" : "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[var(--brand)]"
      />
      {label}
    </label>
  );
}
