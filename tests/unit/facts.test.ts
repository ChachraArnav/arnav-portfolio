import { describe, expect, it } from "vitest";
import { TOUR } from "@/components/home/system-graph";
import { heroFacts } from "@/data/facts";
import { getProject, projects } from "@/data/projects";

describe("hero facts", () => {
  it("only states numbers that the content itself backs up", () => {
    const marketlens = getProject("marketlens")!;
    const byLabel = new Map(heroFacts.map((f) => [f.label, f.value]));
    expect(byLabel.get("Projects with full case studies")).toBe(projects.length);
    expect(byLabel.get("ETFs analyzed in MarketLens")).toBe(13);
    expect(marketlens.overview).toContain("13 Canadian-listed ETFs");
    expect(byLabel.get("Model families compared in MarketLens")).toBe(3);
    expect(marketlens.approach.map((a) => a.text).join(" ")).toMatch(
      /logistic regression, a random forest and a small neural network/,
    );
  });

  it("starts each count-up below its final value", () => {
    for (const fact of heroFacts) expect(fact.from ?? 0).toBeLessThan(fact.value);
  });

  it("tours each lane of the hero graph exactly once", () => {
    expect(new Set(TOUR).size).toBe(TOUR.length);
  });
});
