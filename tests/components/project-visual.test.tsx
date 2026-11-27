import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectVisual } from "@/components/projects/project-visual";
import { projects } from "@/data/projects";

const base = projects[0]!;

describe("ProjectVisual", () => {
  it("shows the drawn schematic when no recording exists", () => {
    const { container } = render(<ProjectVisual project={{ ...base, video: undefined }} />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("shows a muted, labelled recording with controls when effects are off", () => {
    document.documentElement.dataset.motion = "reduce";
    render(
      <ProjectVisual
        project={{ ...base, video: { src: "/projects/demo.mp4", label: "Demo of the dashboard" } }}
      />,
    );
    const video = screen.getByLabelText("Demo of the dashboard") as HTMLVideoElement;
    expect(video.tagName).toBe("VIDEO");
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("controls");
  });

  it("only points recordings at local files", () => {
    for (const project of projects) {
      if (project.video) expect(project.video.src).toMatch(/^\/projects\//);
    }
  });
});
