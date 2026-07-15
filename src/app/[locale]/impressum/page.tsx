import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { localeAlternates } from "@/lib/seo";

interface LegalSection {
  heading: string;
  body: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.impressum" });

  return {
    title: t("title"),
    alternates: localeAlternates(locale, "/impressum"),
    robots: { index: true, follow: true },
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Legal" });
  const ti = await getTranslations({ locale, namespace: "Legal.impressum" });

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <LegalPage
          title={ti("title")}
          updated={ti("updated")}
          placeholderNotice={ti("placeholderNotice")}
          sections={ti.raw("sections") as LegalSection[]}
          backLink={t("backLink")}
        />
      </main>
      <Footer />
    </>
  );
}
