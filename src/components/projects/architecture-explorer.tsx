"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReduceMotion } from "@/lib/motion-pref";
import Link from "next/link";
import { useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { connectedNodeIds } from "@/lib/projects";
import { cn } from "@/lib/utils";
import type { ArchitectureNode, Project } from "@/types/content";

interface ArchitectureExplorerProps {
  projects: Project[];
  /** Shows project tabs when more than one project is passed. */
  initialSlug?: string;
  /** Hide the "read case study" link (used on the case study page itself). */
  hideCaseStudyLink?: boolean;
  /** Heading level for the selected component, so it fits the page outline. */
  headingLevel?: "h3" | "h4";
}

export function ArchitectureExplorer({
  projects,
  initialSlug,
  hideCaseStudyLink,
  headingLevel = "h4",
}: ArchitectureExplorerProps) {
  const [slug, setSlug] = useState(initialSlug ?? projects[0]?.slug ?? "");
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (!project) return null;

  const showTabs = projects.length > 1;
  const panelId = `${baseId}-panel`;

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % projects.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + projects.length) % projects.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = projects.length - 1;
    else return;
    event.preventDefault();
    const target = projects[next];
    if (target) {
      setSlug(target.slug);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-surface">
      {showTabs ? (
        <div
          role="tablist"
          aria-label="Choose a project architecture"
          className="flex gap-1 overflow-x-auto border-b border-line px-2 pt-2"
        >
          {projects.map((p, i) => {
            const selected = p.slug === project.slug;
            return (
              <button
                key={p.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`${baseId}-tab-${p.slug}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSlug(p.slug)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={cn(
                  "relative min-h-11 shrink-0 px-4 text-sm transition-colors",
                  selected ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {p.title}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 bottom-0 h-px bg-accent transition-opacity",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        id={panelId}
        role={showTabs ? "tabpanel" : undefined}
        aria-labelledby={showTabs ? `${baseId}-tab-${project.slug}` : undefined}
        className="p-5 md:p-8"
      >
        {/* key resets the selected node when the project changes */}
        <Diagram
          key={project.slug}
          project={project}
          hideCaseStudyLink={hideCaseStudyLink}
          headingLevel={headingLevel}
        />
      </div>
    </div>
  );
}

function Diagram({
  project,
  hideCaseStudyLink,
  headingLevel: Heading,
}: {
  project: Project;
  hideCaseStudyLink?: boolean;
  headingLevel: "h3" | "h4";
}) {
  const { architecture } = project;
  const reduceMotion = useReduceMotion();
  const [selectedId, setSelectedId] = useState(architecture.nodes[0]?.id ?? "");
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const detailId = useId();

  const ordered = useMemo(
    () => [...architecture.nodes].sort((a, b) => a.layer - b.layer),
    [architecture.nodes],
  );
  const layers = useMemo(
    () =>
      architecture.layers.map((name, index) => ({
        name,
        nodes: ordered.filter((n) => n.layer === index),
      })),
    [architecture.layers, ordered],
  );

  const selected = architecture.nodes.find((n) => n.id === selectedId) ?? architecture.nodes[0];
  const connected = selected ? connectedNodeIds(project, selected.id) : new Set<string>();
  const nameOf = (id: string) => architecture.nodes.find((n) => n.id === id)?.label ?? id;
  const incoming = architecture.edges.filter((e) => e.to === selected?.id);
  const outgoing = architecture.edges.filter((e) => e.from === selected?.id);

  const focusNode = (node: ArchitectureNode | undefined) => {
    if (!node) return;
    setSelectedId(node.id);
    nodeRefs.current.get(node.id)?.focus();
  };

  // Arrow keys move through components in layer order; Home/End jump to the ends.
  const onNodeKey = (event: KeyboardEvent<HTMLButtonElement>, node: ArchitectureNode) => {
    const index = ordered.findIndex((n) => n.id === node.id);
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: ordered.length - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    focusNode(ordered[(target + ordered.length) % ordered.length]);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="mb-6 max-w-[60ch] text-sm text-muted">{architecture.summary}</p>

        <div
          role="group"
          aria-label={`${project.title} components. Use arrow keys to move between them.`}
          className="grid gap-5 sm:[grid-template-columns:var(--layer-cols)] sm:gap-3"
          style={{ "--layer-cols": `repeat(${layers.length}, minmax(0, 1fr))` } as CSSProperties}
        >
          {layers.map((layer, layerIndex) => (
            <div
              key={layer.name}
              className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-col sm:gap-3"
            >
              <p className="col-span-2 truncate text-2xs text-subtle" aria-hidden="true">
                {layer.name}
              </p>
              {layer.nodes.map((node) => {
                const isSelected = node.id === selected?.id;
                const isConnected = connected.has(node.id);
                return (
                  <button
                    key={node.id}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.id, el);
                      else nodeRefs.current.delete(node.id);
                    }}
                    type="button"
                    aria-pressed={isSelected}
                    aria-controls={detailId}
                    aria-label={`${node.label}, ${node.tech}, ${layer.name} layer`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setSelectedId(node.id)}
                    onKeyDown={(e) => onNodeKey(e, node)}
                    className={cn(
                      "relative min-h-16 rounded-[var(--radius-control)] border px-2.5 py-2.5 text-left transition-colors sm:px-3",
                      isSelected
                        ? "border-accent bg-accent-soft"
                        : isConnected
                          ? "border-signal/60 bg-signal-soft"
                          : "border-line bg-bg/40 hover:border-line-strong",
                    )}
                  >
                    <span className="block text-xs leading-snug font-medium break-words text-text sm:text-sm">
                      {node.label}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-2xs break-words",
                        isSelected || isConnected ? "text-muted" : "text-subtle",
                      )}
                    >
                      {node.tech}
                    </span>
                    {layerIndex < layers.length - 1 && isSelected && outgoing.length > 0 ? (
                      <ArrowRight
                        size={12}
                        aria-hidden
                        className="absolute top-1/2 -right-[11px] hidden -translate-y-1/2 text-accent sm:block"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p
          className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-2xs text-subtle"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] border border-accent bg-accent-soft" /> Selected
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] border border-signal/60 bg-signal-soft" />{" "}
            Directly connected
          </span>
        </p>
      </div>

      <div className="lg:col-span-5">
        <div
          id={detailId}
          aria-live="polite"
          className="h-full rounded-[var(--radius-control)] border border-line bg-bg/40 p-5"
        >
          <AnimatePresence mode="wait" initial={false}>
            {selected ? (
              <motion.div
                key={selected.id}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -4 }
                }
                transition={{ duration: 0.16 }}
              >
                <p className="text-xs text-accent">{selected.tech}</p>
                <Heading className="mt-1 text-base font-semibold text-text">
                  {selected.label}
                </Heading>
                <p className="mt-3 text-sm text-muted">{selected.role}</p>

                {incoming.length + outgoing.length > 0 ? (
                  <dl className="mt-5 space-y-2 border-t border-line pt-4 text-xs">
                    {incoming.map((edge) => (
                      <div key={`in-${edge.from}`} className="flex gap-2">
                        <dt className="flex shrink-0 items-center gap-1 text-subtle">
                          <ArrowLeft size={12} aria-hidden />
                          <span className="sr-only">Receives from</span>
                          {nameOf(edge.from)}
                        </dt>
                        <dd className="text-muted">{edge.label}</dd>
                      </div>
                    ))}
                    {outgoing.map((edge) => (
                      <div key={`out-${edge.to}`} className="flex gap-2">
                        <dt className="flex shrink-0 items-center gap-1 text-subtle">
                          <ArrowRight size={12} aria-hidden />
                          <span className="sr-only">Sends to</span>
                          {nameOf(edge.to)}
                        </dt>
                        <dd className="text-muted">{edge.label}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
          {!hideCaseStudyLink ? (
            <Link
              href={`/projects/${project.slug}#architecture`}
              className="link-underline mt-6 inline-block text-sm text-text"
            >
              Read the {project.title} case study
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
