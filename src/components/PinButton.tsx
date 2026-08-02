"use client";

import { usePinnedTools } from "@/lib/usePinnedTools";

type Props = {
  slug: string;
  /** "icon" = compact toggle for cards; "full" = labelled button for tool pages */
  variant?: "icon" | "full";
  className?: string;
};

export default function PinButton({ slug, variant = "icon", className = "" }: Props) {
  const { isPinned, toggle } = usePinnedTools();
  const pinned = isPinned(slug);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(slug);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={pinned}
        className={`btn ${pinned ? "btn-primary" : "btn-secondary"} ${className}`}
      >
        <PinIcon filled={pinned} />
        {pinned ? "Pinned" : "Pin to dashboard"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pinned}
      aria-label={pinned ? `Unpin ${slug}` : `Pin ${slug} to your dashboard`}
      title={pinned ? "Unpin from dashboard" : "Pin to dashboard"}
      className={[
        "z-10 grid h-8 w-8 place-items-center rounded-lg transition-all",
        "hover:bg-[var(--surface-2)]",
        pinned
          ? "text-[var(--foreground)] opacity-100"
          : "text-[var(--faint)] opacity-100 hover:text-[var(--foreground)] sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
        className,
      ].join(" ")}
    >
      <PinIcon filled={pinned} />
    </button>
  );
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}
