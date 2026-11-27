import { siteConfig } from "@/config/site";
import { education, experience } from "@/data/experience";
import type { Project } from "@/types/content";
import { absoluteUrl } from "./utils";

/** schema.org Person for the home page. Contains no phone number or address. */
export function personSchema() {
  const current = experience.find((e) => e.emphasis === "primary");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    jobTitle: "Computer Science student",
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: "CA",
    },
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
    knowsAbout: ["Software engineering", "Data analytics", "Machine learning", "Natural language processing"],
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    ...(current
      ? {
          hasOccupation: {
            "@type": "Occupation",
            name: current.role,
          },
        }
      : {}),
  };
}

/** schema.org CreativeWork for a project case study. */
export function projectSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title}: ${project.tagline}`,
    description: project.overview,
    url: absoluteUrl(siteConfig.url, `/projects/${project.slug}`),
    keywords: project.technologies.join(", "),
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    ...(project.repository.url ? { codeRepository: project.repository.url } : {}),
  };
}

/** Serializes JSON-LD safely for inline <script> tags. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
