/**
 * Content types for the portfolio. Every piece of personal content
 * (projects, experience, skills) is typed here so that adding a new
 * entry is a data change, never a component change.
 */

export type ProjectCategory =
  "software-engineering" | "data-analytics" | "artificial-intelligence" | "full-stack";

export interface CategoryMeta {
  id: ProjectCategory;
  label: string;
}

/** A node in a project's architecture diagram. */
export interface ArchitectureNode {
  id: string;
  label: string;
  /** Short technology label shown under the node name, e.g. "PostgreSQL". */
  tech: string;
  /** Column / layer index, left-to-right (0 = entry point). */
  layer: number;
  /** What this component is responsible for *in this specific project*. */
  role: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  /** What flows across this connection, e.g. "JSON over HTTPS". */
  label: string;
}

export interface Architecture {
  summary: string;
  layers: string[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

/** Text that still needs real information from Arnav is marked as pending. */
export interface ContentItem {
  text: string;
  pending?: boolean;
}

export interface Screenshot {
  /** Path under /public, or null when the screenshot has not been added yet. */
  src: string | null;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

export type ProjectStatus = "complete" | "in-progress" | "academic" | null;

export type PreviewKind = "mirror" | "market" | "workflow" | "pipeline" | "tracker";

export interface ProjectLink {
  /** Null means the link has not been provided yet. */
  url: string | null;
  /** Shown when url is null, e.g. "Private client repository". */
  unavailableReason?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  /** One-line context, e.g. "University team project". */
  context: string;
  categories: ProjectCategory[];
  /** Original free-text category from the brief, shown on the case study. */
  domain: string;
  status: ProjectStatus;
  featured: boolean;
  /** Which code-drawn preview to show in the gallery. */
  preview: PreviewKind;
  technologies: string[];
  overview: string;
  problem: string;
  approach: ContentItem[];
  contributions: ContentItem[];
  /** Used on team projects to separate team scope from personal scope. */
  teamScope?: ContentItem[];
  challenges: ContentItem[];
  evaluation: ContentItem[];
  architecture: Architecture;
  screenshots: Screenshot[];
  repository: ProjectLink;
  demo: ProjectLink;
  /**
   * Optional short screen recording (muted, looping) shown in place of the
   * drawn schematic. Put the file in public/projects/ and set src to
   * "/projects/<file>.mp4". Leave out until a real recording exists.
   */
  video?: ProjectVideo;
}

export interface ProjectVideo {
  /** Path under /public, e.g. "/projects/marketlens-demo.mp4". */
  src: string;
  /** Still frame shown before playback and when effects are off. */
  poster?: string;
  /** Describes what the recording shows, for screen readers. */
  label: string;
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  division?: string;
  role: string;
  /** ISO yyyy-mm. Null when not yet provided. */
  start: string | null;
  end: string | null;
  location?: string;
  type: "co-op" | "part-time" | "full-time";
  /** Primary entries render in full; others render compactly. */
  emphasis: "primary" | "secondary";
  summary: string;
  highlights: string[];
  technologies: string[];
  strengths?: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  credential: string;
  status: string;
  detail?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  /** Project slugs where this skill is demonstrated. */
  projects?: string[];
  /** Experience ids where this skill was used. */
  experience?: string[];
}
