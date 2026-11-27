import { Magnetic } from "@/components/effects/magnetic";
import { PointerField } from "@/components/effects/pointer-field";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { siteConfig } from "@/config/site";
import { externalRel } from "@/lib/utils";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="section relative overflow-hidden border-t border-line"
    >
      <PointerField />
      <div className="pointer-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="container-page relative mb-12 flex items-center gap-4 font-mono text-2xs text-subtle md:mb-16"
        aria-hidden="true"
      >
        <span className="text-accent">04</span>
        <span className="section-rule h-px flex-1 bg-line-strong" />
        <span className="tracking-[0.18em] uppercase">Contact</span>
      </div>
      <div className="reveal container-page relative grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2
            id="contact-title"
            className="text-2xl font-semibold tracking-[-0.03em] text-text md:text-[3.25rem] md:leading-[1.02]"
          >
            Let&apos;s talk about 2027.
          </h2>
          <p className="mt-6 max-w-[48ch] text-base text-muted">
            I&apos;m looking for new-grad roles in software, data and AI engineering that start
            after I graduate in April 2027. Email is the fastest way to reach me.
          </p>
          <div className="mt-12 hidden md:block">
            <Magnetic strength={0.35}>
              <a
                href={`mailto:${siteConfig.email}`}
                data-cursor="Email"
                className="orbit-badge group relative flex size-40 items-center justify-center rounded-full"
              >
                <svg
                  viewBox="0 0 160 160"
                  className="orbit-text absolute inset-0"
                  aria-hidden="true"
                >
                  <defs>
                    <path
                      id="orbit-path"
                      d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"
                    />
                  </defs>
                  <text>
                    <textPath
                      href="#orbit-path"
                      startOffset="0"
                      textLength="386"
                      lengthAdjust="spacing"
                    >
                      SEND AN EMAIL · SEND AN EMAIL · SEND AN EMAIL ·
                    </textPath>
                  </text>
                </svg>
                <span className="orbit-core flex size-20 items-center justify-center rounded-full bg-accent text-bg transition-transform duration-500 group-hover:scale-110">
                  <Mail size={22} aria-hidden />
                </span>
                <span className="sr-only">Email {siteConfig.email}</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <a
            href={`mailto:${siteConfig.email}`}
            className="group flex items-center gap-3 border-b border-line-strong pb-4 text-lg font-medium break-all text-text transition-colors hover:border-accent sm:text-xl"
          >
            <Mail size={20} aria-hidden className="shrink-0 text-accent" />
            {siteConfig.email}
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${siteConfig.email}`} variant="primary">
              Send an email
            </ButtonLink>
            <CopyEmailButton email={siteConfig.email} />
          </div>

          <ul className="mt-10 divide-y divide-line border-y border-line text-sm">
            <li>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel={externalRel}
                className="flex min-h-14 items-center gap-3 text-muted transition-colors hover:text-text"
              >
                <LinkedInIcon size={16} />
                LinkedIn
                <span className="ml-auto text-xs text-subtle">Connect</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel={externalRel}
                className="flex min-h-14 items-center gap-3 text-muted transition-colors hover:text-text"
              >
                <GitHubIcon size={16} />
                GitHub
                <span className="ml-auto text-xs text-subtle">
                  github.com/{siteConfig.githubUsername}
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
