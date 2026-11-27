import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { siteConfig } from "@/config/site";
import { externalRel } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-line">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          {siteConfig.name}, {siteConfig.location.display}
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <li>
              <Link href="/quick-view" className="link-underline hover:text-text">
                Quick view
              </Link>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="link-underline hover:text-text">
                Email
              </a>
            </li>
            <li>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel={externalRel}
                className="inline-flex items-center gap-1.5 hover:text-text"
              >
                <GitHubIcon size={14} />
                GitHub
              </a>
            </li>
            <li>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel={externalRel}
                className="inline-flex items-center gap-1.5 hover:text-text"
              >
                <LinkedInIcon size={14} />
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
        <p className="text-xs text-subtle">
          Built with Next.js and TypeScript.{" "}
          <span className="hidden sm:inline">
            Press <kbd className="font-mono">Ctrl K</kbd> to search.
          </span>
        </p>
      </div>
    </footer>
  );
}
