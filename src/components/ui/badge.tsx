import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "outline";
}) {
  const variants = {
    default: "bg-secondary text-secondary-foreground border-border",
    accent: "bg-accent-muted text-accent border-transparent",
    outline: "bg-transparent text-muted-foreground border-border-strong",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
