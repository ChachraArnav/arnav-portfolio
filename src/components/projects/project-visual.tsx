"use client";

import { useEffect, useRef } from "react";
import { useReduceMotion } from "@/lib/motion-pref";
import type { Project } from "@/types/content";
import { ProjectPreview } from "./project-preview";

/**
 * A project's visual: its screen recording when one exists, otherwise the
 * code-drawn schematic. Recordings autoplay muted and looped only while
 * effects are on and they're on screen; with effects off they show the poster
 * with normal controls so nothing moves unless the visitor presses play.
 */
export function ProjectVisual({
  project,
  controls = false,
}: {
  project: Project;
  controls?: boolean;
}) {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const video = project.video;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void el.play().catch(() => {});
      else el.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  if (!video) return <ProjectPreview kind={project.preview} />;

  // The video is absolutely positioned so its intrinsic 1280x800 size can never
  // stretch the card. iOS Safari otherwise sizes the box from the video and the
  // page overflows sideways.
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-control)]">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        aria-label={video.label}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduce || controls}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
