"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
  className?: string;
};

/** Small "Copy"/"Copied" button used across the developer tools. */
export default function CopyButton({ value, label = "Copy", className }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!value) return;
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <button
      onClick={copy}
      disabled={!value}
      className={className ?? "rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
