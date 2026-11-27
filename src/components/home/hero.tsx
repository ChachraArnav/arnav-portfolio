import { ArrowDown, GraduationCap, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { ParticleField } from "@/components/effects/particle-field-gate";
import { PointerField } from "@/components/effects/pointer-field";
import { GitHubIcon } from "@/components/icons/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";
import { heroFacts } from "@/data/facts";
import { SystemGraph } from "./system-graph";

/** Splits a word into letters that rise in one after another. Screen readers get the plain word. */
function RisingWord({ word, offset }: { word: string; offset: number }) {
  return (
    <span className="rise-line" aria-hidden="true">
      {[...word].map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="rise-letter"
          style={{ "--i": offset + i } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

/** The headline with the last word underlined by a drawn stroke. */
function Headline({ text }: { text: string }) {
  const trimmed = text.replace(/\.$/, "");
  const cut = trimmed.lastIndexOf(" ");
  const lead = trimmed.slice(0, cut + 1);
  const last = trimmed.slice(cut + 1);
  return (
    <>
      {lead}
      <span className="scribble">
        {last}
        <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} d="M1 7 C 20 3, 40 3, 58 5.5 S 88 8, 99 3" />
        </svg>
      </span>
      .
    </>
  );
}

export function Hero() {
  const [first, last] = [siteConfig.name.split(" ")[0] ?? "", siteConfig.name.split(" ")[1] ?? ""];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <PointerField />
      <div className="aurora" aria-hidden="true" />
      <div className="grid-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-lit pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <ParticleField />

      <div className="container-page relative grid gap-14 pt-14 pb-16 md:pt-20 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-20">
        <div className="hero-exit lg:col-span-6">
          {siteConfig.availability.open ? (
            <p
              className="fade-in mb-8 inline-flex items-center gap-2.5 rounded-[var(--radius-control)] border border-line bg-surface/60 px-3 py-1.5 text-xs text-muted"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="relative flex size-2" aria-hidden="true">
                <span className="ping-thrice absolute inline-flex size-full rounded-full bg-positive opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-positive" />
              </span>
              {siteConfig.availability.label}
            </p>
          ) : null}

          <h1
            id="hero-title"
            className="text-display font-semibold tracking-[-0.045em] text-text"
            aria-label={siteConfig.name}
          >
            <RisingWord word={first} offset={0} />
            <RisingWord word={last} offset={first.length + 1} />
          </h1>

          <p
            className="fade-in mt-8 text-lg font-medium tracking-[-0.01em] text-text md:text-xl"
            style={{ "--d": "450ms" } as CSSProperties}
          >
            <Headline text={siteConfig.headline} />
          </p>
          <p
            className="fade-in mt-4 max-w-[52ch] text-base text-muted"
            style={{ "--d": "550ms" } as CSSProperties}
          >
            {siteConfig.intro}
          </p>

          <div
            className="fade-in mt-9 flex flex-wrap gap-3"
            style={{ "--d": "650ms" } as CSSProperties}
          >
            <Magnetic>
              <ButtonLink href="/#projects" variant="primary" className="group">
                Explore my work
                <ArrowDown
                  size={15}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/#contact">
                <Mail size={15} aria-hidden />
                Get in touch
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href={siteConfig.links.github} external variant="ghost">
                <GitHubIcon size={15} />
                View GitHub
                <span className="sr-only">(opens in a new tab)</span>
              </ButtonLink>
            </Magnetic>
          </div>

          <ul
            className="fade-in mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-subtle"
            style={{ "--d": "750ms" } as CSSProperties}
          >
            <li className="inline-flex items-center gap-1.5">
              <GraduationCap size={14} aria-hidden />
              BSc Computer Science, Lakehead, April 2027
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden />
              {siteConfig.location.display}
            </li>
            <li>
              <Link href="/quick-view" className="link-underline text-muted hover:text-text">
                Recruiter? See the 30-second summary
              </Link>
            </li>
          </ul>
        </div>

        <div
          className="fade-in hidden md:block lg:col-span-6 lg:pt-10"
          style={{ "--d": "300ms" } as CSSProperties}
        >
          <div className="hero-exit-graph">
            <SystemGraph />
          </div>
        </div>
      </div>

      <div className="container-page relative pb-14 lg:pb-16">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-4">
          {heroFacts.map((fact, i) => (
            <div
              key={fact.label}
              className="fade-in flex flex-col bg-bg/90 px-5 py-6 md:px-6 md:py-7"
              style={{ "--d": `${850 + i * 90}ms` } as CSSProperties}
            >
              <dt className="order-2 mt-2 text-xs text-subtle">{fact.label}</dt>
              <dd className="text-2xl font-semibold tracking-[-0.03em] text-text tabular-nums md:text-[2.75rem] md:leading-none">
                <span className="sr-only">{fact.value}</span>
                <span
                  aria-hidden="true"
                  className="count"
                  style={
                    {
                      "--to": fact.value,
                      "--from": fact.from ?? 0,
                      "--d": `${900 + i * 120}ms`,
                    } as CSSProperties
                  }
                />
                {fact.suffix ? (
                  <span aria-hidden="true" className="text-accent">
                    {fact.suffix}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
