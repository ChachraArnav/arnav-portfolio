/**
 * Central site configuration.
 *
 * Personal details, links and availability live here and nowhere else.
 * Update this file (not components) when anything about you changes.
 */

const FALLBACK_SITE_URL = "https://arnavchachra.vercel.app";

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  // Vercel sets this automatically for production deployments.
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return `https://${vercelProd}`;
  return FALLBACK_SITE_URL;
}

export const siteConfig = {
  name: "Arnav Chachra",
  shortName: "Arnav",
  initials: "AC",
  title: "Arnav Chachra — Software, data and AI engineering",
  headline: "Building software. Making data useful.",
  description:
    "Computer Science student at Lakehead University building software, data pipelines and AI-assisted tools. Previously a Data Analytics Technician co-op at the Regional Municipality of York.",
  intro:
    "I'm a Computer Science student who works across software engineering, data analytics and AI-powered applications. I like taking a messy operational problem and turning it into a tool people can actually rely on.",
  url: resolveSiteUrl(),
  locale: "en_CA",
  location: {
    city: "Barrie",
    region: "Ontario",
    country: "Canada",
    display: "Barrie, Ontario",
  },
  email: "chachraarnav@gmail.com",
  links: {
    github: "https://github.com/chachraarnav",
    linkedin: "https://www.linkedin.com/in/arnav-chachra-0166222b0/",
  },
  githubUsername: "chachraarnav",
  availability: {
    open: true,
    /** Kept deliberately specific so it never implies immediate availability. */
    label: "Exploring new-grad roles for 2027",
    detail: "Graduating April 2027 · open to full-time roles starting after graduation",
  },
  targetRoles: [
    "Software Engineer",
    "Full-Stack Developer",
    "Data Analyst",
    "Data Engineer",
    "AI Engineer",
    "Technical Consultant",
    "Technical Solutions Engineer",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Sections on the home page, in order. Drives the nav and command palette. */
export const sections = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
