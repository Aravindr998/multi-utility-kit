import type { MetadataRoute } from "next";
import { AVAILABLE_TOOLS, activeCategories, SITE } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/about", "/privacy"].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.5,
  }));

  const categoryPages = activeCategories().map((c) => ({
    url: `${SITE.url}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toolPages = AVAILABLE_TOOLS.map((t) => ({
    url: `${SITE.url}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
