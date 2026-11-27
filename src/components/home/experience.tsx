import { ChevronDown } from "lucide-react";
import { Tilt } from "@/components/effects/tilt";
import { SectionHeading } from "@/components/ui/section-heading";
import { TagList } from "@/components/ui/tag";
import { experience, formatPeriod } from "@/data/experience";

export function Experience() {
  const primary = experience.filter((e) => e.emphasis === "primary");
  const secondary = experience.filter((e) => e.emphasis === "secondary");

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="section border-t border-line"
    >
      <div className="container-page">
        <SectionHeading id="experience-title" title="Experience" index="02">
          <p>
            Technical work first. Customer-facing roles below, where I learned to lead a shift and
            solve problems with people waiting.
          </p>
        </SectionHeading>

        <div className="relative md:pl-12">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] hidden w-px bg-line md:block"
          >
            <div className="timeline-fill h-full w-full bg-accent" />
          </div>
          <ol className="space-y-6">
            {primary.map((entry) => {
              const period = formatPeriod(entry.start, entry.end);
              return (
                <li key={entry.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-10 -left-12 hidden size-[15px] rounded-full border border-accent bg-bg ring-4 ring-bg md:block"
                  >
                    <span className="absolute inset-[4px] rounded-full bg-accent" />
                  </span>
                  <Tilt max={3}>
                    <article
                      aria-labelledby={`${entry.id}-title`}
                      className="reveal grid gap-8 rounded-[var(--radius-panel)] border border-line bg-surface p-6 md:grid-cols-12 md:p-10"
                    >
                      <header className="md:col-span-4">
                        {period ? (
                          <p className="mb-3 text-xs text-subtle">
                            <time dateTime={entry.start ?? undefined}>
                              {period.split(" – ")[0]}
                            </time>
                            {" – "}
                            <time dateTime={entry.end ?? undefined}>{period.split(" – ")[1]}</time>
                          </p>
                        ) : null}
                        <h3
                          id={`${entry.id}-title`}
                          className="text-lg font-semibold tracking-tight text-text"
                        >
                          {entry.role}
                        </h3>
                        <p className="mt-1 text-sm text-muted">{entry.organization}</p>
                        {entry.division ? (
                          <p className="text-sm text-subtle">{entry.division}</p>
                        ) : null}
                        <div className="mt-6">
                          <TagList
                            items={entry.technologies}
                            label={`Technologies used at ${entry.organization}`}
                          />
                        </div>
                      </header>
                      <div className="md:col-span-7 md:col-start-6">
                        <p className="text-base text-text">{entry.summary}</p>
                        <ul className="mt-6 space-y-3">
                          {entry.highlights.map((item) => (
                            <li key={item} className="relative pl-5 text-sm text-muted">
                              <span
                                aria-hidden="true"
                                className="absolute top-[0.7em] left-0 h-px w-2.5 bg-accent"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </Tilt>
                </li>
              );
            })}
          </ol>

          <ul className="mt-6 divide-y divide-line border-y border-line">
            {secondary.map((entry) => {
              const period = formatPeriod(entry.start, entry.end);
              return (
                <li key={entry.id} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-[1.65rem] -left-12 hidden size-[15px] rounded-full border border-line-strong bg-bg ring-4 ring-bg md:block"
                  />
                  <details className="group">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="flex-1 sm:flex sm:items-baseline sm:gap-3">
                        <span className="block text-sm font-medium text-text">{entry.role}</span>
                        <span className="block text-sm text-muted">{entry.organization}</span>
                      </span>
                      {period ? (
                        <span className="hidden text-xs text-subtle sm:block">{period}</span>
                      ) : null}
                      <ChevronDown
                        size={16}
                        aria-hidden
                        className="shrink-0 text-subtle transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <div className="pb-5 md:grid md:grid-cols-12">
                      <div className="md:col-span-7 md:col-start-6">
                        <p className="text-sm text-muted">{entry.summary}</p>
                        {entry.strengths?.length ? (
                          <div className="mt-3">
                            <TagList
                              items={entry.strengths}
                              label={`Strengths from ${entry.organization}`}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
