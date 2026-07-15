"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  Gauge,
  MessageSquareHeart,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { RevealGroup, revealItemVariants } from "@/components/ui/reveal";

const ICONS: LucideIcon[] = [
  BadgeCheck,
  ShieldCheck,
  TrendingUp,
  Gauge,
  Smartphone,
  MessageSquareHeart,
];

interface TrustItem {
  title: string;
  description: string;
}

export function Trust() {
  const t = useTranslations("Trust");
  const items = t.raw("items") as TrustItem[];

  return (
    <Section id="trust">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <m.div
                key={item.title}
                variants={revealItemVariants}
                className="card-interactive rounded-[var(--radius-lg)] border border-border bg-card [box-shadow:var(--inset-highlight),var(--shadow-sm)]"
              >
                <SpotlightCard className="p-8">
                  <div className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-accent-muted text-accent transition-transform duration-200 group-hover:scale-105">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-h3 text-foreground">{item.title}</h3>
                  <p className="mt-2 text-small text-muted-foreground">{item.description}</p>
                </SpotlightCard>
              </m.div>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
