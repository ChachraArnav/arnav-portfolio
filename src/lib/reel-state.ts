"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the pinned projects reel is on screen (desktop with effects on).
 * Shared-element names must be unique on a page, so the reel and the gallery
 * use this to decide which of them carries the morph names.
 */
let active = false;
const listeners = new Set<() => void>();

export function setReelActive(value: boolean): void {
  if (active === value) return;
  active = value;
  listeners.forEach((l) => l());
}

export function useReelActive(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
    () => false,
  );
}
