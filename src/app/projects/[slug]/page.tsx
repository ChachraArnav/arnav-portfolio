import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, ImageIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Magnetic } from "@/components/effects/magnetic";
import { Morph, PageTransition, morphNames } from "@/components/effects/morph";
import { ScrambleText } from "@/components/effects/scramble-text";
import { GitHubIcon } from "@/components/icons/brand";
import { ArchitectureExplorer } from "@/components/projects/architecture-explorer";
import { CaseNav } from "@/components/projects/case-nav";
import { ProjectVisual } from "@/components/projects/project-visual";
import { ButtonLink } from "@/components/ui/button-link";
import { TagList } from "@/components/ui/tag";
import { getCategoryLabel, getProject, projects, statusLabels } from "@/data/projects";
import { jsonLd, projectSchema } from "@/lib/structured-data";
import type { ContentItem, Project, ProjectLink } from "@/types/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title}: case study`;
  return {
    title,
    description: project.overview,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.tagline,
      url: `/projects/${project.slug}`,
    },
    twitter: { card: "summary_large_image", title, description: project.tagline },
  };
}

function ItemList({ items }: { items: ContentItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) =>
        item.pending ? (
          <li
            key={item.text}
            className="rounded-[var(--radius-control)] border border-dashed border-line-strong px-3 py-2 text-sm text-subtle"
          >
            <span className="font-medium text-muted">To be added: </span>
            {item.text}
          </li>
        ) : (
          <li key={item.text} className="relative pl-5 text-base text-muted">
            <span aria-hidden="true" className="absolute top-[0.8em] left-0 h-px w-2.5 bg-accent" />
            {item.text}
          </li>
        ),
      )}
    </ul>
  );
}

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      id={`sec-${id}`}
      aria-labelledby={id}
      className="reveal grid gap-4 border-t border-line py-12 md:grid-cols-12"
    >
      <h2 id={id} className="text-base font-semibold text-text md:col-span-3">
        <ScrambleText text={title} />
      </h2>
      <div className="max-w-[68ch] md:col-span-8 md:col-start-5">{children}</div>
    </section>
  );
}

function LinkButton({ link, label, icon }: { link: ProjectLink; label: string; icon: ReactNode }) {
  if (link.url) {
    return (
      <ButtonLink href={link.url} external>
        {icon}
        {label}
        <span className="sr-only">(opens in a new tab)</span>
      </ButtonLink>
    );
  }
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-dashed border-line px-4 text-sm text-subtle">
      {icon}
      {link.unavailableReason ?? `${label} not available`}
    </span>
  );
}

function Neighbours({ current }: { current: Project }) {
  const index = projects.findIndex((p) => p.slug === current.slug);
  const next = projects[(index + 1) % projects.length];
  if (!next || next.slug === current.slug) return null;
  return (
    <nav aria-label="More projects" className="mt-12 border-t border-line">
      <Link
        href={`/projects/${next.slug}`}
        transitionTypes={["nav-forward"]}
        className="next-case group relative block overflow-hidden py-16 md:py-24"
      >
        <span className="container-page relative z-10 flex items-center justify-between gap-6 text-xs text-subtle">
          <span className="font-mono tracking-[0.18em] uppercase">Next case study</span>
          <span className="font-mono">
            {String(((index + 1) % projects.length) + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </span>
        <span className="container-page relative z-10 mt-6 flex items-end justify-between gap-6">
          <span className="next-case-title text-[clamp(2.75rem,1rem+7vw,8rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
            <Morph name={morphNames.title(next.slug)}>
              <span className="inline-block">{next.title}</span>
            </Morph>
          </span>
          <Magnetic strength={0.4}>
            <span className="next-case-arrow inline-flex size-16 shrink-0 items-center justify-center rounded-full border border-line-strong md:size-24">
              <ArrowUpRight size={28} aria-hidden />
            </span>
          </Magnetic>
        </span>
        <span className="container-page relative z-10 mt-4 block">
          <span className="block max-w-[60ch] text-sm text-muted">{next.tagline}</span>
        </span>
      </Link>
    </nav>
  );
}

const caseSections = (project: Project) => [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "approach", label: "Approach" },
  { id: "architecture", label: "Architecture" },
  { id: "contributions", label: project.teamScope ? "My role" : "Contributions" },
  { id: "challenges", label: "Challenges" },
  { id: "evaluation", label: "Evaluation" },
  { id: "screenshots", label: "Screenshots" },
];

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const number = String(projects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, "0");

  return (
    <PageTransition>
      <article className="pt-10 pb-0 md:pt-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(projectSchema(project)) }}
        />

        <div className="container-page">
          <Link
            href="/#projects"
            transitionTypes={["nav-back"]}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-text"
          >
            <ArrowLeft size={15} aria-hidden />
            All projects
          </Link>

          <header className="pt-8 pb-12">
            <p className="fade-in mb-5 flex items-center gap-3 text-sm text-subtle">
              <span className="font-mono text-accent">{number}</span>
              <span className="h-px w-10 bg-line-strong" aria-hidden="true" />
              {project.context}
              {project.status ? `, ${statusLabels[project.status].toLowerCase()}` : ""}
            </p>
            <h1 className="text-[clamp(3rem,1.25rem+7vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-text">
              <Morph name={morphNames.title(project.slug)}>
                <span className="inline-block">{project.title}</span>
              </Morph>
            </h1>
            <div
              className="fade-in mt-8 grid gap-8 md:grid-cols-12"
              style={{ "--d": "200ms" } as CSSProperties}
            >
              <p className="max-w-[56ch] text-lg text-muted md:col-span-7">{project.tagline}</p>
              <div className="flex flex-wrap content-start gap-3 md:col-span-5 md:justify-end">
                <LinkButton
                  link={project.repository}
                  label="Repository"
                  icon={<GitHubIcon size={15} />}
                />
                <LinkButton
                  link={project.demo}
                  label="Live demo"
                  icon={<ArrowUpRight size={15} aria-hidden />}
                />
              </div>
            </div>
          </header>

          <div className="case-visual relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface">
            <span className="case-visual-index" aria-hidden="true">
              {number}
            </span>
            <Morph name={morphNames.visual(project.slug)}>
              <div className="relative aspect-[16/9] w-full p-6 sm:aspect-[2.2/1] md:p-12">
                <ProjectVisual project={project} controls />
              </div>
            </Morph>
            {project.video ? null : (
              <span className="absolute right-4 bottom-3 text-2xs text-subtle">
                Schematic, screenshots and demo to be added
              </span>
            )}
          </div>

          <dl className="mt-px grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line text-sm sm:grid-cols-3">
            <div className="bg-bg px-5 py-5">
              <dt className="text-xs text-subtle">Domain</dt>
              <dd className="mt-1 text-muted">{project.domain}</dd>
            </div>
            <div className="bg-bg px-5 py-5">
              <dt className="text-xs text-subtle">Categories</dt>
              <dd className="mt-1 text-muted">
                {project.categories.map(getCategoryLabel).join(", ")}
              </dd>
            </div>
            <div className="bg-bg px-5 py-5">
              <dt className="mb-2 text-xs text-subtle">Technologies</dt>
              <dd>
                <TagList items={project.technologies} label={`${project.title} technologies`} />
              </dd>
            </div>
          </dl>

          <div className="mt-16 grid gap-x-10 lg:grid-cols-12">
            <div className="hidden lg:col-span-2 lg:block">
              <CaseNav sections={caseSections(project)} />
            </div>
            <div className="lg:col-span-10">
              <CaseSection id="overview" title="Overview">
                <p className="text-base text-text">{project.overview}</p>
              </CaseSection>

              <CaseSection id="problem" title="Problem">
                <p className="text-base text-muted">{project.problem}</p>
              </CaseSection>

              <CaseSection id="approach" title="Technical approach">
                <ItemList items={project.approach} />
              </CaseSection>

              <section
                id="sec-architecture"
                aria-labelledby="architecture"
                className="border-t border-line py-12"
              >
                <h2 id="architecture" className="mb-6 text-base font-semibold text-text">
                  Architecture
                </h2>
                <ArchitectureExplorer projects={[project]} hideCaseStudyLink headingLevel="h3" />
              </section>

              {project.teamScope ? (
                <CaseSection id="contributions" title="Team scope and my role">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-text">What the team built</h3>
                      <ItemList items={project.teamScope} />
                    </div>
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-text">What I worked on</h3>
                      <ItemList items={project.contributions} />
                    </div>
                  </div>
                </CaseSection>
              ) : (
                <CaseSection id="contributions" title="My contributions">
                  <ItemList items={project.contributions} />
                </CaseSection>
              )}

              <CaseSection id="challenges" title="Challenges and considerations">
                <ItemList items={project.challenges} />
              </CaseSection>

              <CaseSection id="evaluation" title="Testing and evaluation">
                <ItemList items={project.evaluation} />
              </CaseSection>

              <CaseSection id="screenshots" title="Screenshots">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {project.screenshots.map((shot) => (
                    <li key={shot.caption}>
                      <figure>
                        {shot.src ? (
                          <Image
                            src={shot.src}
                            alt={shot.alt}
                            width={shot.width ?? 1600}
                            height={shot.height ?? 1000}
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="h-auto w-full rounded-[var(--radius-control)] border border-line"
                          />
                        ) : (
                          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-[var(--radius-control)] border border-dashed border-line-strong text-center text-xs text-subtle">
                            <ImageIcon size={18} aria-hidden />
                            Screenshot to be added
                          </div>
                        )}
                        <figcaption className="mt-2 text-xs text-subtle">{shot.caption}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </CaseSection>
            </div>
          </div>
        </div>

        <Neighbours current={project} />
      </article>
    </PageTransition>
  );
}
