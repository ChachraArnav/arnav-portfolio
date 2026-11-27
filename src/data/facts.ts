import { projects } from "./projects";

/**
 * Figures shown under the hero. Every number must be a plain fact taken from
 * the content elsewhere on the site, never an estimate or a result claim.
 */
export interface HeroFact {
  value: number;
  /** Where the count-up animation starts. Defaults to 0. */
  from?: number;
  suffix?: string;
  label: string;
}

export const heroFacts: HeroFact[] = [
  { value: 2027, from: 2020, label: "Graduating, Honours BSc Computer Science" },
  { value: projects.length, label: "Projects with full case studies" },
  { value: 13, label: "ETFs analyzed in MarketLens" },
  { value: 3, label: "Model families compared in MarketLens" },
];
