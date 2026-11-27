"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useReduceMotion } from "@/lib/motion-pref";

function Word({
  word,
  range,
  progress,
  accent,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className={accent ? "text-accent" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

/**
 * A large statement whose words light up one by one as it scrolls through the
 * viewport. Words wrapped in *asterisks* are highlighted in brass. Screen
 * readers get the plain sentence.
 */
export function ScrollStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  const plain = text.replace(/\*/g, "");

  return (
    <p ref={ref} className="text-statement font-semibold tracking-[-0.035em] text-text">
      <span className="sr-only">{plain}</span>
      {words.map((raw, i) => {
        const accent = raw.startsWith("*");
        const word = raw.replace(/\*/g, "");
        if (reduce) {
          return (
            <span key={i} aria-hidden="true" className={accent ? "text-accent" : undefined}>
              {word}{" "}
            </span>
          );
        }
        const start = i / words.length;
        return (
          <span key={i} aria-hidden="true">
            <Word
              word={word}
              accent={accent}
              progress={scrollYProgress}
              range={[start, start + 1 / words.length]}
            />
          </span>
        );
      })}
    </p>
  );
}
