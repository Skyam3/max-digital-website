"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("toLight") : t("toDark")}
      aria-pressed={!isDark}
      className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border text-muted-foreground transition-all duration-200 hover:border-border-strong hover:text-foreground hover:bg-secondary active:scale-90"
    >
      <Sun
        className="absolute size-[18px] transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isDark ? "scale(0) rotate(90deg)" : "scale(1) rotate(0deg)",
          opacity: isDark ? 0 : 1,
        }}
        aria-hidden="true"
      />
      <Moon
        className="absolute size-[18px] transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isDark ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
          opacity: isDark ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </button>
  );
}
