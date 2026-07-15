import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Link } from "@/i18n/navigation";

interface LegalSection {
  heading: string;
  body: string;
}

export function LegalPage({
  title,
  updated,
  placeholderNotice,
  sections,
  backLink,
}: {
  title: string;
  updated: string;
  placeholderNotice: string;
  sections: LegalSection[];
  backLink: string;
}) {
  return (
    <Section className="pt-36 md:pt-44">
      <Container>
        <div className="measure mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {backLink}
          </Link>

          <h1 className="mt-8 text-h1 text-foreground">{title}</h1>
          <p className="mt-2 text-small text-muted-foreground">{updated}</p>

          <div className="mt-8 rounded-[var(--radius-lg)] border border-warning/30 bg-warning/10 p-5 text-small text-foreground/85">
            {placeholderNotice}
          </div>

          <div className="mt-12 flex flex-col gap-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-h3 text-foreground">{section.heading}</h2>
                <div className="mt-3 flex flex-col gap-2 text-body text-muted-foreground">
                  {section.body.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
