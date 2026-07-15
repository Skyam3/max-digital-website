"use client";

import { useRef, type MouseEvent } from "react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Gauge, MousePointerClick, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_OUT, SPRING_TILT } from "@/lib/motion";

const floatVariants = (delay: number) => ({
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.7, ease: EASE_OUT },
  },
});

export function BrowserMockup() {
  const t = useTranslations("Hero.mockup");
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse-driven tilt — motion values updated directly in the handler so
  // pointer movement never triggers a React re-render.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING_TILT);
  const springY = useSpring(mouseY, SPRING_TILT);
  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);

  // Cached on enter rather than read on every mousemove — calling
  // getBoundingClientRect() at pointer-move frequency forces a synchronous
  // layout recalculation on each event (a "forced reflow"), which shows up
  // as real jank under load. One read per hover session is enough since
  // the card's position won't change mid-hover.
  const boundsRef = useRef<DOMRect | null>(null);

  function handleMouseEnter() {
    if (cardRef.current) boundsRef.current = cardRef.current.getBoundingClientRect();
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (shouldReduceMotion || !boundsRef.current) return;
    const bounds = boundsRef.current;
    mouseX.set((e.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((e.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="relative mx-auto max-w-[1040px]" style={{ perspective: 1600 }}>
      {/* Ground shadow — gives the floating card a sense of depth */}
      <div
        className="absolute inset-x-10 top-1/2 -z-10 h-[60%] rounded-[50%] opacity-40 blur-[70px]"
        style={{ background: "var(--color-accent-muted)" }}
        aria-hidden="true"
      />

      {/* Floating detail chips — illustrative craft cues, not client claims */}
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={floatVariants(0.9)}
        animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
        className="absolute -left-4 top-16 z-20 hidden items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-card px-4 py-3 shadow-[var(--shadow-lg)] md:flex"
      >
        <Gauge className="size-4 text-accent" aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">{t("speed")}</span>
      </m.div>

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={floatVariants(1.05)}
        animate={shouldReduceMotion ? undefined : { y: [0, 7, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
        className="absolute -right-4 top-40 z-20 hidden items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-card px-4 py-3 shadow-[var(--shadow-lg)] md:flex"
      >
        <MousePointerClick className="size-4 text-accent" aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">{t("convert")}</span>
      </m.div>

      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={floatVariants(1.2)}
        animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={shouldReduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
        className="absolute -bottom-6 left-10 z-20 hidden items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-card px-4 py-3 shadow-[var(--shadow-lg)] sm:flex"
      >
        <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">{t("accessible")}</span>
      </m.div>

      {/* Browser chrome — tilts gently toward the cursor */}
      <m.div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.012 }}
        transition={SPRING_TILT}
        className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-lg)]"
      >
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <span className="size-2.5 rounded-full bg-muted" />
          <span className="size-2.5 rounded-full bg-muted" />
          <span className="size-2.5 rounded-full bg-muted" />
          <div className="ml-3 flex h-6 flex-1 max-w-[280px] items-center rounded-[var(--radius-sm)] bg-secondary px-3 text-xs text-muted-foreground">
            {t("url")}
          </div>
        </div>

        {/* Abstract preview of this very site — intrinsic height so it never
            clips its own content at narrower column widths */}
        <div className="relative bg-surface p-6 sm:p-8 lg:p-9 xl:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, var(--color-accent-muted), transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 sm:gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="flex size-4 items-center justify-center rounded-[4px] bg-foreground/20" />
                <div className="h-2.5 w-16 rounded-full bg-foreground/15" />
              </div>
              <div className="hidden items-center gap-4 sm:flex">
                <div className="h-2.5 w-12 rounded-full bg-foreground/10" />
                <div className="h-2.5 w-12 rounded-full bg-foreground/10" />
                <div className="h-2.5 w-12 rounded-full bg-foreground/10" />
              </div>
              <div className="h-8 w-20 rounded-[var(--radius-sm)] bg-accent/80" />
            </div>

            <div className="flex flex-col items-start gap-4 py-2">
              <div className="h-4 w-28 rounded-full bg-accent/25" />
              <div className="h-7 w-[85%] max-w-[420px] rounded-md bg-foreground/20 sm:h-9" />
              <div className="h-7 w-[65%] max-w-[300px] rounded-md bg-foreground/20 sm:h-9" />
              <div className="mt-2 h-3 w-[70%] max-w-[360px] rounded-full bg-foreground/10" />
              <div className="h-3 w-[50%] max-w-[260px] rounded-full bg-foreground/10" />
              <div className="mt-3 flex gap-3">
                <div className="h-10 w-32 rounded-[var(--radius-md)] bg-primary" />
                <div className="h-10 w-32 rounded-[var(--radius-md)] border border-border-strong" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-[var(--radius-md)] border border-border bg-card sm:h-20"
                />
              ))}
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}
