"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { useReduceMotion } from "@/lib/motion-pref";

/** Wraps v into [min, max). */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * An endless ribbon of words that drifts on its own, speeds up and reverses
 * with scroll direction, and skews with scroll velocity. Decorative: the same
 * words appear as plain text in the Toolkit list. With effects off it renders
 * as a static row.
 */
export function VelocityMarquee({ items, speed = 2 }: { items: string[]; speed?: number }) {
  const reduce = useReduceMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(smooth, [-3000, 0, 3000], [12, 0, -12]);
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    const move = direction.current * speed * (delta / 1000) * (1 + Math.abs(f));
    base.set(base.get() - move);
  });

  const row = (
    <>
      {items.map((item) => (
        <span key={item} className="marquee-item">
          {item}
          <span className="marquee-sep" />
        </span>
      ))}
    </>
  );

  return (
    <div aria-hidden="true" className="marquee relative overflow-hidden border-y border-line py-6">
      <motion.div
        className="flex w-max whitespace-nowrap"
        style={reduce ? undefined : { x, skewX: skew }}
      >
        {row}
        {reduce ? null : (
          <>
            {row}
            {row}
            {row}
          </>
        )}
      </motion.div>
    </div>
  );
}
