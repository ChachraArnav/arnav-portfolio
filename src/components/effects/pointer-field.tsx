"use client";

import { useEffect, useRef } from "react";

interface PointerFieldProps {
  /** CSS variable names to write the pointer position into. */
  xVar?: string;
  yVar?: string;
}

/**
 * Tracks the pointer over its parent element and exposes the position as CSS
 * variables (default --px / --py) plus --pointer-on (0 or 1). Styling stays in
 * CSS; this component only feeds coordinates, throttled to one write per frame.
 * It does nothing on touch-only devices.
 */
export function PointerField({ xVar = "--px", yVar = "--py" }: PointerFieldProps) {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = markerRef.current?.parentElement;
    if (!host || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const write = () => {
      frame = 0;
      host.style.setProperty(xVar, `${x}px`);
      host.style.setProperty(yVar, `${y}px`);
    };
    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onEnter = () => host.style.setProperty("--pointer-on", "1");
    const onLeave = () => host.style.setProperty("--pointer-on", "0");

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [xVar, yVar]);

  return <span ref={markerRef} hidden />;
}
