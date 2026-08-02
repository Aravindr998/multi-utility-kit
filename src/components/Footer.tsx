import Link from "next/link";
import { activeCategories, SITE } from "@/lib/tools";

export default function Footer() {
  const cats = activeCategories();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-24"
      style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="text-lg font-bold tracking-tight">{SITE.name}</div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              © {year} {SITE.name}. All rights reserved. Made for speed &amp; privacy —
              professional-grade tools that never touch our servers.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-12 sm:gap-16">
            <FooterCol title="Product">
              <FooterLink href="/#all-tools">All tools</FooterLink>
              {cats.slice(0, 4).map((c) => (
                <FooterLink key={c.slug} href={`/category/${c.slug}`}>
                  {c.name}
                </FooterLink>
              ))}
            </FooterCol>

            <FooterCol title="Company">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/#all-tools">Browse tools</FooterLink>
            </FooterCol>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
    >
      {children}
    </Link>
  );
}
