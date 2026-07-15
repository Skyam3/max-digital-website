"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Check,
  Palette,
  Rocket,
  RefreshCw,
  Gauge,
  Search,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { RevealGroup, revealItemVariants } from "@/components/ui/reveal";

const ICONS: LucideIcon[] = [Palette, Rocket, RefreshCw, Gauge, Search, LifeBuoy];

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
}

export function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <Section id="services" surface>
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <m.div
                key={service.title}
                variants={revealItemVariants}
                className="card-interactive rounded-[var(--radius-lg)] border border-border bg-card [box-shadow:var(--inset-highlight),var(--shadow-sm)]"
              >
                <SpotlightCard className="p-8">
                  <div className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-accent-muted text-accent transition-transform duration-200 group-hover:scale-105">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-h3 text-foreground">{service.title}</h3>
                  <p className="mt-2.5 text-small text-muted-foreground">{service.description}</p>

                  <ul className="mt-5 flex flex-col gap-2.5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </m.div>
            );
          })}
        </RevealGroup>
      </Container>
    </Section>
  );
}
