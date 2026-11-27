import type { SkillGroup } from "@/types/content";

/**
 * Skills grouped by what they're used for. No proficiency percentages:
 * where possible each skill points at the project or role that shows it.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "Python", projects: ["marketlens", "academic-decoder"], experience: ["york-region"] },
      { name: "TypeScript", projects: ["interview-mirror", "emak-solutions"] },
      { name: "JavaScript", projects: ["nutritrack", "emak-solutions"] },
      { name: "SQL", projects: ["emak-solutions"], experience: ["york-region"] },
      { name: "Java" },
      { name: "C++" },
      { name: "R" },
    ],
  },
  {
    id: "data-ai",
    label: "Data and AI",
    skills: [
      { name: "Pandas", projects: ["marketlens"] },
      { name: "NumPy", projects: ["marketlens"] },
      { name: "Scikit-learn", projects: ["marketlens"] },
      { name: "Power BI", experience: ["york-region"] },
      { name: "Machine learning", projects: ["marketlens"] },
      { name: "Exploratory data analysis", projects: ["marketlens"] },
      { name: "Data visualization", projects: ["marketlens"], experience: ["york-region"] },
      { name: "Natural language processing (spaCy)", projects: ["academic-decoder"] },
      { name: "On-device AI (WebLLM, Transformers.js)", projects: ["interview-mirror"] },
      { name: "Speech recognition (Whisper)", projects: ["interview-mirror"] },
      { name: "Computer vision (MediaPipe)", projects: ["interview-mirror"] },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks and tools",
    skills: [
      { name: "React", projects: ["interview-mirror", "emak-solutions"] },
      { name: "Node.js", projects: ["emak-solutions"] },
      { name: "Express", projects: ["emak-solutions"] },
      { name: "Streamlit", projects: ["marketlens", "academic-decoder"] },
      { name: "Git and GitHub", projects: ["interview-mirror", "emak-solutions", "marketlens", "academic-decoder"] },
      { name: "VS Code" },
    ],
  },
  {
    id: "databases",
    label: "Databases and cloud",
    skills: [
      { name: "PostgreSQL", projects: ["emak-solutions"] },
      { name: "MySQL" },
      { name: "AWS fundamentals" },
      { name: "Azure fundamentals" },
    ],
  },
  {
    id: "practice",
    label: "Engineering practice",
    skills: [
      { name: "REST APIs", projects: ["emak-solutions", "nutritrack"] },
      { name: "Object-oriented programming" },
      { name: "Data structures and algorithms" },
      { name: "Software testing", projects: ["interview-mirror", "emak-solutions", "marketlens", "academic-decoder"] },
      { name: "Debugging", projects: ["emak-solutions"] },
      { name: "Agile development", projects: ["emak-solutions"] },
      { name: "Git workflows", projects: ["emak-solutions"] },
      { name: "CI with GitHub Actions", projects: ["interview-mirror", "marketlens", "academic-decoder"] },
      { name: "Software development lifecycle" },
    ],
  },
];

/** The short list shown on the recruiter quick view. */
export const coreSkills = [
  "Python",
  "TypeScript / JavaScript",
  "SQL",
  "React",
  "Node.js / Express",
  "PostgreSQL",
  "Power BI",
  "Pandas / Scikit-learn",
  "On-device AI (WebLLM, Whisper)",
  "NLP (spaCy)",
  "Git",
];
