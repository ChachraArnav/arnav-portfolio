"use client";

import { useEffect, useRef } from "react";
import { getMotionPref } from "@/lib/motion-pref";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#*";

/**
 * Text that decodes from random glyphs the first time it scrolls into view.
 * The visible letters are aria-hidden and the real text is given to screen
 * readers, so assistive tech never hears the noise. Server HTML holds the
 * final text, so nothing changes without JavaScript or with effects off.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionPref() !== "full") return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 260 + text.length * 45;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const settled = Math.floor(t * text.length);
          let out = "";
          for (let i = 0; i < text.length; i++) {
            const ch = text[i] ?? "";
            out +=
              i < settled || ch === " "
                ? ch
                : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? ch);
          }
          el.textContent = out;
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = text;
    };
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {text}
      </span>
    </>
  );
}
