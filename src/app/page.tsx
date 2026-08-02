import Link from "next/link";
import SearchableToolGrid from "@/components/SearchableToolGrid";
import PinnedDashboard from "@/components/PinnedDashboard";
import { AVAILABLE_TOOLS, activeCategories, getTool } from "@/lib/tools";

export default function Home() {
  const cats = activeCategories();
  const toolCount = AVAILABLE_TOOLS.length;

  const featured = [
    { tool: getTool("image-compressor"), badge: "Best Seller" },
    { tool: getTool("qr-code-generator"), badge: "New Arrival" },
  ].filter((f) => f.tool);

  return (
    <>
      {/* ---------------- Pinned dashboard (renders only when the user has pins) ---------------- */}
      <PinnedDashboard />

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-16 text-center sm:px-6 sm:pt-24">
        <div className="animate-fade-up">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: "var(--brand-soft)", color: "var(--muted)" }}
          >
            <SparkIcon />
            {toolCount} free tools · no login · private
          </span>

          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Free online tools that just work
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Compress images, edit PDFs, count words, and generate QR codes — all processed
            privately in your browser. No sign-up, no watermarks, no uploads.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="#all-tools" className="btn btn-primary px-6 py-3">
              Browse all tools
            </Link>
            <Link href="/tools/image-compressor" className="btn btn-secondary px-6 py-3">
              Try Image Compressor
              <ArrowIcon />
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[var(--muted)]">
            <Feature icon={<ShieldIcon />} label="100% in-browser" />
            <Feature icon={<BoltIcon />} label="Instant results" />
            <Feature icon={<TagIcon />} label="Always free" />
            <Feature icon={<PhoneIcon />} label="Works on mobile" />
          </ul>
        </div>
      </section>

      {/* ---------------- Categories (bento) ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">Categories</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Browse {cats.length} specialized toolkits
            </p>
          </div>
          <Link
            href="#all-tools"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            View list
            <ChevronIcon />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="card group p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-md text-lg"
                style={{ background: "var(--brand-soft)" }}
                aria-hidden
              >
                {c.icon}
              </span>
              <h3 className="mt-4 font-semibold">{c.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- Popular tools ---------------- */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28">
          <h2 className="text-2xl font-semibold tracking-tight">Popular Tools</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {featured.map(({ tool, badge }) => (
              <div
                key={tool!.slug}
                className="flex flex-col items-center gap-6 rounded-2xl border p-6 sm:flex-row sm:p-8"
                style={{ background: "var(--surface-3)", borderColor: "var(--border)" }}
              >
                <div
                  className="grid aspect-video w-full shrink-0 place-items-center overflow-hidden rounded-xl border sm:w-48"
                  style={{
                    borderColor: "var(--border)",
                    background:
                      "radial-gradient(120% 120% at 30% 0%, var(--surface) 0%, var(--surface-2) 100%)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  aria-hidden
                >
                  <span className="text-5xl">{tool!.icon}</span>
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-xs font-medium"
                    style={{ background: "var(--brand-soft)", color: "var(--muted)" }}
                  >
                    {badge}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                    {tool!.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {tool!.cardDescription}
                  </p>
                  <Link
                    href={`/tools/${tool!.slug}`}
                    className="btn btn-primary mt-5 px-5"
                  >
                    Open Tool
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- All tools (searchable) ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">All tools</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {toolCount} tools across {cats.length} categories — search or filter below.
          </p>
        </div>
        <SearchableToolGrid />
      </section>

      {/* ---------------- Trust band ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-28">
        <div className="grid gap-4 sm:grid-cols-3">
          <TrustCard
            icon={<ShieldIcon />}
            title="Private by default"
            body="Files are processed in your browser and never uploaded to a server."
          />
          <TrustCard
            icon={<BoltIcon />}
            title="Fast & lightweight"
            body="Static, mobile-first pages that load instantly and run offline-friendly."
          />
          <TrustCard
            icon={<TagIcon />}
            title="Free forever"
            body="Every core tool is free with no login, no paywall and no watermarks."
          />
        </div>
      </section>
    </>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span className="text-[var(--faint)]" aria-hidden>{icon}</span>
      {label}
    </li>
  );
}

function TrustCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-6">
      <span
        className="grid h-10 w-10 place-items-center rounded-md text-[var(--foreground)]"
        style={{ background: "var(--brand-soft)" }}
        aria-hidden
      >
        {icon}
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
    </div>
  );
}

/* ---------------- Inline icons (monochrome, currentColor) ---------------- */

function iconProps(size = 16) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function SparkIcon() {
  return (
    <svg {...iconProps(12)}>
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg {...iconProps(15)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg {...iconProps(13)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}
