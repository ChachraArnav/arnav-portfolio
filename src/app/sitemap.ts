import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl(siteConfig.url, "/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl(siteConfig.url, "/quick-view"), changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((project) => ({
      url: absoluteUrl(siteConfig.url, `/projects/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
