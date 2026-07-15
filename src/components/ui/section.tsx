import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  id,
  surface = false,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
  /** Slightly elevated background to separate a section from its neighbors. */
  surface?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        // scroll-mt clears the fixed navbar (h-20, shrinks to h-16 on
        // scroll) when a hash link jumps straight to this section —
        // without it the header covers the first ~80px of content.
        "relative scroll-mt-28 py-24 md:py-32",
        surface && "bg-surface",
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "measure flex flex-col gap-5",
        align === "center" ? "items-center text-center mx-auto" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent">
          <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-h1 text-foreground">{title}</h2>
      {description && <p className="text-balance text-body-lg text-muted-foreground">{description}</p>}
    </div>
  );
}
