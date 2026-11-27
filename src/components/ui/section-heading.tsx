import type { ReactNode } from "react";
import { ScrambleText } from "@/components/effects/scramble-text";

interface SectionHeadingProps {
  id: string;
  title: string;
  /** Two-digit section index shown above the title, e.g. "01". */
  index?: string;
  children?: ReactNode;
}

/** Section title plus an optional short description. The id targets the <h2> for aria-labelledby. */
export function SectionHeading({ id, title, index, children }: SectionHeadingProps) {
  return (
    <div className="mb-12 md:mb-16">
      {index ? (
        <div
          className="mb-6 flex items-center gap-4 font-mono text-2xs text-subtle"
          aria-hidden="true"
        >
          <span className="text-accent">{index}</span>
          <span className="section-rule h-px flex-1 bg-line-strong" />
          <span className="tracking-[0.18em] uppercase">{title}</span>
        </div>
      ) : null}
      <div className="reveal grid gap-4 md:grid-cols-12 md:gap-x-8">
        <h2
          id={id}
          className="text-xl font-semibold tracking-[-0.02em] text-text md:col-span-4 md:text-2xl"
        >
          <ScrambleText text={title} />
        </h2>
        {children ? (
          <div className="max-w-[60ch] text-base text-muted md:col-span-7 md:col-start-6 md:pt-2">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
