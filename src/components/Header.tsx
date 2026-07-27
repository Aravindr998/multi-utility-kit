"use client";

import Link from "next/link";
import { useState } from "react";
import { activeCategories, SITE } from "@/lib/tools";

export default function Header() {
  const [open, setOpen] = useState(false);
  const cats = activeCategories();

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur"
      style={{
        background: "color-mix(in srgb, var(--surface) 85%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-white"
            style={{ background: "var(--brand)" }}
            aria-hidden
          >
            ⚙️
          </span>
          <span>{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Categories">
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/#all-tools"
            className="ml-1 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ color: "var(--brand)" }}
          >
            All tools
          </Link>
        </nav>

        <button
          className="rounded-lg p-2 md:hidden"
          style={{ background: "var(--surface-2)" }}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav
          className="border-t md:hidden"
          style={{ borderColor: "var(--border)" }}
          aria-label="Categories"
        >
          <div className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
            {cats.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-[var(--surface-2)]"
              >
                {c.icon} {c.name}
              </Link>
            ))}
            <Link
              href="/#all-tools"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold"
              style={{ color: "var(--brand)" }}
            >
              All tools
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
