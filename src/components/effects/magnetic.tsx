"use client";

import { useRef, type ReactNode } from "react";
import { useReduceMotion } from "@/lib/motion-pref";

/**
 * Pulls its child a few pixels toward the pointer and springs back on leave.
 * Pure transform on a wrapper, so layout and focus are untouched.
 */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReduceMotion();

  if (reduce) return <>{children}</>;

  return (
    <span
      ref={ref}
      className="magnetic inline-flex"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        ref.current.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </span>
  );
}
