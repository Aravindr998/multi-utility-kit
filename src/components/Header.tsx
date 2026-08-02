"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { activeCategories, SITE } from "@/lib/tools";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const cats = activeCategories();

  // Show the four primary categories inline; the rest live on the home page.
  const primary = cats.slice(0, 4);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--surface) 82%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-7">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-[var(--foreground)]"
          >
            {SITE.name}
          </Link>

          <nav
            className="hidden items-center gap-5 md:flex"
            aria-label="Primary"
          >
            <NavLink href="/#all-tools" active={pathname === "/"} label="All tools" />
            {primary.map((c) => (
              <NavLink
                key={c.slug}
                href={`/category/${c.slug}`}
                active={isActive(`/category/${c.slug}`)}
                label={c.name}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/#all-tools"
            className="hidden h-9 w-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] sm:grid"
            aria-label="Search tools"
          >
            <SearchIcon />
          </Link>
          <ThemeToggle />
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t md:hidden"
          style={{ borderColor: "var(--border)" }}
          aria-label="Categories"
        >
          <div className="mx-auto grid max-w-6xl gap-0.5 px-4 py-3">
            <Link
              href="/#all-tools"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--surface-2)]"
            >
              All tools
            </Link>
            {cats.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--surface-2)]"
              >
                <span className="mr-2" aria-hidden>{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="relative py-1 text-sm font-medium"
      style={{ color: active ? "var(--foreground)" : "var(--muted)" }}
    >
      {label}
      <span
        className="absolute -bottom-[7px] left-0 h-0.5 w-full origin-left rounded-full transition-transform duration-200"
        style={{
          background: "var(--foreground)",
          transform: active ? "scaleX(1)" : "scaleX(0)",
        }}
      />
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
