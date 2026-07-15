"use client";

import { useState, type FormEvent } from "react";
import { Mail, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const t = useTranslations("Contact");
  const projectTypes = t.raw("projectTypes") as string[];
  const budgets = t.raw("budgets") as string[];
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section id="contact" surface>
      <Container>
        <div className="grid grid-cols-1 gap-14 rounded-[var(--radius-xl)] border border-border bg-card p-8 [box-shadow:var(--inset-highlight),var(--shadow-md)] sm:p-12 md:grid-cols-[minmax(0,380px)_1fr] md:gap-16 md:p-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
              {t("eyebrow")}
            </span>
            <h2 className="mt-5 text-balance text-h2 text-foreground">{t("title")}</h2>
            <p className="measure-narrow mt-4 text-balance text-body text-muted-foreground">
              {t("description")}
            </p>

            <div className="mt-9 flex flex-col gap-4">
              <a
                href={`mailto:${t("email")}`}
                className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-accent"
              >
                <Mail className="size-[18px] text-accent" aria-hidden="true" />
                {t("email")}
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="size-[18px] text-accent" aria-hidden="true" />
                {t("responseTime")}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {status === "success" ? (
              <div
                role="status"
                className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-10 text-center"
              >
                <CheckCircle2 className="size-10 text-accent" aria-hidden="true" />
                <h3 className="text-h3 text-foreground">{t("form.successTitle")}</h3>
                <p className="measure-narrow text-small text-muted-foreground">
                  {t("form.successDescription")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label={t("form.name")} htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="input-field"
                    placeholder={t("form.namePlaceholder")}
                  />
                </Field>

                <Field label={t("form.email")} htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="input-field"
                    placeholder={t("form.emailPlaceholder")}
                  />
                </Field>

                <Field label={t("form.projectType")} htmlFor="projectType">
                  <select id="projectType" name="projectType" className="input-field" defaultValue="">
                    <option value="" disabled>
                      {t("form.selectOne")}
                    </option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={t("form.budget")} htmlFor="budget">
                  <select id="budget" name="budget" className="input-field" defaultValue="">
                    <option value="" disabled>
                      {t("form.selectOne")}
                    </option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={t("form.message")} htmlFor="message" className="sm:col-span-2">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="input-field resize-none"
                    placeholder={t("form.messagePlaceholder")}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    loading={status === "submitting"}
                    icon={<ArrowRight className="size-[18px]" />}
                  >
                    {status === "submitting" ? t("form.submitting") : t("form.submit")}
                  </Button>
                  {status === "error" ? (
                    <p role="alert" className="mt-3 text-sm text-error">
                      {t("form.error")}
                    </p>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">{t("noPressure")}</p>
                  )}
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-foreground transition-colors duration-200 group-focus-within:text-accent"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
