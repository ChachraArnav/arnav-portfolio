import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { siteConfig } from "@/config/site";
import { education, experience, formatPeriod } from "@/data/experience";
import { projects } from "@/data/projects";
import { coreSkills } from "@/data/skills";
import { externalRel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Recruiter quick view",
  description: `One-page summary of ${siteConfig.name}: education, experience, skills, projects and contact details.`,
  alternates: { canonical: "/quick-view" },
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
      <h2 className="text-sm font-medium text-subtle">{label}</h2>
      <div className="min-w-0 text-sm text-muted">{children}</div>
    </div>
  );
}

export default function QuickViewPage() {
  const primary = experience.filter((e) => e.emphasis === "primary");
  const secondary = experience.filter((e) => e.emphasis === "secondary");
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="container-page max-w-4xl py-12 md:py-16">
      <header className="flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm text-subtle">Recruiter quick view</p>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text">{siteConfig.name}</h1>
          <p className="mt-2 text-base text-muted">
            Computer Science, Lakehead University. Graduating April 2027.{" "}
            {siteConfig.location.display}.
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <ButtonLink href={`mailto:${siteConfig.email}`} variant="primary">
            <Mail size={15} aria-hidden />
            Email me
          </ButtonLink>
          <CopyEmailButton email={siteConfig.email} />
        </div>
      </header>

      <Row label="Looking for">
        <p className="text-text">{siteConfig.availability.label}.</p>
        <p className="mt-1">{siteConfig.targetRoles.join(", ")}.</p>
      </Row>

      <Row label="Education">
        <ul className="space-y-2">
          {education.map((e) => (
            <li key={e.id}>
              <span className="text-text">{e.credential}</span>, {e.institution}.{" "}
              <span className="text-subtle">{e.status}</span>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Relevant experience">
        {primary.map((e) => (
          <div key={e.id}>
            <p className="text-text">
              {e.role}, {e.organization}
            </p>
            <p className="text-subtle">
              {e.division}
              {formatPeriod(e.start, e.end) ? `, ${formatPeriod(e.start, e.end)}` : ""}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-line-strong">
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-4">
          Also: {secondary.map((e) => `${e.role}, ${e.organization}`).join("; ")}.
        </p>
      </Row>

      <Row label="Core skills">
        <p className="text-text">{coreSkills.join(", ")}</p>
      </Row>

      <Row label="Featured projects">
        <ul className="space-y-3">
          {featured.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="link-underline text-text">
                {p.title}
              </Link>{" "}
              <span className="text-subtle">({p.context.toLowerCase()})</span>
              <p>{p.tagline}</p>
            </li>
          ))}
        </ul>
      </Row>

      <Row label="Contact">
        <ul className="space-y-2">
          <li>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 text-text hover:text-accent"
            >
              <Mail size={14} aria-hidden />
              {siteConfig.email}
            </a>
          </li>
          <li>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel={externalRel}
              className="inline-flex items-center gap-2 hover:text-text"
            >
              <LinkedInIcon size={14} />
              LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel={externalRel}
              className="inline-flex items-center gap-2 hover:text-text"
            >
              <GitHubIcon size={14} />
              github.com/{siteConfig.githubUsername}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </Row>
    </div>
  );
}
