"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/ui/reveal";

interface Pillar {
  title: string;
  description: string;
}

export function Why() {
  const t = useTranslations("Why");
  const paragraphs = t.raw("paragraphs") as string[];
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <Section id="why" surface>
      <Container>
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
          <Reveal>
            <div className="md:sticky md:top-32">
              <div
                className="flex aspect-square w-full max-w-[220px] items-center justify-center rounded-[var(--radius-xl)] border border-border text-6xl font-medium text-accent"
                style={{
                  background:
                    "linear-gradient(155deg, var(--color-accent-muted), var(--color-surface))",
                }}
                aria-hidden="true"
              >
                M
              </div>
              <p className="mt-6 text-base font-medium text-foreground">{t("founderName")}</p>
              <p className="text-sm text-muted-foreground">{t("founderRole")}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              {t("eyebrow")}
            </span>

            <h2 className="measure text-balance text-h2 text-foreground">{t("leadStatement")}</h2>

            <div className="measure flex flex-col gap-5 text-body-lg text-muted-foreground">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <p className="mt-2 font-mono text-sm text-foreground/70">{t("signature")}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <m.div
              key={pillar.title}
              variants={revealItemVariants}
              className="card-interactive rounded-[var(--radius-lg)] border border-border bg-card [box-shadow:var(--inset-highlight),var(--shadow-sm)]"
            >
              <SpotlightCard className="p-6">
                <h3 className="text-h3 text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-small text-muted-foreground">{pillar.description}</p>
              </SpotlightCard>
            </m.div>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
