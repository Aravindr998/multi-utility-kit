import Link from "next/link";
import type { ReactNode } from "react";
import { categoryOf, type Tool } from "@/lib/tools";

/**
 * Wraps every tool page with a consistent shell:
 * breadcrumb → H1 → intro → tool UI → privacy note → how-to → FAQ.
 */
export default function ToolPageLayout({
  tool,
  children,
}: {
  tool: Tool;
  children: ReactNode;
}) {
  const category = categoryOf(tool);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-[var(--muted)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
          </li>
          <li aria-hidden>/</li>
          {category && (
            <>
              <li>
                <Link href={`/category/${category.slug}`} className="hover:text-[var(--foreground)]">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden>/</li>
            </>
          )}
          <li className="text-[var(--foreground)]" aria-current="page">{tool.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
          style={{ background: "var(--brand-soft)" }}
          aria-hidden
        >
          {tool.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{tool.h1}</h1>
          <p className="mt-1 text-[var(--muted)]">{tool.cardDescription}</p>
        </div>
      </div>

      {/* Tool UI */}
      <section aria-label={`${tool.name} tool`}>{children}</section>

      {/* Privacy / processing note */}
      <div
        className="mt-6 flex items-start gap-2 rounded-lg p-3 text-sm"
        style={
          tool.serverSide
            ? { background: "color-mix(in srgb, #f59e0b 12%, transparent)", color: "var(--foreground)" }
            : { background: "var(--surface-2)", color: "var(--muted)" }
        }
      >
        <span aria-hidden>{tool.serverSide ? "☁️" : "🔒"}</span>
        <span>{tool.privacyNote}</span>
      </div>

      {/* Supporting content (SEO) — collapsed so it stays crawlable without cluttering the page */}
      <div className="mt-10 space-y-3">
        <details className="accordion card p-4">
          <summary className="cursor-pointer font-semibold">About {tool.name}</summary>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">{tool.intro}</p>
        </details>

        <details className="accordion card p-4">
          <summary className="cursor-pointer font-semibold">How to use</summary>
          <ol className="mt-3 space-y-2">
            {tool.howTo.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--brand)" }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[var(--muted)]">{step}</span>
              </li>
            ))}
          </ol>
        </details>

        <details className="accordion card p-4">
          <summary className="cursor-pointer font-semibold">Frequently asked questions</summary>
          <div className="mt-3 space-y-3">
            {tool.faqs.map((faq, i) => (
              <div key={i}>
                <p className="font-semibold">{faq.q}</p>
                <p className="mt-1 text-[var(--muted)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
