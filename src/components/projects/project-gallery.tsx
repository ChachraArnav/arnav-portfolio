"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useReduceMotion } from "@/lib/motion-pref";
import Link from "next/link";
import { useMemo, useState, type PointerEvent } from "react";
import { categories, getCategoryLabel, statusLabels } from "@/data/projects";
import { countByCategory, filterProjects, type CategoryFilter } from "@/lib/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";
import { Morph, morphNames } from "@/components/effects/morph";
import { Tilt } from "@/components/effects/tilt";
import { useReelActive } from "@/lib/reel-state";
import { ProjectVisual } from "./project-visual";

interface ProjectGalleryProps {
  projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const reduceMotion = useReduceMotion();
  const visible = useMemo(() => filterProjects(projects, filter), [projects, filter]);
  const counts = useMemo(() => countByCategory(projects), [projects]);

  const filters: Array<{ id: CategoryFilter; label: string }> = [
    { id: "all", label: "All" },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="-mx-[var(--space-gutter)] mb-8 flex gap-2 overflow-x-auto px-[var(--space-gutter)] pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters.map((f) => {
          const pressed = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(f.id)}
              disabled={counts[f.id] === 0}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[var(--radius-control)] border px-3.5 text-sm transition-colors disabled:opacity-40",
                pressed
                  ? "border-accent bg-accent-soft text-text"
                  : "border-line text-muted hover:border-line-strong hover:text-text",
              )}
            >
              {f.label}
              <span className={cn("text-2xs", pressed ? "text-accent" : "text-subtle")}>
                {counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {`Showing ${visible.length} ${visible.length === 1 ? "project" : "projects"}${
          filter === "all" ? "" : ` in ${getCategoryLabel(filter)}`
        }`}
      </p>

      <LayoutGroup>
        <ul className="grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => {
              // First card spans the row; the last one does too when it would otherwise sit alone.
              const lastAlone = index === visible.length - 1 && (visible.length - 1) % 2 === 1;
              const wide = visible.length > 2 && (index === 0 || lastAlone);
              return (
                <motion.li
                  key={project.slug}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { opacity: 0, scale: 0.98 }
                  }
                  transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                  className={cn(wide && "md:col-span-2")}
                >
                  <Tilt className="h-full" max={wide ? 2.5 : 4}>
                    <ProjectCard project={project} wide={wide} index={index} />
                  </Tilt>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </div>
  );
}

/** Feeds the pointer position to the card's CSS spotlight. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

function ProjectCard({ project, wide, index }: { project: Project; wide: boolean; index: number }) {
  // The reel carries the morph names while it's showing; names must be unique.
  const morph = !useReelActive();
  return (
    <article
      onPointerMove={trackPointer}
      data-cursor="View"
      className={cn(
        "spotlight group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface transition-colors hover:border-line-strong",
        wide && "md:flex-row",
      )}
    >
      <div
        className={cn(
          "relative border-b border-line bg-bg/40 p-6",
          wide
            ? "aspect-[2.3/1] md:aspect-auto md:w-1/2 md:border-r md:border-b-0 md:p-10"
            : "aspect-[2.3/1]",
        )}
      >
        <Morph name={morphNames.visual(project.slug)} enabled={morph}>
          <div className="lift h-full w-full">
            <ProjectVisual project={project} />
          </div>
        </Morph>
        <span
          aria-hidden="true"
          className="absolute top-3 left-4 font-mono text-2xs text-subtle transition-colors group-hover:text-accent"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute right-3 bottom-2 text-2xs text-subtle">Schematic</span>
      </div>
      <div className={cn("flex flex-1 flex-col p-6", wide && "md:p-10")}>
        <p className="mb-3 text-xs text-subtle">
          {project.context}
          {project.status ? (
            <span className="text-muted">, {statusLabels[project.status].toLowerCase()}</span>
          ) : null}
        </p>
        <h3 className={cn("font-semibold tracking-tight text-text", wide ? "text-xl" : "text-lg")}>
          <Link
            href={`/projects/${project.slug}`}
            transitionTypes={["nav-forward"]}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            <Morph name={morphNames.title(project.slug)} enabled={morph}>
              <span className="inline-block">{project.title}</span>
            </Morph>
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">{project.tagline}</p>
        <p className="mt-5 text-xs text-subtle">
          {project.technologies.slice(0, wide ? 8 : 5).join(", ")}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm text-text">
          Read case study
          <ArrowUpRight
            size={15}
            aria-hidden
            className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          />
        </span>
      </div>
      {/* Focus ring for the stretched link */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-panel)] ring-accent group-has-[:focus-visible]:ring-2"
      />
    </article>
  );
}
