"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<string, string> = {
  de: "DE",
  en: "EN",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-[var(--radius-md)] border border-border p-0.5 text-sm",
        className
      )}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          // A real <a href> per locale (not a JS-only onClick) so search
          // engines can discover and crawl each language version directly,
          // rather than relying solely on the hreflang metadata tags.
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-block rounded-[calc(var(--radius-md)-2px)] px-2.5 py-1.5 font-medium transition-all duration-200 active:scale-90",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
