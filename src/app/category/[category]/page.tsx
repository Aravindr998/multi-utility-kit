import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  getCategory,
  getToolsByCategory,
  SITE,
} from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  const title = `Free ${cat.name} – Online ${cat.name} | ${SITE.name}`;
  return {
    title,
    description: cat.description,
    alternates: { canonical: `/category/${cat.slug}` },
    openGraph: { title, description: cat.description, url: `${SITE.url}/category/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const tools = getToolsByCategory(cat.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-4 text-sm text-[var(--muted)]" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-[var(--foreground)]">Home</Link></li>
          <li aria-hidden>/</li>
          <li className="text-[var(--foreground)]" aria-current="page">{cat.name}</li>
        </ol>
      </nav>

      <div className="mb-8 flex items-start gap-3">
        <span className="text-4xl" aria-hidden>{cat.icon}</span>
        <div>
          <h1 className="text-3xl font-bold">Free {cat.name}</h1>
          <p className="mt-1 max-w-2xl text-[var(--muted)]">{cat.description}</p>
        </div>
      </div>

      {tools.length === 0 ? (
        <p className="text-[var(--muted)]">No tools in this category yet — check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link href="/#all-tools" className="btn btn-secondary">← Browse all tools</Link>
      </div>
    </div>
  );
}
