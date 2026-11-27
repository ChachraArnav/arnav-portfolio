import { sections, siteConfig } from "@/config/site";
import { projects } from "@/data/projects";

export type CommandGroup = "Navigate" | "Projects" | "Links" | "Actions";

export type CommandAction =
  | { type: "navigate"; href: string }
  | { type: "external"; href: string }
  | { type: "copy-email" }
  | { type: "toggle-theme" }
  | { type: "toggle-motion" };

export interface Command {
  id: string;
  label: string;
  group: CommandGroup;
  /** Extra words that should match in search but aren't displayed. */
  keywords: string[];
  hint?: string;
  action: CommandAction;
}

export function buildCommands(): Command[] {
  const navigate: Command[] = sections.map((section) => ({
    id: `section-${section.id}`,
    label: section.id === "top" ? "Go to top" : `Go to ${section.label}`,
    group: "Navigate",
    keywords: [section.label.toLowerCase(), "section"],
    action: { type: "navigate", href: section.id === "top" ? "/" : `/#${section.id}` },
  }));

  navigate.push({
    id: "quick-view",
    label: "Open recruiter quick view",
    group: "Navigate",
    keywords: ["summary", "recruiter", "overview", "cv", "one page"],
    action: { type: "navigate", href: "/quick-view" },
  });

  const projectCommands: Command[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    label: project.title,
    group: "Projects",
    hint: project.context,
    keywords: [...project.technologies.map((t) => t.toLowerCase()), project.domain.toLowerCase()],
    action: { type: "navigate", href: `/projects/${project.slug}` },
  }));

  const links: Command[] = [
    {
      id: "github",
      label: "Open GitHub",
      group: "Links",
      hint: "github.com/" + siteConfig.githubUsername,
      keywords: ["code", "repositories", "source"],
      action: { type: "external", href: siteConfig.links.github },
    },
    {
      id: "linkedin",
      label: "Open LinkedIn",
      group: "Links",
      keywords: ["profile", "network", "connect"],
      action: { type: "external", href: siteConfig.links.linkedin },
    },
  ];

  const actions: Command[] = [
    {
      id: "copy-email",
      label: "Copy email address",
      group: "Actions",
      hint: siteConfig.email,
      keywords: ["mail", "contact", "clipboard"],
      action: { type: "copy-email" },
    },
    {
      id: "contact",
      label: "Contact information",
      group: "Actions",
      keywords: ["email", "reach", "hire", "message"],
      action: { type: "navigate", href: "/#contact" },
    },
    {
      id: "theme",
      label: "Toggle light / dark theme",
      group: "Actions",
      keywords: ["appearance", "mode", "colour", "color"],
      action: { type: "toggle-theme" },
    },
    {
      id: "motion",
      label: "Toggle animated effects",
      group: "Actions",
      keywords: ["motion", "animation", "effects", "reduce", "accessibility"],
      action: { type: "toggle-motion" },
    },
  ];

  return [...navigate, ...projectCommands, ...links, ...actions];
}

/**
 * Case-insensitive search across label, hint and keywords. Every
 * whitespace-separated term must match somewhere. Label-prefix matches rank first.
 */
export function searchCommands(commands: readonly Command[], query: string): Command[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...commands];

  const scored: Array<{ command: Command; score: number; index: number }> = [];
  commands.forEach((command, index) => {
    const label = command.label.toLowerCase();
    const haystack = [label, command.hint?.toLowerCase() ?? "", ...command.keywords].join(" ");
    if (!terms.every((term) => haystack.includes(term))) return;
    const first = terms[0] ?? "";
    const score = label.startsWith(first) ? 0 : label.includes(first) ? 1 : 2;
    scored.push({ command, score, index });
  });

  return scored.sort((a, b) => a.score - b.score || a.index - b.index).map((s) => s.command);
}
