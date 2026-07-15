"use client";

import type { ReactElement } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import {
  FantasyUniversePreview,
  LiveDot,
  MaxDigitalPreview,
  TileCompanyPreview,
} from "@/components/sections/portfolio-previews";

interface Project {
  id: string;
  name: string;
  type: string;
  live: boolean;
  summary: string;
  goal: string;
  challenge: string;
  solution: string;
  technology: string;
}

const PREVIEWS: Record<string, () => ReactElement> = {
  maxdigital: MaxDigitalPreview,
  fantasyuniverse: FantasyUniversePreview,
  tilecompany: TileCompanyPreview,
};

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
                conceptLabel={t("conceptLabel")}
                ctaLabel={t("cta")}
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
  conceptLabel,
  ctaLabel,
}: {
  project: Project;
  reverse: boolean;
  goalLabel: string;
  challengeLabel: string;
  solutionLabel: string;
  technologyLabel: string;
  liveLabel: string;
  conceptLabel: string;
  ctaLabel: string;
}) {
  const Preview = PREVIEWS[project.id];
  const techList = project.technology.split(",").map((t) => t.trim());

  return (
    <div className={cn("flex flex-col gap-10 lg:items-center lg:gap-16", reverse ? "lg:flex-row-reverse" : "lg:flex-row")}>
      <SpotlightCard className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface transition-all duration-200 ease-out hover:-translate-y-1 hover:border-border-strong hover:[box-shadow:var(--shadow-card-hover)] lg:w-[56%]">
        <div className="aspect-[4/3] p-3 sm:p-5">
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.035]">
            {Preview ? <Preview /> : null}
          </div>
        </div>
      </SpotlightCard>

      <div className="flex flex-col lg:w-[44%]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-muted-foreground">
            {project.type}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {project.live ? (
              <>
                <LiveDot />
                <span className="text-success">{liveLabel}</span>
              </>
            ) : (
              conceptLabel
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
