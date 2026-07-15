import { Layers, Map as MapIcon, Search, Sparkles } from "lucide-react";

/**
 * Bespoke, per-project preview compositions for the Portfolio section.
 * Deliberately NOT a shared template with swapped colors — each project
 * gets its own layout logic and palette, the same way a real client
 * project would never reuse another client's visual system.
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

const FU_ACCENT = "#8b7cd6";

export function FantasyUniversePreview() {
  const nodes = [
    { x: "22%", y: "30%" },
    { x: "45%", y: "18%" },
    { x: "62%", y: "40%" },
    { x: "38%", y: "58%" },
    { x: "72%", y: "62%" },
    { x: "20%", y: "72%" },
  ];
  const links = [
    [0, 1],
    [1, 2],
    [0, 3],
    [3, 4],
    [3, 5],
  ];

  return (
    <div
      className="flex h-full overflow-hidden rounded-[var(--radius-md)] border border-border"
      style={{ background: "linear-gradient(160deg, #17142a, #0d0c16)" }}
    >
      <div className="flex w-12 flex-col items-center gap-4 border-r border-white/10 py-4">
        <Sparkles className="size-4" style={{ color: FU_ACCENT }} />
        <MapIcon className="size-4 text-white/30" />
        <Layers className="size-4 text-white/30" />
      </div>
      <div className="relative flex-1">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: `radial-gradient(circle at 35% 35%, ${FU_ACCENT}33, transparent 60%)` }}
        />
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          {links.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke={FU_ACCENT}
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          ))}
        </svg>
        {nodes.map((n, i) => (
          <span
            key={i}
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: n.x,
              top: n.y,
              background: FU_ACCENT,
              boxShadow: `0 0 12px 2px ${FU_ACCENT}88`,
            }}
          />
        ))}
        <div className="absolute bottom-3 left-3 h-2 w-16 rounded-full bg-white/15" />
        <div className="absolute bottom-3 right-3 rounded-[4px] bg-white/10 px-2 py-1 text-[9px] tracking-wide text-white/50">
          Chapter III
        </div>
      </div>
    </div>
  );
}

const TILE_SWATCHES = ["#c17a52", "#d9c19a", "#9c9188", "#8a9678", "#e8dfd0", "#a85c3f", "#c9b79c", "#6f6a63"];

export function TileCompanyPreview() {
  return (
    <div className="flex h-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
      <div className="hidden w-16 flex-col gap-2.5 border-r border-border p-3 sm:flex">
        <Search className="size-3.5 text-muted-foreground" />
        {["#c17a52", "#9c9188", "#8a9678"].map((c) => (
          <div key={c} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px]" style={{ background: c }} />
            <span className="h-1.5 w-6 rounded-full bg-foreground/10" />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="h-2 w-16 rounded-full bg-foreground/15" />
          <div className="h-2 w-8 rounded-full bg-foreground/10" />
        </div>
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          {TILE_SWATCHES.map((c, i) => (
            <div key={i} className="rounded-[3px]" style={{ background: c }} />
          ))}
        </div>
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
