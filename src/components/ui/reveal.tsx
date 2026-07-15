"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { SPRING_REVEAL } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay index — multiplied internally for sibling reveals. */
  delay?: number;
  as?: "div" | "li";
}

/**
 * Fades content up into place as it enters the viewport. Runs once.
 * Fully inert under prefers-reduced-motion (content just appears).
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // The "hidden" state must render identically on server and client — it's
  // what's on screen at hydration time, before whileInView can even fire.
  // Reduced motion is instead honored by collapsing the *transition* into
  // the "visible" state (below) to be instant, never by branching the
  // static hidden/visible values themselves.
  const variants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : { ...SPRING_REVEAL, delay },
    },
  };

  const MotionTag = m[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/** Wraps a group of children and staggers Reveal children inside it. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : stagger,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_REVEAL,
  },
};
