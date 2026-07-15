import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // German is the primary/default locale — served at "/" with no prefix.
  // English lives under "/en". Add new locales here (e.g. "es") to scale.
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
