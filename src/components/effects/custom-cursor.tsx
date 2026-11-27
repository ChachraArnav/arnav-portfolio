"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const INTERACTIVE =
  "a, button, [role='button'], [role='tab'], [role='option'], input, select, textarea, summary, label";

/**
 * A brass ring that trails the pointer and a dot that sits exactly on it.
 * The ring grows over anything clickable and shows a short label over
 * elements with data-cursor="View" (project cards, for example). The native
 * cursor stays visible, so nothing about pointing or text selection changes.
 * Fine pointers only.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  // A new page means whatever was under the pointer is gone: reset the ring.
  useEffect(() => {
    if (ringRef.current) ringRef.current.dataset.state = "idle";
    if (labelRef.current) labelRef.current.textContent = "";
  }, [pathname]);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let frame = 0;
    let visible = false;

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        document.documentElement.dataset.cursorActive = "";
      }
      if (!frame) frame = requestAnimationFrame(tick);

      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const text = labelled?.dataset.cursor ?? "";
      const state = text ? "label" : target?.closest(INTERACTIVE) ? "hover" : "idle";
      if (ring.dataset.state !== state) ring.dataset.state = state;
      if (label.textContent !== text) label.textContent = text;
    };
    const onLeave = () => {
      visible = false;
      delete document.documentElement.dataset.cursorActive;
    };
    const onDown = () => ring.setAttribute("data-pressed", "");
    const onUp = () => ring.removeAttribute("data-pressed");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      delete document.documentElement.dataset.cursorActive;
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={ringRef} className="cursor-ring" data-state="idle">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
