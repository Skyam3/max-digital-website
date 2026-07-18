import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MAX Digital";

// Satori (ImageResponse's renderer) doesn't have access to next/font — it
// needs raw font bytes passed via the `fonts` option. This fetches Fraunces
// Bold from Google's CSS2 API the same way Vercel's own og-image examples
// do: requesting without a browser user-agent makes the API respond with a
// `truetype` source instead of `woff2`, which is the format Satori accepts.
// Falls back to the system default (still legible, just not on-brand) if
// the fetch ever fails — a slow/broken font request must never break the
// share-image route itself.
async function loadFrauncesBold(): Promise<ArrayBuffer | null> {
  try {
    // Subset restricted to exactly the glyphs this file ever renders in
    // Fraunces (the icon's "M" and the "MAX" wordmark, both uppercase-only)
    // — Satori matches glyphs across all registered fonts regardless of the
    // requesting fontFamily, so a wider subset (e.g. lowercase) bleeds this
    // display face into unrelated sans-serif body/footer text.
    const cssUrl = `https://fonts.googleapis.com/css2?family=Fraunces:wght@700&text=${encodeURIComponent("MAX")}`;
    const css = await fetch(cssUrl).then((res) => res.text());
    const fontUrl = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    const res = await fetch(fontUrl);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });
  const fraunces = await loadFrauncesBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0a0a09",
          backgroundImage:
            "radial-gradient(ellipse 900px 560px at 15% -10%, rgba(217,123,79,0.28), transparent 65%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Satori (this project's ImageResponse renderer) rejects raw SVG
              <text> nodes outright, unlike the DOM-rendered Logo/LogoFull
              components — so the two-tone "M" is done here with a single
              hard-stop gradient behind clipped text instead of two SVG
              <text> layers. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#660033",
            }}
          >
            <span
              style={{
                fontFamily: fraunces ? "Fraunces" : "sans-serif",
                fontWeight: 700,
                fontSize: 34,
                lineHeight: 1,
                backgroundImage: "linear-gradient(to right, #D98404 50%, #F5EFE6 50%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              M
            </span>
            <div style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: "#D98404", marginTop: 4 }} />
          </div>
          <span
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              fontFamily: fraunces ? "Fraunces" : "sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#f7f6f2",
            }}
          >
            MAX
            <span style={{ fontFamily: "sans-serif", fontSize: 22, fontWeight: 500, color: "#9c988e" }}>
              Digital
            </span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 920 }}>
          <span
            style={{
              fontSize: 66,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#f7f6f2",
            }}
          >
            {t("titleStart")} {t("titleHighlight")} {t("titleEnd")}
          </span>
        </div>

        <span style={{ fontSize: 24, color: "#9c988e" }}>maxdigital.studio</span>
      </div>
    ),
    {
      ...size,
      fonts: fraunces ? [{ name: "Fraunces", data: fraunces, style: "normal", weight: 700 }] : [],
    }
  );
}
