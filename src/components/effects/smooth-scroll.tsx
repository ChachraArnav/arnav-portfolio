"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling (Lenis). Mounted only while animated effects are
 * on. In-page anchor links are handled by Lenis so they glide too, and the
 * header height is respected. Lenis adds `lenis` to <html>, which switches CSS
 * smooth scrolling off so the two never fight.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: { offset: -72 },
      autoRaf: true,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
