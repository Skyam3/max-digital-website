/**
 * Shared motion tokens. Framer Motion `transition` props read from here
 * rather than hardcoding durations/easings per component, so the whole
 * site's motion language stays consistent and easy to retune in one place.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  /** Hover/press feedback — buttons, links, chips. */
  fast: 0.15,
  /** Card lifts, nav shrink, most micro-interactions. */
  base: 0.2,
  /** Larger surface changes — image zoom, accordion panels. */
  slow: 0.4,
} as const;

/** Snappy, controlled — hover states and other interactive feedback. */
export const SPRING_SNAPPY = { type: "spring", stiffness: 320, damping: 28 } as const;

/** Softer, for one-time scroll reveals — still quick, never floaty. */
export const SPRING_REVEAL = { type: "spring", stiffness: 140, damping: 20 } as const;

/** Used for cursor-driven tilt (Hero mockup) — smooths raw pointer input. */
export const SPRING_TILT = { type: "spring", stiffness: 200, damping: 22 } as const;
