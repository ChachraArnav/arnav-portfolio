import { Suspense } from "react";
import { ArchitectureExplorer } from "@/components/projects/architecture-explorer";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectReel } from "@/components/projects/project-reel";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/data/projects";
import { GitHubActivity, GitHubActivitySkeleton } from "./github-activity";

export function ProjectsSection() {
  const withArchitecture = projects.filter((p) => p.architecture.nodes.length > 0);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="section border-t border-line"
    >
      <div className="container-page">
        <SectionHeading id="projects-title" title="Projects" index="03">
          <p>
            Each project has a case study covering the problem, the architecture, what I built and
            what was hard about it. Team projects separate my work from the team&apos;s.
          </p>
        </SectionHeading>
      </div>

      <ProjectReel projects={projects} />

      <div className="container-page">
        <ProjectGallery projects={projects} />

        <div className="mt-24" id="architecture">
          <h3 className="text-lg font-semibold tracking-tight text-text">Architecture explorer</h3>
          <p className="mt-2 mb-8 max-w-[60ch] text-sm text-muted">
            Pick a project, then select a component to see what it&apos;s responsible for in that
            system and what it connects to.
          </p>
          <ArchitectureExplorer projects={withArchitecture} initialSlug="interview-mirror" />
        </div>

        <div className="mt-24">
          <h3 className="text-lg font-semibold tracking-tight text-text">Recently on GitHub</h3>
          <p className="mt-2 mb-8 max-w-[60ch] text-sm text-muted">
            Public projects, most recently updated first.
          </p>
          <Suspense fallback={<GitHubActivitySkeleton />}>
            <GitHubActivity />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
