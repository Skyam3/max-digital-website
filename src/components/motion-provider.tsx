"use client";

import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Loads only the "domAnimation" feature set (opacity/transform/scale/hover/
 * tap/scroll animations) instead of Framer Motion's full bundle, which also
 * includes drag and layout-projection code this site never uses. `strict`
 * makes any stray `motion.div` (instead of `m.div`) throw immediately
 * rather than silently pulling the full bundle back in.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
