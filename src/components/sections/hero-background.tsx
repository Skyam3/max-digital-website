"use client";

import { m, useReducedMotion } from "framer-motion";

// Fixed positions rather than Math.random() — random values would differ
// between the server render and client hydration and trigger a mismatch.
const PARTICLES = [
  { top: "18%", left: "8%", size: 3, duration: 9, delay: 0 },
  { top: "62%", left: "5%", size: 2, duration: 11, delay: 1.2 },
  { top: "12%", left: "22%", size: 2, duration: 8, delay: 2.1 },
  { top: "78%", left: "16%", size: 3, duration: 10, delay: 0.6 },
  { top: "35%", left: "94%", size: 2, duration: 12, delay: 1.8 },
  { top: "70%", left: "88%", size: 3, duration: 9.5, delay: 0.3 },
  { top: "8%", left: "78%", size: 2, duration: 10.5, delay: 2.6 },
  { top: "50%", left: "50%", size: 2, duration: 13, delay: 1.4 },
];

export function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Drifting gradient blobs — restrained, brand accent only */}
      <m.div
        className="absolute left-[10%] top-[-15%] h-[520px] w-[720px] rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: "var(--color-accent)" }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 40, -10, 0], y: [0, 20, -10, 0] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        className="absolute right-[5%] top-[10%] h-[380px] w-[540px] rounded-full opacity-[0.1] blur-[100px]"
        style={{ background: "var(--color-accent)" }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -30, 15, 0], y: [0, -15, 10, 0] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Grid — very slow drift so it reads as alive, not static wallpaper */}
      <m.div
        className="absolute inset-[-64px] opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
        }}
        animate={shouldReduceMotion ? undefined : { x: [0, 12, 0], y: [0, 8, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft particles — a handful, low opacity, slow. Always rendered
          (never added/removed) so server and client markup always match;
          only the animation itself is skipped under reduced motion. */}
      {PARTICLES.map((p, i) => (
        <m.span
          key={i}
          className="absolute rounded-full bg-accent"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, opacity: 0.12 }}
          animate={
            shouldReduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.12, 0.32, 0.12] }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
