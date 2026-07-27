import Link from "next/link";
import SearchableToolGrid from "@/components/SearchableToolGrid";
import { AVAILABLE_TOOLS, activeCategories } from "@/lib/tools";

export default function Home() {
  const catCount = activeCategories().length;
  const toolCount = AVAILABLE_TOOLS.length;

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1200px 400px at 50% -10%, var(--brand-soft), transparent), var(--background)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
          >
            {toolCount} free tools · no login · private
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Free online tools that just work
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted)]">
            Compress images, edit PDFs, count words, generate QR codes and more — all
            processed privately in your browser. No sign-up, no watermarks, no uploads.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#all-tools" className="btn btn-primary">
              Browse all tools
            </Link>
            <Link href="/tools/image-compressor" className="btn btn-secondary">
              Try Image Compressor →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
            <span>🔒 100% in-browser</span>
            <span>⚡ Instant results</span>
            <span>🆓 Always free</span>
            <span>📱 Works on mobile</span>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeCategories().map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="card flex items-center gap-3 p-4 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>{c.icon}</span>
              <span>
                <span className="block font-semibold">{c.name}</span>
                <span className="block text-sm text-[var(--muted)] line-clamp-1">{c.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* All tools with search */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">All tools</h2>
          <p className="mt-1 text-[var(--muted)]">
            {toolCount} tools across {catCount} categories — search or filter below.
          </p>
        </div>
        <SearchableToolGrid />
      </section>

      {/* Trust band */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature icon="🔒" title="Private by default" body="Files are processed in your browser and never uploaded to a server." />
          <Feature icon="⚡" title="Fast & lightweight" body="Static, mobile-first pages that load instantly and run offline-friendly." />
          <Feature icon="🆓" title="Free forever" body="Every core tool is free with no login, no paywall and no watermarks." />
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="card p-5">
      <div className="text-2xl" aria-hidden>{icon}</div>
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}
