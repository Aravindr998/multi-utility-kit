"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker, type Matcher } from "react-day-picker";

/** Convert a Date to a local `yyyy-mm-dd` string (no UTC shift). */
function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/** Parse a local `yyyy-mm-dd` string into a Date, or undefined. */
function fromISO(s?: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? undefined : date;
}
/** Human-friendly `dd-mm-yyyy`. */
function format(d?: Date): string {
  if (!d) return "";
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

export default function DateField({
  id,
  value,
  onChange,
  min,
  max,
  placeholder = "dd-mm-yyyy",
}: {
  id?: string;
  value: string; // yyyy-mm-dd
  onChange: (iso: string) => void;
  min?: string; // yyyy-mm-dd
  max?: string; // yyyy-mm-dd
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = fromISO(value);
  const minDate = fromISO(min);
  const maxDate = fromISO(max);
  const now = new Date();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const disabled: Matcher | undefined =
    minDate && maxDate
      ? { before: minDate, after: maxDate }
      : minDate
        ? { before: minDate }
        : maxDate
          ? { after: maxDate }
          : undefined;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="input flex w-full items-center justify-between text-left"
      >
        <span className={selected ? "" : "text-[var(--muted)]"}>{selected ? format(selected) : placeholder}</span>
        <span aria-hidden className="ml-2 opacity-70">📅</span>
      </button>

      {open && (
        <div
          role="dialog"
          className="card absolute left-0 top-full z-50 mt-2 p-3"
          style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            defaultMonth={selected || maxDate || now}
            captionLayout="dropdown"
            startMonth={minDate || new Date(1900, 0)}
            endMonth={maxDate || new Date(now.getFullYear() + 100, 11)}
            disabled={disabled}
            onSelect={(d) => {
              if (d) {
                onChange(toISO(d));
                setOpen(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
