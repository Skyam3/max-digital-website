"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

export function ScrollHint() {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex h-9 w-6 items-start justify-center rounded-full border border-border-strong p-1.5">
        <m.span
          className="h-1.5 w-1 rounded-full bg-accent"
          animate={shouldReduceMotion ? undefined : { y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </m.div>
  );
}
