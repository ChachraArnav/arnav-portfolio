"use client";

import { useReduceMotion } from "@/lib/motion-pref";
import { ParticleField as Field } from "./particle-field";

/** Mounts the particle canvas only while animated effects are on. */
export function ParticleField() {
  return useReduceMotion() ? null : <Field />;
}
