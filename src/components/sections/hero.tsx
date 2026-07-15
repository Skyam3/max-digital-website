"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { BrowserMockup } from "@/components/sections/browser-mockup";
import { HeroBackground } from "@/components/sections/hero-background";
import { ScrollHint } from "@/components/sections/scroll-hint";
import { EASE_OUT } from "@/lib/motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: EASE_OUT },
  }),
};

export function Hero() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const trustPoints = t.raw("trustPoints") as string[];
  const month = new Date().toLocaleString(locale, { month: "long" });

  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Mockup drifts a little slower than the page scrolls — a subtle depth
  // cue, not a full parallax scene.
  const mockupParallaxY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 60]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden pt-36 pb-24 md:pt-40 lg:flex lg:min-h-[92vh] lg:items-center lg:pb-28"
    >
      <HeroBackground />

      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,620px)_1fr] lg:gap-12 xl:gap-20">
          <div>
            <m.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-[var(--shadow-sm)]"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {t("badge", { month })}
            </m.div>

            {/* Not animated in like its siblings, deliberately: this is the
                page's LCP element, and gating its opacity behind a JS/
                Framer-Motion entrance measurably delayed LCP on throttled
                mobile (~1.1s of render delay, confirmed via Lighthouse).
                It renders instantly; the motion happens around it. */}
            <h1 className="text-balance text-display text-foreground">
              {t("titleStart")}{" "}
              <span className="text-highlight">{t("titleHighlight")}</span>{" "}
              {t("titleEnd")}
            </h1>

            <m.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="measure mt-7 text-balance text-body-lg text-muted-foreground"
            >
              {t("subtitle")}
            </m.p>

            <m.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <Button href="#contact" size="lg" icon={<ArrowRight className="size-[18px]" />}>
                {t("primaryCta")}
              </Button>
              <Button href="#portfolio" size="lg" variant="outline">
                {t("secondaryCta")}
              </Button>
            </m.div>

            <m.ul
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </m.ul>
          </div>

          <m.div style={{ y: mockupParallaxY }}>
            <m.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.9, ease: EASE_OUT }}
            >
              <BrowserMockup />
            </m.div>
          </m.div>
        </div>
      </Container>

      <ScrollHint />
    </section>
  );
}
