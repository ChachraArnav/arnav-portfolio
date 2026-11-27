"use client";

import { useSyncExternalStore } from "react";
import { MOTION_STORAGE_KEY } from "./motion-script";

/**
 * Motion preference.
 *
 * The site follows the operating system's "reduce motion" setting by default,
 * but a visitor can override it with the effects switch in the header. The
 * resolved value lives on <html data-motion="full|reduce">, so CSS and React
 * read the same source of truth.
 */
export type MotionPref = "full" | "reduce";

const MOTION_EVENT = "motionchange";

export function getMotionPref(): MotionPref {
  if (typeof document === "undefined") return "reduce";
  return document.documentElement.dataset.motion === "full" ? "full" : "reduce";
}

export function setMotionPref(pref: MotionPref): void {
  document.documentElement.dataset.motion = pref;
  try {
    localStorage.setItem(MOTION_STORAGE_KEY, pref);
  } catch {
    // Storage can be unavailable; the choice still applies for this visit.
  }
  window.dispatchEvent(new Event(MOTION_EVENT));
}

export function toggleMotionPref(): MotionPref {
  const next: MotionPref = getMotionPref() === "full" ? "reduce" : "full";
  setMotionPref(next);
  return next;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(MOTION_EVENT, callback);
  return () => window.removeEventListener(MOTION_EVENT, callback);
}

/**
 * Current motion preference. The server snapshot is "reduce", so the first
 * client render matches the static HTML exactly (no hydration mismatch) and
 * effects switch on immediately after hydration.
 */
export function useMotionPref(): MotionPref {
  return useSyncExternalStore(subscribe, getMotionPref, () => "reduce");
}

/** True when effects should be off. Drop-in replacement for motion's useReducedMotion. */
export function useReduceMotion(): boolean {
  return useMotionPref() === "reduce";
}
