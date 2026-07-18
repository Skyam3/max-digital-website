# MAX Digital

The official website for MAX Digital — a boutique web studio designing and
building premium websites for businesses that want to be trusted, not just
seen. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion and
next-intl (German default, English at `/en`).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) with your browser to see it.

## Before launch

A few things are still placeholders and need real content before this goes live:

- The three "Portfolio" concept case studies (`Portfolio.projects` in the
  message files) → swap in real client work once available
- **Legal pages** (`/impressum`, `/datenschutz` — content in
  `messages/de.json` / `en.json` under `Legal`): every field marked
  `[Placeholder]` (business name, address, phone, VAT ID, hosting provider)
  must be filled in with real details before launch. The Impressum is a
  **legal requirement** for a German business site (TMG §5), not optional
  polish. The Datenschutzerklärung is a technically accurate description of
  what the site currently does, but has **not** been reviewed by a lawyer —
  get that review, especially once a hosting provider or analytics are added.
- The site domain — currently `https://maxdigital.studio` throughout
  (`src/lib/seo.ts` is the single source; update it there)

## Architecture notes

- **i18n**: routing config in `src/i18n/routing.ts`, all copy in
  `messages/de.json` / `messages/en.json`. Adding a language means adding a
  locale to `routing.ts` and a matching message file — no component changes.
- **Design tokens**: colors, spacing, radii, shadows and the fluid type
  scale are CSS custom properties in `src/app/globals.css` (dark mode by
  default, light mode via the navbar toggle). Components read from these
  tokens rather than hardcoding values.
- **SEO**: canonical URLs, hreflang, OpenGraph/Twitter, and JSON-LD
  (Organization + WebSite + FAQPage) all live in `src/lib/seo.ts` and
  `src/app/[locale]/layout.tsx`. `robots.ts` and `sitemap.ts` are generated
  from the same locale config, so a new page or locale only needs adding in
  one place to stay consistent everywhere.
- **Motion**: Framer Motion is loaded via `LazyMotion` (see
  `motion-provider.tsx`) with only the `domAnimation` feature set — use `m`
  from `framer-motion`, not `motion`, when adding new animated components.

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new), from the
creators of Next.js.
