import { navigationState } from "../setup/next-navigation";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommandPaletteProvider } from "@/components/command/command-palette-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { ArchitectureExplorer } from "@/components/projects/architecture-explorer";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";

describe("Project gallery filters", () => {
  it("shows every project by default with All pressed", () => {
    render(<ProjectGallery projects={projects} />);
    expect(screen.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("article")).toHaveLength(projects.length);
  });

  it("filters to one category and announces the result", async () => {
    const user = userEvent.setup();
    render(<ProjectGallery projects={projects} />);
    const fullStack = screen.getByRole("button", { name: /^Full-stack/ });
    await user.click(fullStack);

    expect(fullStack).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "false");
    await waitFor(() => {
      const links = screen.getAllByRole("link", { name: /EMAK|MarketLens|Academic|NutriTrack/ });
      expect(links.map((l) => l.textContent)).toEqual(["EMAK Solutions"]);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Showing 1 project in Full-stack");
  });

  it("links every card to its case study URL", () => {
    render(<ProjectGallery projects={projects} />);
    for (const project of projects) {
      expect(screen.getByRole("link", { name: project.title })).toHaveAttribute(
        "href",
        `/projects/${project.slug}`,
      );
    }
  });
});

describe("Site header", () => {
  afterEach(() => {
    navigationState.pathname = "/";
  });

  function renderHeader() {
    return render(
      <CommandPaletteProvider>
        <SiteHeader />
      </CommandPaletteProvider>,
    );
  }

  it("has a skip link and links to every section, and no resume link", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    for (const label of ["About", "Experience", "Projects", "Contact"]) {
      expect(within(nav).getByRole("link", { name: label })).toHaveAttribute(
        "href",
        `/#${label.toLowerCase()}`,
      );
    }
    expect(screen.queryByRole("link", { name: /resume/i })).not.toBeInTheDocument();
  });

  it("switches animated effects on and off from the header", async () => {
    document.documentElement.dataset.motion = "reduce";
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: "Animated effects" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset.motion).toBe("full");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(localStorage.getItem("motion")).toBe("reduce");
  });

  it("marks Projects as current on a case study page", () => {
    navigationState.pathname = "/projects/marketlens";
    renderHeader();
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  it("opens the mobile menu, then closes it with Escape and restores focus", async () => {
    const user = userEvent.setup();
    renderHeader();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).not.toBeVisible();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Close menu");
    expect(document.getElementById("mobile-menu")).toBeVisible();

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});

describe("Architecture explorer", () => {
  const emak = projects.find((p) => p.slug === "emak-solutions")!;

  it("explains what a component does in this specific project", async () => {
    const user = userEvent.setup();
    render(<ArchitectureExplorer projects={[emak]} hideCaseStudyLink />);
    await user.click(screen.getByRole("button", { name: /Database, PostgreSQL/ }));
    expect(screen.getByRole("button", { name: /Database, PostgreSQL/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      await screen.findByText(/Stores EMAK's users, roles, projects, tasks/),
    ).toBeInTheDocument();
  });

  it("moves between components with arrow keys using a roving tab index", async () => {
    const user = userEvent.setup();
    render(<ArchitectureExplorer projects={[emak]} hideCaseStudyLink />);
    const first = screen.getByRole("button", { name: /Web client/ });
    expect(first).toHaveAttribute("tabindex", "0");

    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    const api = screen.getByRole("button", { name: /REST API/ });
    expect(api).toHaveFocus();
    expect(api).toHaveAttribute("aria-pressed", "true");
    expect(first).toHaveAttribute("tabindex", "-1");
    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: /Database/ })).toHaveFocus();
  });

  it("switches project with arrow keys on the tab list", async () => {
    const user = userEvent.setup();
    render(<ArchitectureExplorer projects={projects} initialSlug="emak-solutions" />);
    const tab = screen.getByRole("tab", { name: "EMAK Solutions" });
    expect(tab).toHaveAttribute("aria-selected", "true");
    tab.focus();
    await user.keyboard("{ArrowRight}");
    const next = screen.getByRole("tab", { name: "Academic Decoder" });
    expect(next).toHaveFocus();
    expect(next).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Language analysis");
  });
});

describe("Copy email button", () => {
  it("copies the address and announces success", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CopyEmailButton email={siteConfig.email} />);
    await user.click(screen.getByRole("button", { name: /Copy email address/ }));
    expect(writeText).toHaveBeenCalledWith(siteConfig.email);
    expect(await screen.findByRole("status")).toHaveTextContent("Email address copied");
    writeText.mockRestore();
  });

  it("announces the address itself when copying fails", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockRejectedValue(new Error("denied"));
    render(<CopyEmailButton email={siteConfig.email} />);
    await user.click(screen.getByRole("button", { name: /Copy email address/ }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      `Couldn't copy automatically. The address is ${siteConfig.email}`,
    );
    writeText.mockRestore();
  });
});

describe("Theme toggle", () => {
  it("switches theme, stores the choice and updates its label", async () => {
    const user = userEvent.setup();
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });
});
