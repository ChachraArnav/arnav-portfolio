"use client";

import { useId, useMemo, useState } from "react";
import { findMarks, segment } from "@/lib/fillers";

const SAMPLE =
  "So, um, I was basically leading the project and, like, I think we kind of fixed the bug before the deadline, you know.";

/** Type an answer and see Interview Mirror's filler and hedge rules mark it live. */
export function FillerCheck() {
  const id = useId();
  const [text, setText] = useState(SAMPLE);
  const marks = useMemo(() => findMarks(text), [text]);
  const parts = useMemo(() => segment(text, marks), [text, marks]);
  const fillers = marks.filter((m) => m.kind === "filler").length;
  const hedges = marks.length - fillers;

  return (
    <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-5 md:p-6">
      <label htmlFor={id} className="text-sm text-text">
        Try the filler-word check
      </label>
      <p className="mt-1 text-sm text-subtle">
        Type an answer the way you&apos;d say it. These are the same rules the app runs on your
        transcript.
      </p>
      <textarea
        id={id}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        spellCheck={false}
        className="mt-4 w-full resize-y rounded-[var(--radius-control)] border border-line-strong bg-bg px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
      />
      <p className="mt-4 min-h-[3rem] text-base leading-relaxed text-muted" aria-live="polite">
        {parts.map((part, i) =>
          part.kind ? (
            <mark
              key={i}
              className={
                part.kind === "filler"
                  ? "rounded bg-accent-soft px-1 text-text ring-1 ring-accent"
                  : "rounded bg-transparent px-0.5 text-text underline decoration-accent decoration-wavy underline-offset-4"
              }
            >
              {part.text}
            </mark>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </p>
      <p className="mt-3 text-sm text-subtle">
        {fillers} filler{fillers === 1 ? "" : "s"}, {hedges} hedge{hedges === 1 ? "" : "s"}.
        &ldquo;Like&rdquo; only counts as a filler in context: &ldquo;I like Python&rdquo; is fine.
      </p>
    </div>
  );
}
