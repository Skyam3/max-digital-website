import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MAX Digital";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#f7f6f2",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 13V1L7 8L13 1V13"
                stroke="#0a0a09"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 30, fontWeight: 600, color: "#f7f6f2" }}>MAX Digital</span>
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
    { ...size }
  );
}
