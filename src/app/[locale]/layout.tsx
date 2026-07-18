import type { Metadata, Viewport } from "next";
import { Lora, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";
import { routing } from "@/i18n/routing";
import { localeAlternates, siteUrl, urlFor } from "@/lib/seo";

// Brand Book v1 typography: Lora (headings), Plus Jakarta Sans (body/UI),
// IBM Plex Mono (prices only). Each loads only the weights the design
// tokens actually request — headings and prices are always weight 500
// (never bold/semibold anywhere on the site, confirmed via a full-repo
// grep), body text uses 400/500 (regular copy, medium labels/buttons) —
// so no unused font files ship to the browser.
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ogLocales: Record<string, string> = { de: "de_DE", en: "en_US" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const otherLocales = routing.locales.filter((l) => l !== locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    authors: [{ name: "MAX Digital" }],
    creator: "MAX Digital",
    alternates: localeAlternates(locale),
    openGraph: {
      type: "website",
      url: urlFor(locale),
      title: t("title"),
      description: t("description"),
      siteName: "MAX Digital",
      locale: ogLocales[locale] ?? locale,
      alternateLocale: otherLocales.map((l) => ogLocales[l] ?? l),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a09" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Common" });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });

  // A linked graph (Organization + WebSite cross-referenced via @id) rather
  // than a single flat Organization block — the standard, scalable pattern
  // for structured data that can grow (e.g. Service/Offer entities later)
  // without needing to restructure what's already there.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "MAX Digital",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/icon.svg`,
        },
        description: tMeta("description"),
        email: "kontakt.max.digital@gmail.com",
        founder: {
          "@type": "Person",
          name: "Max",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "MAX Digital",
        description: tMeta("description"),
        inLanguage: locale,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${lora.variable} ${plusJakartaSans.variable} ${ibmPlexMono.variable} h-full scroll-pt-20`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <ThemeProvider>
            <MotionProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
              >
                {t("skipToContent")}
              </a>
              {children}
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        {/* Next.js hoists beforeInteractive scripts into <head> regardless
            of where they're placed — but only when placed as documented
            (a sibling of <body>, not nested inside a hand-authored <head>).
            Nesting it in <head> alongside another literal <script> tag is
            what triggered React's "script tag while rendering" dev warning. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
