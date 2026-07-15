"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="flex flex-col divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-card-hover sm:px-8",
                  isOpen && "bg-card-hover"
                )}
              >
                <span className="text-body font-medium text-foreground">{item.question}</span>
                <ChevronDown
                  className={cn(
                    "size-[18px] shrink-0 text-muted-foreground transition-transform duration-200 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                    isOpen && "rotate-180 text-accent"
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <p className="measure px-6 pb-6 text-small text-muted-foreground sm:px-8">
                    {item.answer}
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
