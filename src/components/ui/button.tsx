"use client";

import { forwardRef, type MouseEvent } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;

const base =
  "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-medium " +
  "transition-all duration-200 ease-out will-change-transform " +
  "hover:scale-[1.015] active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-45 disabled:hover:scale-100 " +
  "aria-disabled:pointer-events-none aria-disabled:opacity-45 aria-disabled:hover:scale-100 " +
  "focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:brightness-[1.08] hover:[box-shadow:var(--shadow-glow)]",
  secondary:
    "bg-secondary text-secondary-foreground border border-border hover:bg-card-hover hover:border-border-strong hover:-translate-y-0.5",
  outline:
    "bg-transparent text-foreground border border-border-strong hover:bg-secondary hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-foreground hover:bg-secondary/70",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "right",
      href,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled) || loading;
    const classes = cn(base, variants[variant], sizes[size], className);
    const content = (
      <>
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {!loading && icon && iconPosition === "left" && (
          <span
            aria-hidden="true"
            className="inline-flex transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            {icon}
          </span>
        )}
        <span>{children}</span>
        {!loading && icon && iconPosition === "right" && (
          <span
            aria-hidden="true"
            className="inline-flex transition-transform duration-200 group-hover:translate-x-0.5"
          >
            {icon}
          </span>
        )}
      </>
    );

    if (href) {
      // aria-disabled doesn't stop an <a> from being activated (unlike the
      // native `disabled` attribute on <button>), so it has to be enforced
      // by hand here — otherwise a "disabled" link button is still fully
      // clickable and keyboard-reachable.
      function handleLinkClick(e: MouseEvent<HTMLAnchorElement>) {
        if (isDisabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        (onClick as ((e: MouseEvent<HTMLAnchorElement>) => void) | undefined)?.(e);
      }

      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          aria-disabled={isDisabled}
          aria-busy={loading}
          tabIndex={isDisabled ? -1 : undefined}
          onClick={handleLinkClick}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
