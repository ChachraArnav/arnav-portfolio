"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CommandPaletteProvider } from "@/components/command/command-palette-provider";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { useMotionPref } from "@/lib/motion-pref";

/**
 * Client-side providers. MotionConfig follows the site's motion preference
 * (OS setting, overridable with the header switch), so every Motion animation
 * turns off together with the CSS effects.
 */
export function Providers({ children }: { children: ReactNode }) {
  const pref = useMotionPref();
  return (
    <MotionConfig reducedMotion={pref === "full" ? "never" : "always"}>
      <CommandPaletteProvider>
        {pref === "full" ? <SmoothScroll /> : null}
        {pref === "full" ? <CustomCursor /> : null}
        {children}
      </CommandPaletteProvider>
    </MotionConfig>
  );
}
