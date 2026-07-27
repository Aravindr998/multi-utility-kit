import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AVAILABLE_TOOLS, getTool, SITE } from "@/lib/tools";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolRenderer from "@/tools/ToolRenderer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return AVAILABLE_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `${SITE.url}/tools/${tool.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  // FAQ + SoftwareApplication structured data for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web browser)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: tool.description,
        url: `${SITE.url}/tools/${tool.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageLayout tool={tool}>
        <ToolRenderer slug={tool.slug} />
      </ToolPageLayout>
    </>
  );
}
