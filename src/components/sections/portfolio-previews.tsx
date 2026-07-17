/**
 * Bespoke, per-project preview compositions for the Portfolio section.
 * Deliberately NOT a shared template with swapped colors — each project
 * gets its own layout logic and palette, the same way a real client
 * project would never reuse another client's visual system.
 *
 * Projects with a real screenshot (`project.image`) skip this entirely —
 * these abstract mockups are only a fallback for projects without one
 * (currently just MAX Digital, previewing itself).
 */

export function MaxDigitalPreview() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-card p-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="size-2 rounded-full bg-muted" />
        <span className="size-2 rounded-full bg-muted" />
        <span className="size-2 rounded-full bg-muted" />
        <div className="ml-2 flex h-5 flex-1 max-w-[160px] items-center rounded-[var(--radius-sm)] bg-secondary px-2 text-[10px] text-muted-foreground">
          maxdigital.studio
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex size-3.5 items-center justify-center rounded-[3px] bg-foreground/25" />
          <div className="h-2 w-14 rounded-full bg-foreground/15" />
        </div>
        <div className="h-6 w-14 rounded-[var(--radius-sm)]" style={{ background: "var(--color-accent)" }} />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2.5">
        <div className="h-2.5 w-20 rounded-full" style={{ background: "var(--color-accent)", opacity: 0.35 }} />
        <div className="h-5 w-[80%] rounded-md bg-foreground/20" />
        <div className="h-5 w-[55%] rounded-md bg-foreground/20" />
        <div className="mt-1 h-2 w-[60%] rounded-full bg-foreground/10" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 rounded-[var(--radius-sm)] border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}

export function LiveDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
      <span className="relative inline-flex size-2 rounded-full bg-success" />
    </span>
  );
}
