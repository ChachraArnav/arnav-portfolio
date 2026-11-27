"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 3D tilt toward the pointer, plus a glare highlight. Writes --rx, --ry and
 * --gx/--gy; the transform itself lives in CSS (.tilt), which only applies
 * while animated effects are on.
 */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={cn("tilt", className)}
      onPointerMove={(event) => {
        const el = ref.current;
        if (event.pointerType !== "mouse" || !el) return;
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * 2 * max}deg`);
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
        el.dataset.tilting = "";
      }}
      onPointerLeave={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        delete el.dataset.tilting;
      }}
    >
      {children}
    </div>
  );
}
