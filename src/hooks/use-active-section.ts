"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently in view.
 * A section counts as active when it crosses a band 30–40% down the viewport,
 * which matches where people's eyes are while scrolling.
 */
export function useActiveSection(ids: readonly string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    const elements = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const firstVisible = elements.find((el) => visible.get(el.id));
        if (firstVisible) setActive(firstVisible.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, enabled]);

  return enabled ? active : null;
}
