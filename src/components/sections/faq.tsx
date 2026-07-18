import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";

export function FAQ() {
  const t = useTranslations("FAQ");
  const items = t.raw("items") as AccordionItem[];

  // Generated from the same `items` the accordion renders below, so the
  // structured data can't drift out of sync with what's actually visible
  // on the page — a mismatch there is exactly what Google's guidelines
  // warn against.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("description")}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion items={items} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
