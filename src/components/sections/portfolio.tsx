"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { ArrowLeftRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

// react-compare-slider computes some of its inline styles (CSS custom
// properties driving the drag position) only once mounted in the browser,
// which produced a real server/client markup mismatch under SSR. It's a
// drag/keyboard-interactive widget anyway, so there's nothing useful to
// server-render — load it client-only.
const ReactCompareSlider = dynamic(() => import("react-compare-slider").then((mod) => mod.ReactCompareSlider), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-card" />,
});
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { LiveDot } from "@/components/sections/portfolio-previews";

/** Real pixel dimensions travel with every screenshot so the carousel can
 * size its container to the image's actual aspect ratio instead of forcing
 * every slide into one fixed box (which either crops or letterboxes). */
interface SizedImage {
  src: string;
  width: number;
  height: number;
}

interface BeforeAfterPair {
  before: SizedImage;
  after: SizedImage;
}

interface Project {
  id: string;
  name: string;
  type: string;
  status: "live" | "pilot" | "concept";
  /** Real screenshots (carousel) to show instead of an abstract Preview component. */
  images?: SizedImage[];
  /** Synced before/after column pairs — takes priority over `images` when set. */
  beforeAfterImages?: BeforeAfterPair[];
  summary: string;
  goal: string;
  challenge: string;
  solution: string;
  technology: string;
}

export function Portfolio() {
  const t = useTranslations("Portfolio");
  const projects = t.raw("projects") as Project[];

  return (
    <Section id="portfolio">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <div className="mt-20 flex flex-col gap-20 lg:gap-28">
          {projects.map((project, i) => (
            <Reveal key={project.id}>
              <CaseStudy
                project={project}
                reverse={i % 2 === 1}
                goalLabel={t("goalLabel")}
                challengeLabel={t("challengeLabel")}
                solutionLabel={t("solutionLabel")}
                technologyLabel={t("technologyLabel")}
                liveLabel={t("liveLabel")}
                pilotLabel={t("pilotLabel")}
                conceptLabel={t("conceptLabel")}
                beforeAfterLabel={t("beforeAfterLabel")}
                beforeLabel={t("beforeLabel")}
                afterLabel={t("afterLabel")}
                ctaLabel={t("cta")}
                prevLabel={t("carouselPrevious")}
                nextLabel={t("carouselNext")}
                goToLabel={(n: number) => t("carouselGoToImage", { number: n })}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CaseStudy({
  project,
  reverse,
  goalLabel,
  challengeLabel,
  solutionLabel,
  technologyLabel,
  liveLabel,
  pilotLabel,
  conceptLabel,
  beforeAfterLabel,
  beforeLabel,
  afterLabel,
  ctaLabel,
  prevLabel,
  nextLabel,
  goToLabel,
}: {
  project: Project;
  reverse: boolean;
  goalLabel: string;
  challengeLabel: string;
  solutionLabel: string;
  technologyLabel: string;
  liveLabel: string;
  pilotLabel: string;
  conceptLabel: string;
  beforeAfterLabel: string;
  beforeLabel: string;
  afterLabel: string;
  ctaLabel: string;
  prevLabel: string;
  nextLabel: string;
  goToLabel: (n: number) => string;
}) {
  const techList = project.technology.split(",").map((t) => t.trim());
  const hasBeforeAfter = !!project.beforeAfterImages && project.beforeAfterImages.length > 0;

  return (
    <div className={cn("flex flex-col gap-10 lg:items-center lg:gap-16", reverse ? "lg:flex-row-reverse" : "lg:flex-row")}>
      <SpotlightCard className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface transition-all duration-200 ease-out hover:-translate-y-1 hover:border-border-strong hover:[box-shadow:var(--shadow-card-hover)] lg:w-[56%]">
        <div className="p-3 sm:p-5">
          <div className="overflow-hidden rounded-[var(--radius-md)] bg-card">
            {hasBeforeAfter ? (
              <BeforeAfterCarousel
                pairs={project.beforeAfterImages!}
                alt={project.name}
                prevLabel={prevLabel}
                nextLabel={nextLabel}
                goToLabel={goToLabel}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
              />
            ) : project.images && project.images.length > 0 ? (
              <ProjectCarousel
                images={project.images}
                alt={project.name}
                prevLabel={prevLabel}
                nextLabel={nextLabel}
                goToLabel={goToLabel}
              />
            ) : null}
          </div>
        </div>
      </SpotlightCard>

      <div className="flex flex-col lg:w-[44%]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-muted-foreground">
            {project.type}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {hasBeforeAfter ? (
              <>
                <ArrowLeftRight className="size-3 text-accent" aria-hidden="true" />
                <span className="text-accent">{beforeAfterLabel}</span>
              </>
            ) : (
              <>
                {project.status === "live" && (
                  <>
                    <LiveDot />
                    <span className="text-success">{liveLabel}</span>
                  </>
                )}
                {project.status === "pilot" && (
                  <>
                    <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                    <span className="text-accent">{pilotLabel}</span>
                  </>
                )}
                {project.status === "concept" && conceptLabel}
              </>
            )}
          </span>
        </div>

        <h3 className="mt-4 text-h2 text-foreground">{project.name}</h3>
        <p className="mt-3 text-body-lg text-muted-foreground">{project.summary}</p>

        <dl className="mt-7 flex flex-col gap-5 border-t border-border pt-7 text-small">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-accent">{goalLabel}</dt>
            <dd className="mt-1.5 text-foreground/85">{project.goal}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-accent">{challengeLabel}</dt>
            <dd className="mt-1.5 text-foreground/85">{project.challenge}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-accent">{solutionLabel}</dt>
            <dd className="mt-1.5 text-foreground/85">{project.solution}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {technologyLabel}
          </span>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {techList.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <Button href="#contact" variant="outline" className="mt-8 self-start" icon={<ArrowUpRight className="size-4" />}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

const AUTOPLAY_INTERVAL_MS = 4500;
// After the visitor manually navigates, autoplay stays off for a while
// rather than yanking the image forward mid-interaction.
const INTERACTION_COOLDOWN_MS = 6000;
// Beyond this many images, individual dots get cramped — switch to a
// compact "3/7"-style counter instead.
const DOT_NAV_MAX_IMAGES = 5;

/** Shared index/autoplay state machine behind every portfolio carousel
 * variant (single-image and synced before/after) — same pause-on-hover/
 * focus/off-screen/reduced-motion and manual-interaction-cooldown rules
 * either way, just driving a different number of "slides". */
function useCarouselAutoplay(itemCount: number) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (next: number) => setIndex((next + itemCount) % itemCount);

  // A click on an arrow or dot is deliberate — don't immediately override
  // it with an autoplay tick. Pause autoplay for a beat, then resume.
  const goToManually = (next: number) => {
    goTo(next);
    setIsInteractionPaused(true);
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
    cooldownTimeoutRef.current = setTimeout(() => setIsInteractionPaused(false), INTERACTION_COOLDOWN_MS);
  };

  useEffect(() => () => {
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current);
  }, []);

  // Only autoplay while the card is actually on screen — no point cycling
  // images nobody can see.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (itemCount <= 1) return;
    if (shouldReduceMotion) return;
    if (isHovered || isFocused || isInteractionPaused || !isInView) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % itemCount);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [itemCount, shouldReduceMotion, isHovered, isFocused, isInteractionPaused, isInView]);

  return { index, goToManually, containerRef, setIsHovered, setIsFocused };
}

// Container height animates between an image's real aspect ratio and the
// next one's on slide change, clamped so a very tall/narrow or very
// short/wide outlier screenshot can't blow up or shrink the card.
const MIN_CARD_HEIGHT = "14rem";
const MAX_CARD_HEIGHT = "32rem";
const HEIGHT_TRANSITION_MS = 350;

function ProjectCarousel({
  images,
  alt,
  prevLabel,
  nextLabel,
  goToLabel,
}: {
  images: SizedImage[];
  alt: string;
  prevLabel: string;
  nextLabel: string;
  goToLabel: (n: number) => string;
}) {
  const { index, goToManually, containerRef, setIsHovered, setIsFocused } = useCarouselAutoplay(
    images.length
  );
  const current = images[index];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden transition-[aspect-ratio] ease-out motion-reduce:transition-none"
      style={{
        aspectRatio: `${current.width} / ${current.height}`,
        minHeight: MIN_CARD_HEIGHT,
        maxHeight: MAX_CARD_HEIGHT,
        transitionDuration: `${HEIGHT_TRANSITION_MS}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Image
        key={current.src}
        src={current.src}
        alt={`${alt} — ${index + 1}/${images.length}`}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goToManually(index - 1)}
            aria-label={prevLabel}
            className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => goToManually(index + 1)}
            aria-label={nextLabel}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <ChevronRight className="size-4" />
          </button>

          {images.length > DOT_NAV_MAX_IMAGES ? (
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium tabular-nums text-foreground shadow-sm backdrop-blur"
              aria-hidden="true"
            >
              {index + 1}/{images.length}
            </div>
          ) : (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => goToManually(i)}
                  aria-label={goToLabel(i + 1)}
                  aria-current={i === index}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    i === index ? "bg-foreground" : "bg-foreground/40 hover:bg-foreground/70"
                  )}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Drag-to-compare variant for the MAX Digital card: a single full-size
 * area with "before" and "after" overlaid behind a draggable divider
 * (react-compare-slider handles drag/touch/keyboard). Arrow/dot navigation
 * between the 4 section pairs reuses the same autoplay state machine as
 * every other carousel — only the display *within* a pair differs. The
 * slider remounts (`key={index}`) on pair change so the divider resets to
 * center rather than carrying a stale drag position to unrelated images. */
function BeforeAfterCarousel({
  pairs,
  alt,
  prevLabel,
  nextLabel,
  goToLabel,
  beforeLabel,
  afterLabel,
}: {
  pairs: BeforeAfterPair[];
  alt: string;
  prevLabel: string;
  nextLabel: string;
  goToLabel: (n: number) => string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const { index, goToManually, containerRef, setIsHovered, setIsFocused } = useCarouselAutoplay(
    pairs.length
  );
  const current = pairs[index];
  // Before/after share one container, so they must share one target aspect
  // ratio too (react-compare-slider overlays both in the same box) — split
  // the difference between the two rather than favoring either side.
  const beforeRatio = current.before.width / current.before.height;
  const afterRatio = current.after.width / current.after.height;
  const pairAspectRatio = (beforeRatio + afterRatio) / 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden transition-[aspect-ratio] ease-out motion-reduce:transition-none"
      style={{
        aspectRatio: pairAspectRatio,
        minHeight: MIN_CARD_HEIGHT,
        maxHeight: MAX_CARD_HEIGHT,
        transitionDuration: `${HEIGHT_TRANSITION_MS}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <ReactCompareSlider
        key={index}
        keyboardIncrement="5%"
        className="h-full w-full"
        itemOne={
          <div className="relative h-full w-full bg-card">
            <Image
              src={current.before.src}
              alt={`${alt} — ${beforeLabel}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        }
        itemTwo={
          <div className="relative h-full w-full bg-card">
            <Image
              src={current.after.src}
              alt={`${alt} — ${afterLabel}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        }
      />
      <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground shadow-sm backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-2 top-2 z-10 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground shadow-sm backdrop-blur">
        {afterLabel}
      </span>

      {pairs.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goToManually(index - 1)}
            aria-label={prevLabel}
            className="absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => goToManually(index + 1)}
            aria-label={nextLabel}
            className="absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            <ChevronRight className="size-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {pairs.map((pair, i) => (
              <button
                key={pair.before.src}
                type="button"
                onClick={() => goToManually(i)}
                aria-label={goToLabel(i + 1)}
                aria-current={i === index}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === index ? "bg-foreground" : "bg-foreground/40 hover:bg-foreground/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
