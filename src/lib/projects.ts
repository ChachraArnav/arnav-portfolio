import type { Project, ProjectCategory } from "@/types/content";

export type CategoryFilter = ProjectCategory | "all";

/** Returns projects matching the filter, featured projects first, order otherwise preserved. */
export function filterProjects(list: readonly Project[], filter: CategoryFilter): Project[] {
  const matching =
    filter === "all" ? [...list] : list.filter((project) => project.categories.includes(filter));
  return matching
    .map((project, index) => ({ project, index }))
    .sort((a, b) => Number(b.project.featured) - Number(a.project.featured) || a.index - b.index)
    .map(({ project }) => project);
}

/** Counts how many projects fall into each category, for filter badges. */
export function countByCategory(list: readonly Project[]): Record<CategoryFilter, number> {
  const counts: Record<CategoryFilter, number> = {
    all: list.length,
    "software-engineering": 0,
    "data-analytics": 0,
    "artificial-intelligence": 0,
    "full-stack": 0,
  };
  for (const project of list) {
    for (const category of project.categories) counts[category] += 1;
  }
  return counts;
}

/** Ids of nodes directly connected to the given node (either direction). */
export function connectedNodeIds(project: Project, nodeId: string): Set<string> {
  const ids = new Set<string>();
  for (const edge of project.architecture.edges) {
    if (edge.from === nodeId) ids.add(edge.to);
    if (edge.to === nodeId) ids.add(edge.from);
  }
  return ids;
}
