import { describe, expect, it } from "vitest";
import { traceGraph } from "@/components/home/system-graph";
import { projects } from "@/data/projects";
import { buildCommands, searchCommands } from "@/lib/commands";
import { toRepoSummaries } from "@/lib/github";
import { connectedNodeIds, countByCategory, filterProjects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/utils";

describe("filterProjects", () => {
  it("returns everything for 'all', featured first", () => {
    const result = filterProjects(projects, "all");
    expect(result).toHaveLength(projects.length);
    const firstNonFeatured = result.findIndex((p) => !p.featured);
    const lastFeatured = result.map((p) => p.featured).lastIndexOf(true);
    expect(firstNonFeatured === -1 || lastFeatured < firstNonFeatured).toBe(true);
  });

  it("filters by category", () => {
    const fullStack = filterProjects(projects, "full-stack");
    expect(fullStack.map((p) => p.slug)).toEqual(["emak-solutions"]);
    const ai = filterProjects(projects, "artificial-intelligence").map((p) => p.slug);
    expect(ai).toContain("academic-decoder");
    expect(ai).toContain("marketlens");
    expect(ai).not.toContain("nutritrack");
  });

  it("does not mutate the input", () => {
    const copy = [...projects];
    filterProjects(projects, "data-analytics");
    expect(projects).toEqual(copy);
  });

  it("counts projects per category", () => {
    const counts = countByCategory(projects);
    expect(counts.all).toBe(projects.length);
    expect(counts["full-stack"]).toBe(1);
    expect(counts["software-engineering"]).toBe(
      projects.filter((p) => p.categories.includes("software-engineering")).length,
    );
  });
});

describe("connectedNodeIds", () => {
  it("finds neighbours in both directions", () => {
    const emak = projects.find((p) => p.slug === "emak-solutions")!;
    expect([...connectedNodeIds(emak, "api")].sort()).toEqual(["auth", "postgres", "react"]);
    expect([...connectedNodeIds(emak, "postgres")]).toEqual(["api"]);
  });
});

describe("command search", () => {
  const commands = buildCommands();

  it("includes every section, every project and the key actions", () => {
    const ids = commands.map((c) => c.id);
    for (const p of projects) expect(ids).toContain(`project-${p.slug}`);
    for (const id of [
      "section-about",
      "section-contact",
      "github",
      "linkedin",
      "copy-email",
      "motion",
    ]) {
      expect(ids).toContain(id);
    }
  });

  it("returns everything for an empty query", () => {
    expect(searchCommands(commands, "  ")).toHaveLength(commands.length);
  });

  it("matches labels case-insensitively and ranks prefix matches first", () => {
    const result = searchCommands(commands, "MARKET");
    expect(result[0]?.id).toBe("project-marketlens");
  });

  it("matches hidden keywords such as technologies", () => {
    const ids = searchCommands(commands, "postgresql").map((c) => c.id);
    expect(ids).toContain("project-emak-solutions");
    expect(searchCommands(commands, "animation").map((c) => c.id)).toContain("motion");
  });

  it("requires every term to match", () => {
    expect(searchCommands(commands, "python plotly").map((c) => c.id)).toEqual([
      "project-marketlens",
    ]);
    expect(searchCommands(commands, "python spacy").map((c) => c.id)).toEqual([
      "project-academic-decoder",
    ]);
    expect(searchCommands(commands, "zzzz")).toEqual([]);
  });
});

describe("toRepoSummaries", () => {
  const base = {
    description: "A project",
    language: "Python",
    stargazers_count: 0,
    pushed_at: "2026-01-01T00:00:00Z",
    archived: false,
    private: false,
  };

  it("drops forks, archived and private repos and respects the limit", () => {
    const repos = [
      { ...base, name: "a", html_url: "https://github.com/x/a", fork: false },
      { ...base, name: "b", html_url: "https://github.com/x/b", fork: true },
      { ...base, name: "c", html_url: "https://github.com/x/c", fork: false, archived: true },
      { ...base, name: "d", html_url: "https://github.com/x/d", fork: false },
      { ...base, name: "e", html_url: "https://github.com/x/e", fork: false },
    ];
    expect(toRepoSummaries(repos, 2).map((r) => r.name)).toEqual(["a", "d"]);
  });

  it("skips repos with no description", () => {
    const repos = [
      { ...base, name: "a", html_url: "https://github.com/x/a", fork: false, description: null },
      { ...base, name: "b", html_url: "https://github.com/x/b", fork: false, description: "  " },
      { ...base, name: "c", html_url: "https://github.com/x/c", fork: false },
    ];
    expect(toRepoSummaries(repos, 4).map((r) => r.name)).toEqual(["c"]);
  });
});

describe("traceGraph", () => {
  it("follows the whole chain through a node without pulling in sibling branches", () => {
    const { nodes } = traceGraph("nlp");
    expect([...nodes].sort()).toEqual(["docs", "nlp", "quiz", "study"]);
  });

  it("includes upstream and downstream branches of a shared node", () => {
    const { nodes, edges } = traceGraph("pandas");
    expect(nodes.has("ops")).toBe(true);
    expect(nodes.has("market")).toBe(true);
    expect(nodes.has("streamlit")).toBe(true);
    expect(nodes.has("sql")).toBe(false);
    expect(edges.has("sql->bi")).toBe(false);
  });
});

describe("absoluteUrl", () => {
  it("joins paths onto the site URL", () => {
    expect(absoluteUrl("https://example.com", "/projects/a")).toBe(
      "https://example.com/projects/a",
    );
    expect(absoluteUrl("https://example.com/", "/")).toBe("https://example.com/");
  });
});
