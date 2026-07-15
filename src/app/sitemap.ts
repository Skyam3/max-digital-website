import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { urlFor } from "@/lib/seo";

const PAGES = [
  { path: "", priority: 1, changeFrequency: "monthly" as const },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((page) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, urlFor(l, page.path)])
    );

    return routing.locales.map((locale) => ({
      url: urlFor(locale, page.path),
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: locale === routing.defaultLocale ? page.priority : page.priority * 0.8,
      alternates: { languages },
    }));
  });
}
