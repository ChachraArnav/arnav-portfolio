import { ViewTransition, type ReactNode } from "react";

/**
 * Names an element so it morphs into the element with the same name on the
 * next page (React view transitions). `default="none"` keeps it out of
 * unrelated transitions; `share="morph"` is what makes the pair animate.
 */
export function Morph({
  name,
  enabled = true,
  children,
}: {
  name: string;
  enabled?: boolean;
  children: ReactNode;
}) {
  if (!enabled) return <>{children}</>;
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

/** Wraps a page so it slides with forward/back navigations. */
export function PageTransition({ children }: { children: ReactNode }) {
  const map = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };
  return (
    <ViewTransition enter={map} exit={map} default="none">
      {children}
    </ViewTransition>
  );
}

export const morphNames = {
  title: (slug: string) => `project-title-${slug}`,
  visual: (slug: string) => `project-visual-${slug}`,
};
