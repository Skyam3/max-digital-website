"use client";

import { m } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { RevealGroup, revealItemVariants } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  /** Set once a plan has a temporary founding-customer price — the regular
   * `price` above is then shown small and struck through instead of large. */
  foundingPrice?: string;
  /** Custom's price is "Auf Anfrage" / "Let's talk" — text, not a number.
   * IBM Plex Mono is reserved for real price values (Brand Book v1,
   * Typography Philosophy), so this opts that one plan out of price-mono. */
  priceOnRequest?: boolean;
  description: string;
  features: string[];
}

export function Pricing() {
  const t = useTranslations("Pricing");
  const plans = t.raw("plans") as Plan[];
  const hasFoundingPrice = plans.some((plan) => plan.foundingPrice);

  return (
    <Section id="pricing" surface>
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const featured = plan.name === "Growth";
            const displayPrice = plan.foundingPrice ?? plan.price;
            return (
              <m.div
                key={plan.name}
                variants={revealItemVariants}
                className={cn(
                  "relative overflow-hidden rounded-[var(--radius-lg)] border transition-all duration-200 ease-out",
                  featured
                    ? "border-accent/40 bg-card [box-shadow:var(--shadow-glow)] lg:-translate-y-3 hover:-translate-y-4 hover:scale-[1.015]"
                    : "border-border bg-card [box-shadow:var(--inset-highlight),var(--shadow-sm)] hover:-translate-y-1 hover:scale-[1.01] hover:border-accent/30 hover:bg-card-hover hover:[box-shadow:var(--inset-highlight),var(--shadow-card-hover)]"
                )}
              >
                <SpotlightCard className="p-6 lg:p-7">
                  {(featured || plan.foundingPrice) && (
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {featured && <Badge variant="accent">{t("popularBadge")}</Badge>}
                      {plan.foundingPrice && <Badge variant="outline">{t("foundingPriceBadge")}</Badge>}
                    </div>
                  )}

                  <h3 className="text-h3 text-foreground">{plan.name}</h3>
                  <p className={cn("mt-3 text-h2 text-foreground", !plan.priceOnRequest && "price-mono")}>
                    {displayPrice}
                  </p>
                  {plan.foundingPrice && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("regularPriceLabel")} <span className="line-through">{plan.price}</span>
                    </p>
                  )}
                  <p className="mt-3 text-small text-muted-foreground">{plan.description}</p>

                  <ul className="mt-7 flex flex-1 flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href="#contact"
                    variant={featured ? "primary" : "secondary"}
                    className="mt-8 w-full"
                  >
                    {t("cta")}
                  </Button>
                </SpotlightCard>
              </m.div>
            );
          })}
        </RevealGroup>

        {hasFoundingPrice && (
          <p className="mt-8 text-center text-small text-muted-foreground">{t("foundingPriceNote")}</p>
        )}
      </Container>
    </Section>
  );
}
