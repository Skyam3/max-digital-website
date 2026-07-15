"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { RevealGroup, revealItemVariants } from "@/components/ui/reveal";

interface Step {
  title: string;
  duration: string;
  description: string;
}

export function Process() {
  const t = useTranslations("Process");
  const steps = t.raw("steps") as Step[];

  return (
    <Section id="process">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <RevealGroup className="relative mx-auto mt-20 flex max-w-[720px] flex-col">
          <div
            className="absolute left-[19px] top-2 bottom-2 w-px bg-border"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <m.div
              key={step.title}
              variants={revealItemVariants}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-background text-sm font-medium text-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 pt-1.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-h3 text-foreground">{step.title}</h3>
                  <span className="text-xs font-medium uppercase tracking-wide text-accent">
                    {step.duration}
                  </span>
                </div>
                <p className="measure mt-2 text-small text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </m.div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
