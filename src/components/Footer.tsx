import Link from "next/link";
import { activeCategories, SITE } from "@/lib/tools";

export default function Footer() {
  const cats = activeCategories();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-16"
      style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span
                className="grid h-7 w-7 place-items-center rounded-md text-white"
                style={{ background: "var(--brand)" }}
                aria-hidden
              >
                ⚙️
              </span>
              {SITE.name}
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">{SITE.tagline}. Free, private and no sign-up required.</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-[var(--muted)] hover:text-[var(--foreground)]">About</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[var(--muted)] hover:text-[var(--foreground)]">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Private by design</h3>
            <p className="text-sm text-[var(--muted)]">
              Most tools run entirely in your browser. Your files never touch our servers.
            </p>
          </div>
        </div>

        <div
          className="mt-8 flex flex-col items-center justify-between gap-2 pt-6 text-sm text-[var(--muted)] sm:flex-row"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p>Made for speed & privacy.</p>
        </div>
      </div>
    </footer>
  );
}
