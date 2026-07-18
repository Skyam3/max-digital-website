import { ArrowUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/logo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function Footer() {
  const tNav = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
  const tContact = useTranslations("Contact");
  const locale = useLocale();

  // Same reasoning as Navbar: the footer renders on /impressum and
  // /datenschutz too, so these section anchors need the homepage path,
  // not a bare hash that only resolves on the page they're rendered on.
  const homePath = locale === routing.defaultLocale ? "" : `/${locale}`;
  const homeHref = (hash: string) => `${homePath}/${hash}`;

  const sitemap = [
    { label: tNav("services"), hash: "#services" },
    { label: tNav("portfolio"), hash: "#portfolio" },
    { label: tNav("about"), hash: "#why" },
    { label: tNav("process"), hash: "#process" },
    { label: tNav("pricing"), hash: "#pricing" },
    { label: tNav("faq"), hash: "#faq" },
  ];

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-12 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="flex max-w-[320px] flex-col gap-4">
            <Logo />
            <p className="text-small text-muted-foreground">{tFooter("description")}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
              {sitemap.map((item) => (
                <li key={item.hash}>
                  <a
                    href={homeHref(item.hash)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={`mailto:${tContact("email")}`}
            className="text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            {tContact("email")}
          </a>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} MAX Digital. {tFooter("rights")}
            </p>
            <Link
              href="/impressum"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {tFooter("impressum")}
            </Link>
            <Link
              href="/datenschutz"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {tFooter("privacy")}
            </Link>
          </div>
          <a
            href={homeHref("#top")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {tFooter("backToTop")}
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
