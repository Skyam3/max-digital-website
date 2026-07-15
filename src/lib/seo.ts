import { routing } from "@/i18n/routing";

export const siteUrl = "https://maxdigital.studio";

/** Absolute, locale-prefixed URL for a given path ("" = homepage). */
export function urlFor(locale: string, path = "") {
  const base = locale === routing.defaultLocale ? siteUrl : `${siteUrl}/${locale}`;
  return `${base}${path}`;
}

/** Canonical + hreflang alternates (incl. x-default) for a given path, reused
 * across the homepage and every standalone page so they stay consistent. */
export function localeAlternates(locale: string, path = "") {
  return {
    canonical: urlFor(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, urlFor(l, path)])),
      "x-default": urlFor(routing.defaultLocale, path),
    },
  };
}
