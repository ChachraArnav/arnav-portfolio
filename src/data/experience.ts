import type { EducationEntry, ExperienceEntry } from "@/types/content";

export const experience: ExperienceEntry[] = [
  {
    id: "york-region",
    organization: "Regional Municipality of York",
    division: "Paramedic and Senior Services",
    role: "Data Analytics Technician (Co-op)",
    start: "2024-08",
    end: "2025-01",
    location: "Ontario",
    type: "co-op",
    emphasis: "primary",
    summary:
      "Built reporting and analysis tools for paramedic operations, working from raw operational data through to dashboards used in staffing discussions.",
    highlights: [
      "Built Power BI dashboards on top of SQL queries that extracted and shaped operational data.",
      "Identified operational bottlenecks and supported staffing decisions with the analysis.",
      "Automated recurring data-processing and reporting workflows that were previously manual.",
      "Wrote Python workflows that called mapping APIs to calculate paramedic travel distances and dispatch times.",
      "Produced Excel reports for operational analysis.",
    ],
    technologies: ["Power BI", "SQL", "Python", "Mapping APIs", "Excel"],
  },
  {
    id: "booster-juice",
    organization: "Booster Juice",
    role: "Shift Leader",
    start: null,
    end: null,
    type: "part-time",
    emphasis: "secondary",
    summary:
      "Ran shifts in a high-volume service environment: coordinating the team, keeping the line moving and handling customer issues as they came up.",
    highlights: [],
    technologies: [],
    strengths: ["Team leadership", "Shift coordination", "Customer problem-solving"],
  },
  {
    id: "social-bar",
    organization: "The Social Bar and Lounge",
    role: "Bartender and Server",
    start: null,
    end: null,
    type: "part-time",
    emphasis: "secondary",
    summary:
      "Customer-facing work under time pressure, where clear communication with guests and the rest of the floor matters.",
    highlights: [],
    technologies: [],
    strengths: ["Communication", "Teamwork", "Working under pressure"],
  },
];

export const education: EducationEntry[] = [
  {
    id: "lakehead",
    institution: "Lakehead University",
    credential: "Honours Bachelor of Science, Computer Science",
    status: "Expected April 2027",
  },
  {
    id: "georgian",
    institution: "Georgian College",
    credential: "Computer Programming Diploma with Honours",
    status: "Completed",
    detail: "Transferred to Lakehead through the Georgian–Lakehead pathway.",
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Formats "2024-08" as "Aug 2024". Returns null for missing values. */
export function formatMonth(value: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  const monthIndex = Number(match[2]) - 1;
  const month = MONTHS[monthIndex];
  if (!month) return null;
  return `${month} ${match[1]}`;
}

/** "Aug 2024 – Jan 2025", "Aug 2024 – Present", or null when no dates exist. */
export function formatPeriod(start: string | null, end: string | null): string | null {
  const s = formatMonth(start);
  if (!s) return null;
  const e = end ? formatMonth(end) : "Present";
  return `${s} – ${e ?? "Present"}`;
}
