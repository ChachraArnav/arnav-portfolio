"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Morph, morphNames } from "@/components/effects/morph";
import { useReduceMotion } from "@/lib/motion-pref";
import { setReelActive } from "@/lib/reel-state";
import type { Project } from "@/types/content";
import { ProjectVisual } from "./project-visual";

/**
 * Desktop-only cinematic intro to the projects: the section pins to the
 * viewport and the projects slide past horizontally as you scroll down, with a
 * progress rail and a giant outlined index per panel.
 *
 * It's a visual duplicate of the gallery below (which holds the filters, the
 * full details and is what keyboard and screen-reader users get), so the reel
 * is hidden from assistive tech and its links are taken out of the tab order.
 * Renders nothing with effects off, on small screens or on touch devices.
 */
export function ProjectReel({ projects }: { projects: Project[] }) {
  const reduce = useReduceMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const show = !reduce && enabled;
  useEffect(() => {
    setReelActive(show);
    return () => setReelActive(false);
  }, [show]);

  return show ? <Reel projects={projects} /> : null;
}

function Reel({ projects }: { projects: Project[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(eased, (v) => -v * distance);
  const rail = useTransform(eased, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={outerRef}
      aria-hidden="true"
      className="reel relative"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-page mb-8 flex items-end justify-between gap-6">
          <p className="font-mono text-2xs tracking-[0.18em] text-subtle uppercase">
            Selected work <span className="text-accent">/</span> scroll
          </p>
          <div className="h-px w-56 bg-line">
            <motion.div className="h-full bg-accent" style={{ width: rail }} />
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max gap-8 pr-[10vw] pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              tabIndex={-1}
              transitionTypes={["nav-forward"]}
              data-cursor="View"
              className="reel-panel group relative flex h-[64vh] w-[min(72vw,60rem)] shrink-0 overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface"
              style={{ "--i": i } as CSSProperties}
            >
              <span className="reel-index">{String(i + 1).padStart(2, "0")}</span>
              <div className="relative z-10 flex w-[44%] flex-col justify-between p-10">
                <div>
                  <p className="mb-4 text-xs text-subtle">{project.context}</p>
                  <h3 className="text-[clamp(2.25rem,1rem+3vw,4rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-text">
                    <Morph name={morphNames.title(project.slug)}>
                      <span className="inline-block">{project.title}</span>
                    </Morph>
                  </h3>
                  <p className="mt-5 max-w-[34ch] text-base text-muted">{project.tagline}</p>
                </div>
                <div>
                  <p className="text-xs text-subtle">
                    {project.technologies.slice(0, 6).join(" · ")}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-text">
                    Read case study
                    <ArrowUpRight
                      size={16}
                      className="text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </div>
              </div>
              <div className="reel-visual relative flex-1 border-l border-line bg-bg/50 p-10">
                <Morph name={morphNames.visual(project.slug)}>
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                    <ProjectVisual project={project} />
                  </div>
                </Morph>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
