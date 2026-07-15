import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[15px] font-medium tracking-tight text-foreground",
        className
      )}
    >
      <span
        className="flex size-7 items-center justify-center rounded-[7px] bg-primary text-primary-foreground"
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 13V1L7 8L13 1V13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      MAX Digital
    </span>
  );
}
