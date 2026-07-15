"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { routing } from "@/i18n/routing";

export function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  // This header renders on the homepage AND on standalone pages like
  // /impressum, but the section ids it links to (#services, #contact, …)
  // only exist on the homepage. A bare "#services" href would silently no-op
  // on any other page instead of navigating back — every link here goes
  // through this helper so it always resolves to "<locale homepage>#hash".
  const homePath = locale === routing.defaultLocale ? "" : `/${locale}`;
  const homeHref = (hash: string) => `${homePath}/${hash}`;

  // Pricing gets a spot in the primary nav (not just the footer sitemap)
  // deliberately: publishing real starting prices instead of hiding behind
  // "request a quote" is the site's strongest differentiator from typical
  // agencies, so it belongs where visitors can actually find it.
  const navLinks = [
    { label: t("services"), hash: "#services" },
    { label: t("portfolio"), hash: "#portfolio" },
    { label: t("pricing"), hash: "#pricing" },
    { label: t("about"), hash: "#why" },
    { label: t("contact"), hash: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled || open
          ? "border-b border-border bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <Container>
        <m.nav
          animate={{ height: scrolled ? 64 : 80 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="flex items-center justify-between"
          aria-label="Primary"
        >
          <a
            href={homeHref("#top")}
            className={cn(
              "shrink-0 transition-transform duration-200 ease-out hover:opacity-80 active:scale-95",
              scrolled && "scale-[0.94]"
            )}
            onClick={() => setOpen(false)}
          >
            <Logo />
          </a>

          <ul
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => (
              <li key={link.hash} className="relative" onMouseEnter={() => setHovered(link.hash)}>
                {hovered === link.hash && (
                  <m.span
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 rounded-[var(--radius-sm)] bg-secondary"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <a
                  href={homeHref(link.hash)}
                  className="relative z-10 block rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            {/* Button's href goes through next-intl's own Link internally,
                which already localizes any leading-slash path itself — pass
                the bare path here, not homeHref()'s manually-prefixed one,
                or the locale segment gets prepended twice ("/en/en#..."). */}
            <Button href="/#contact" size="sm" icon={<ArrowUpRight className="size-4" />}>
              {t("cta")}
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("closeMenu") : t("openMenu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] border border-border text-foreground transition-all duration-200 hover:border-border-strong hover:bg-secondary active:scale-90"
            >
              <Menu
                className="absolute size-5 transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: open ? "scale(0) rotate(90deg)" : "scale(1) rotate(0deg)",
                  opacity: open ? 0 : 1,
                }}
                aria-hidden="true"
              />
              <X
                className="absolute size-5 transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: open ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
                  opacity: open ? 1 : 0,
                }}
                aria-hidden="true"
              />
            </button>
          </div>
        </m.nav>
      </Container>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            className="overflow-hidden border-b border-border bg-background lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-6">
              {navLinks.map((link, i) => (
                <m.a
                  key={link.hash}
                  href={homeHref(link.hash)}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: DURATION.base }}
                  className="rounded-[var(--radius-md)] px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </m.a>
              ))}
              <m.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.04, duration: DURATION.base }}
                className="mt-3"
              >
                <Button href="/#contact" className="w-full" onClick={() => setOpen(false)}>
                  {t("cta")}
                </Button>
              </m.div>
            </Container>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
