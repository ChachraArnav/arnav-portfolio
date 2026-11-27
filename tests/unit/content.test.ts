import { describe, expect, it } from "vitest";
import { sections, siteConfig } from "@/config/site";
import { experience, formatMonth, formatPeriod } from "@/data/experience";
import { categories, projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

describe("project data integrity", () => {
  it("has unique, URL-safe slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("only uses known categories", () => {
    const known = new Set(categories.map((c) => c.id));
    for (const project of projects) {
      expect(project.categories.length).toBeGreaterThan(0);
      for (const c of project.categories) expect(known.has(c)).toBe(true);
    }
  });

  it("has architecture edges that reference real nodes and layers", () => {
    for (const { architecture, slug } of projects) {
      const ids = new Set(architecture.nodes.map((n) => n.id));
      expect(ids.size, `${slug} has duplicate node ids`).toBe(architecture.nodes.length);
      for (const edge of architecture.edges) {
        expect(ids.has(edge.from), `${slug}: unknown edge source ${edge.from}`).toBe(true);
        expect(ids.has(edge.to), `${slug}: unknown edge target ${edge.to}`).toBe(true);
      }
      for (const node of architecture.nodes) {
        expect(node.layer).toBeGreaterThanOrEqual(0);
        expect(node.layer).toBeLessThan(architecture.layers.length);
        expect(node.role.length).toBeGreaterThan(40);
      }
    }
  });

  it("never invents links: every link is either null with a reason, or https", () => {
    for (const project of projects) {
      for (const link of [project.repository, project.demo]) {
        if (link.url === null) expect(link.unavailableReason).toBeTruthy();
        else expect(link.url).toMatch(/^https:\/\//);
      }
      for (const shot of project.screenshots) {
        if (shot.src !== null) expect(shot.src.startsWith("/")).toBe(true);
        expect(shot.alt).toBeTruthy();
      }
    }
  });

  it("separates team scope from personal contributions on the EMAK team project", () => {
    const emak = projects.find((p) => p.slug === "emak-solutions");
    expect(emak?.teamScope?.length).toBeGreaterThan(0);
    expect(emak?.contributions.length).toBeGreaterThan(0);
  });

  it("describes Academic Decoder as the NLP tool it is, with only checkable figures", () => {
    // Figures below come from TheAcademicDecoder repository (tests/test_decoder.py).
    const decoder = projects.find((p) => p.slug === "academic-decoder");
    const text = JSON.stringify(decoder);
    expect(text).not.toMatch(/\bLLM\b|language model API|prompt/i);
    expect(decoder?.technologies).toContain("spaCy");
    const evaluation = (decoder?.evaluation ?? []).map((item) => item.text).join(" ");
    const numbers = evaluation.match(/\d[\d,]*(\.\d+)?/g) ?? [];
    for (const n of numbers) expect(["27"], `unverified figure: ${n}`).toContain(n);
  });

  it("states only MarketLens results that the research output backs up", () => {
    // Every figure below comes from the MarketLens repository:
    // results/holdout/summary.json (2026 test, volatility rule) and
    // results/crosscheck/summary.json (TMX cross-check). Update both together.
    const verified = new Set([
      "2026", "2025", "2,743", "0.251", "0.113", "2.2", "77", "0.265", "20",
      "3", "0.067", "0.058", "0", "5", "13",
    ]);
    const marketlens = projects.find((p) => p.slug === "marketlens");
    const text = (marketlens?.evaluation ?? []).map((item) => item.text).join(" ");
    const numbers = text.match(/\d[\d,]*(\.\d+)?/g) ?? [];
    expect(numbers.length).toBeGreaterThan(0);
    for (const n of numbers) expect(verified, `unverified figure: ${n}`).toContain(n);
  });

  it("links skills only to projects and roles that exist", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    const roles = new Set(experience.map((e) => e.id));
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        for (const slug of skill.projects ?? []) expect(slugs.has(slug)).toBe(true);
        for (const id of skill.experience ?? []) expect(roles.has(id)).toBe(true);
      }
    }
  });
});

describe("site config", () => {
  it("uses https links and a valid email", () => {
    expect(siteConfig.links.github).toMatch(/^https:\/\/github\.com\//);
    expect(siteConfig.links.linkedin).toMatch(/^https:\/\/(www\.)?linkedin\.com\//);
    expect(siteConfig.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it("does not imply immediate availability", () => {
    expect(siteConfig.availability.label).toMatch(/2027/);
    expect(siteConfig.availability.label.toLowerCase()).not.toContain("immediately");
  });

  it("keeps section ids unique", () => {
    const ids = sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("date formatting", () => {
  it("formats months and periods", () => {
    expect(formatMonth("2024-08")).toBe("Aug 2024");
    expect(formatMonth("2024-13")).toBeNull();
    expect(formatMonth(null)).toBeNull();
    expect(formatPeriod("2024-08", "2025-01")).toBe("Aug 2024 – Jan 2025");
    expect(formatPeriod("2024-08", null)).toBe("Aug 2024 – Present");
    expect(formatPeriod(null, null)).toBeNull();
  });

  it("puts the York Region co-op first and dates it correctly", () => {
    const first = experience[0];
    expect(first?.id).toBe("york-region");
    expect(first?.emphasis).toBe("primary");
    expect(formatPeriod(first?.start ?? null, first?.end ?? null)).toBe("Aug 2024 – Jan 2025");
  });
});
