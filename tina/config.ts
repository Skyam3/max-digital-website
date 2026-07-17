import { defineConfig } from "tinacms";

// Schritt 1: Nur Text-Felder, lokal. Kein Tina-Cloud-Auth, keine Bilder.
// Tina liest/schreibt DIREKT messages/de.json und messages/en.json —
// keine neue Content-Struktur, kein separater Content-Ordner.

const textField = (name: string, label: string, multiline = false) => ({
  type: "string" as const,
  name,
  label,
  ...(multiline ? { ui: { component: "textarea" as const } } : {}),
});

const trustItem = {
  type: "object" as const,
  name: "items",
  label: "Punkte",
  list: true,
  fields: [textField("title", "Titel"), textField("description", "Beschreibung", true)],
};

const featureListItem = (name: string, label: string) => ({
  type: "object" as const,
  name,
  label,
  list: true,
  fields: [
    textField("title", "Titel"),
    textField("description", "Beschreibung", true),
    {
      type: "string" as const,
      name: "features",
      label: "Features",
      list: true,
    },
  ],
});

export default defineConfig({
  branch:
    process.env.TINA_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  ui: {
    // Lets the admin show a "view preview" link for whichever branch this
    // deployment is serving (e.g. content-edits) instead of only main.
    previewUrl: (context) => ({
      url: `https://max-digital-website-git-${context.branch}-skyam3s-projects.vercel.app`,
    }),
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    // Vercel Blob instead of repo-backed media — no official Tina adapter
    // exists for it, so this is a custom store (tina/media-store.ts) backed
    // by src/app/api/tina-media/route.ts.
    loadCustomStore: async () => (await import("./media-store")).default,
  },
  schema: {
    collections: [
      {
        name: "messages",
        label: "Website-Texte",
        path: "messages",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "Metadata",
            label: "Metadaten (SEO)",
            fields: [
              textField("title", "Titel"),
              textField("titleTemplate", "Titel-Vorlage"),
              textField("description", "Beschreibung", true),
            ],
          },
          {
            type: "object",
            name: "Common",
            label: "Allgemein",
            fields: [textField("skipToContent", "Zum Inhalt springen")],
          },
          {
            type: "object",
            name: "ThemeToggle",
            label: "Hell/Dunkel-Umschalter",
            fields: [textField("toLight", "Zu Hell"), textField("toDark", "Zu Dunkel")],
          },
          {
            type: "object",
            name: "LanguageSwitcher",
            label: "Sprachumschalter",
            fields: [textField("label", "Label")],
          },
          {
            type: "object",
            name: "Nav",
            label: "Navigation",
            fields: [
              textField("services", "Leistungen"),
              textField("portfolio", "Referenzen"),
              textField("about", "Über mich"),
              textField("process", "Ablauf"),
              textField("pricing", "Preise"),
              textField("faq", "FAQ"),
              textField("contact", "Kontakt"),
              textField("cta", "CTA-Button"),
              textField("openMenu", "Menü öffnen"),
              textField("closeMenu", "Menü schließen"),
            ],
          },
          {
            type: "object",
            name: "Hero",
            label: "Hero-Bereich",
            fields: [
              textField("badge", "Badge"),
              textField("titleStart", "Titel Anfang"),
              textField("titleHighlight", "Titel Hervorhebung"),
              textField("titleEnd", "Titel Ende"),
              textField("subtitle", "Untertitel", true),
              textField("primaryCta", "Primärer CTA"),
              textField("secondaryCta", "Sekundärer CTA"),
              { type: "string", name: "trustPoints", label: "Vertrauenspunkte", list: true },
              {
                type: "object",
                name: "mockup",
                label: "Browser-Mockup",
                fields: [
                  textField("url", "URL"),
                  textField("speed", "Geschwindigkeit"),
                  textField("convert", "Conversion"),
                  textField("accessible", "Barrierefreiheit"),
                ],
              },
            ],
          },
          {
            type: "object",
            name: "Trust",
            label: "Trust-Bereich",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("title", "Titel"),
              textField("description", "Beschreibung", true),
              trustItem,
            ],
          },
          {
            type: "object",
            name: "Services",
            label: "Leistungen",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("title", "Titel"),
              textField("description", "Beschreibung", true),
              featureListItem("items", "Leistungen"),
            ],
          },
          {
            type: "object",
            name: "Pricing",
            label: "Preise",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("title", "Titel"),
              textField("description", "Beschreibung", true),
              textField("cta", "CTA-Button"),
              textField("popularBadge", "Badge „Am beliebtesten“"),
              {
                type: "object",
                name: "plans",
                label: "Pakete",
                list: true,
                fields: [
                  textField("name", "Name"),
                  textField("price", "Preis"),
                  textField("description", "Beschreibung", true),
                  { type: "string", name: "features", label: "Features", list: true },
                  { type: "boolean", name: "priceOnRequest", label: "Preis auf Anfrage" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "Portfolio",
            label: "Referenzen",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("title", "Titel"),
              textField("description", "Beschreibung", true),
              textField("goalLabel", "Label: Ziel"),
              textField("challengeLabel", "Label: Herausforderung"),
              textField("solutionLabel", "Label: Lösung"),
              textField("technologyLabel", "Label: Technologie"),
              textField("liveLabel", "Label: Live"),
              textField("conceptLabel", "Label: Konzeptprojekt"),
              textField("cta", "CTA-Button"),
              {
                type: "object",
                name: "projects",
                label: "Projekte",
                list: true,
                fields: [
                  textField("id", "ID"),
                  textField("name", "Name"),
                  textField("type", "Typ"),
                  { type: "boolean", name: "live", label: "Live?" },
                  textField("summary", "Zusammenfassung", true),
                  textField("goal", "Ziel", true),
                  textField("challenge", "Herausforderung", true),
                  textField("solution", "Lösung", true),
                  textField("technology", "Technologie"),
                ],
              },
            ],
          },
          {
            type: "object",
            name: "Why",
            label: "Über mich",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("founderName", "Name Gründer"),
              textField("founderRole", "Rolle Gründer"),
              textField("leadStatement", "Leitsatz", true),
              { type: "string", name: "paragraphs", label: "Absätze", list: true, ui: { component: "textarea" } },
              textField("signature", "Signatur"),
              {
                type: "object",
                name: "pillars",
                label: "Säulen",
                list: true,
                fields: [textField("title", "Titel"), textField("description", "Beschreibung", true)],
              },
            ],
          },
          {
            type: "object",
            name: "Process",
            label: "Ablauf",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("title", "Titel"),
              textField("description", "Beschreibung", true),
              {
                type: "object",
                name: "steps",
                label: "Schritte",
                list: true,
                fields: [
                  textField("title", "Titel"),
                  textField("duration", "Dauer"),
                  textField("description", "Beschreibung", true),
                ],
              },
            ],
          },
          {
            type: "object",
            name: "FAQ",
            label: "FAQ",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("title", "Titel"),
              textField("description", "Beschreibung", true),
              {
                type: "object",
                name: "items",
                label: "Fragen",
                list: true,
                fields: [textField("question", "Frage"), textField("answer", "Antwort", true)],
              },
            ],
          },
          {
            type: "object",
            name: "Contact",
            label: "Kontakt",
            fields: [
              textField("eyebrow", "Eyebrow"),
              textField("title", "Titel"),
              textField("description", "Beschreibung", true),
              textField("email", "E-Mail"),
              textField("responseTime", "Antwortzeit"),
              textField("noPressure", "Hinweis (kein Druck)"),
              {
                type: "object",
                name: "form",
                label: "Formular",
                fields: [
                  textField("name", "Label: Name"),
                  textField("namePlaceholder", "Platzhalter: Name"),
                  textField("email", "Label: E-Mail"),
                  textField("emailPlaceholder", "Platzhalter: E-Mail"),
                  textField("projectType", "Label: Projektart"),
                  textField("selectOne", "Auswahl-Hinweis"),
                  textField("budget", "Label: Budget"),
                  textField("message", "Label: Nachricht"),
                  textField("messagePlaceholder", "Platzhalter: Nachricht"),
                  textField("submit", "Button: Senden"),
                  textField("submitting", "Status: Wird gesendet"),
                  textField("successTitle", "Erfolg: Titel"),
                  textField("successDescription", "Erfolg: Beschreibung", true),
                  textField("error", "Fehlermeldung"),
                ],
              },
              { type: "string", name: "projectTypes", label: "Projektarten", list: true },
              { type: "string", name: "budgets", label: "Budget-Optionen", list: true },
            ],
          },
          {
            type: "object",
            name: "Footer",
            label: "Footer",
            fields: [
              textField("description", "Beschreibung", true),
              textField("rights", "Copyright-Hinweis"),
              textField("backToTop", "Nach oben"),
              textField("impressum", "Impressum-Link"),
              textField("privacy", "Datenschutz-Link"),
            ],
          },
          {
            type: "object",
            name: "Legal",
            label: "Rechtliches",
            fields: [
              textField("backLink", "Zurück-Link"),
              {
                type: "object",
                name: "impressum",
                label: "Impressum",
                fields: [
                  textField("title", "Titel"),
                  textField("updated", "Stand"),
                  textField("placeholderNotice", "Platzhalter-Hinweis", true),
                  {
                    type: "object",
                    name: "sections",
                    label: "Abschnitte",
                    list: true,
                    fields: [textField("heading", "Überschrift"), textField("body", "Text", true)],
                  },
                ],
              },
              {
                type: "object",
                name: "privacy",
                label: "Datenschutz",
                fields: [
                  textField("title", "Titel"),
                  textField("updated", "Stand"),
                  textField("placeholderNotice", "Platzhalter-Hinweis", true),
                  {
                    type: "object",
                    name: "sections",
                    label: "Abschnitte",
                    list: true,
                    fields: [textField("heading", "Überschrift"), textField("body", "Text", true)],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
