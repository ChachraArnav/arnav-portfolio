"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/** Sticky list of case-study sections; the one being read lights up. */
export function CaseNav({ sections }: { sections: { id: string; label: string }[] }) {
  const active = useActiveSection(sections.map((s) => `sec-${s.id}`));
  return (
    <nav aria-label="Case study sections" className="sticky top-28">
      <ol className="space-y-1 border-l border-line">
        {sections.map((section, i) => {
          const current = active === `sec-${section.id}`;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "-ml-px flex items-center gap-3 border-l py-1.5 pl-4 text-xs transition-colors",
                  current
                    ? "border-accent text-text"
                    : "border-transparent text-subtle hover:text-muted",
                )}
              >
                <span className={cn("font-mono", current && "text-accent")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
