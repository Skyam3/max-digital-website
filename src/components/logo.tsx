import { useId } from "react";
import { Fraunces } from "next/font/google";
import { cn } from "@/lib/utils";

// Only this file needs Fraunces — the brand mark's "M" (and, in LogoFull,
// "MAX") render as real SVG <text>, not vector paths, so the font has to
// actually be loaded or the browser silently falls back to Georgia/serif.
// Kept out of the global font set in [locale]/layout.tsx on purpose: it's
// a display face used only in the logo mark, not body/heading copy.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

/** The icon mark alone: a two-tone "M" split across a rounded wine-violet
 * square, per public/logo/icon.svg. `useId` keeps the clip-path ids
 * collision-free if this ever renders more than once on a page. */
function Icon({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 240 240"
      className={cn("size-7 shrink-0", fraunces.className, className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`${id}-left`}>
          <rect x="20" y="20" width="100" height="200" />
        </clipPath>
        <clipPath id={`${id}-right`}>
          <rect x="120" y="20" width="100" height="200" />
        </clipPath>
      </defs>
      <rect x="20" y="20" width="200" height="200" rx="44" fill="#660033" />
      <g clipPath={`url(#${id}-left)`}>
        <text x="120" y="162" fontWeight={700} fontSize={130} fill="#D98404" textAnchor="middle">
          M
        </text>
      </g>
      <g clipPath={`url(#${id}-right)`}>
        <text x="120" y="162" fontWeight={700} fontSize={130} fill="#F5EFE6" textAnchor="middle">
          M
        </text>
      </g>
      <rect x="90" y="176" width="60" height="12" rx="6" fill="#D98404" />
    </svg>
  );
}

/** Compact mark used in the navbar: the icon plus a plain-text wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[15px] font-medium tracking-tight text-foreground",
        className
      )}
    >
      <Icon />
      MAX Digital
    </span>
  );
}

/** Full lockup (icon + "MAX" / "Digital" wordmark), per
 * public/logo/logo-full.svg and logo-full-dark.svg. Rather than swapping
 * between those two static files, "MAX"/"Digital" use the same
 * `--color-foreground`/`--color-muted-foreground` tokens every other themed
 * component already uses — the two reference files' colors are just those
 * tokens' light/dark values, so one markup adapts to both automatically
 * instead of needing a client-side theme check. The icon square's own
 * colors are brand-fixed and identical in both reference files. */
export function LogoFull({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 560 160"
      className={cn("h-10 w-auto", fraunces.className, className)}
      role="img"
      aria-label="MAX Digital"
    >
      <defs>
        <clipPath id={`${id}-full-left`}>
          <rect x="20" y="20" width="60" height="120" />
        </clipPath>
        <clipPath id={`${id}-full-right`}>
          <rect x="80" y="20" width="60" height="120" />
        </clipPath>
      </defs>
      <rect x="20" y="20" width="120" height="120" rx="26" fill="#660033" />
      <g clipPath={`url(#${id}-full-left)`}>
        <text x="80" y="103" fontWeight={700} fontSize={80} fill="#D98404" textAnchor="middle">
          M
        </text>
      </g>
      <g clipPath={`url(#${id}-full-right)`}>
        <text x="80" y="103" fontWeight={700} fontSize={80} fill="#F5EFE6" textAnchor="middle">
          M
        </text>
      </g>
      <rect x="56" y="112" width="48" height="8" rx="4" fill="#D98404" />
      <text x="168" y="82" fontWeight={600} fontSize={46} fill="var(--color-foreground)">
        MAX
      </text>
      <text
        x="168"
        y="120"
        className="font-sans"
        fontWeight={500}
        fontSize={28}
        fill="var(--color-muted-foreground)"
      >
        Digital
      </text>
    </svg>
  );
}
