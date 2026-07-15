import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Services } from "@/components/sections/services";
import { Pricing } from "@/components/sections/pricing";
import { Portfolio } from "@/components/sections/portfolio";
import { Why } from "@/components/sections/why";
import { Process } from "@/components/sections/process";
import { FAQ } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

// Note: below-the-fold sections were tried as next/dynamic code-split
// chunks (per "use lazy loading"), then measured with Lighthouse. Mobile
// performance got *worse* (LCP 2.8s->3.0s, main-thread work 2.6s->3.7s,
// score 96->93): every section here is part of the same initial scroll's
// meaningful content, not truly deferred, so splitting only added chunk-
// coordination and extra-request overhead. Reverted based on that
// measurement — the LazyMotion split (see motion-provider.tsx) and the
// Hero LCP fix are where lazy-loading/deferral actually paid off.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <Trust />
        <Services />
        <Portfolio />
        <Why />
        <Process />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
