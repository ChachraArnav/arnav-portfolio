"use client";

import { Zap, ZapOff } from "lucide-react";
import { toggleMotionPref, useMotionPref } from "@/lib/motion-pref";

/** Turns the site's animated effects on or off. Defaults to the OS "reduce motion" setting. */
export function MotionToggle() {
  const pref = useMotionPref();
  const on = pref === "full";
  return (
    <button
      type="button"
      onClick={() => toggleMotionPref()}
      aria-pressed={on}
      aria-label="Animated effects"
      title={on ? "Turn animated effects off" : "Turn animated effects on"}
      className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] text-muted transition-colors hover:bg-surface-raised hover:text-text aria-pressed:text-accent"
    >
      {on ? <Zap size={17} aria-hidden /> : <ZapOff size={17} aria-hidden />}
    </button>
  );
}
