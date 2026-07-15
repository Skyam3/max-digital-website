"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { m, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Wraps card content with a faint radial glow that follows the cursor.
 * The parent element must own its own `overflow-hidden` + border radius —
 * this only tracks the pointer and paints the glow layer beneath children.
 *
 * Always mounts the same markup regardless of prefers-reduced-motion:
 * the glow only ever moves in direct 1:1 response to the user's own
 * cursor (never autoplays), so it isn't the kind of motion that
 * preference is meant to suppress — and conditionally mounting/unmounting
 * it based on a client-only media query would make server and client
 * markup disagree on first paint, which is a real hydration bug, not a
 * theoretical one (caught via testing under emulated reduced motion).
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Bounds cached on enter rather than read on every mousemove — see
  // browser-mockup.tsx for why (forced synchronous layout otherwise).
  function handleMouseEnter() {
    if (ref.current) boundsRef.current = ref.current.getBoundingClientRect();
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!boundsRef.current) return;
    const bounds = boundsRef.current;
    mouseX.set(e.clientX - bounds.left);
    mouseY.set(e.clientY - bounds.top);
  }

  const background = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, var(--color-accent) 0%, transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      className={cn("group relative h-full", className)}
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.07]"
        style={{ background }}
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
