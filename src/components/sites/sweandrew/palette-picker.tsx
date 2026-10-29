"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PALETTES, setPalette, usePalette, type Palette } from "@/lib/theme";

// Each swatch is split diagonally: the palette's dark-mode accent and its light-mode accent.
const palettes: Record<Palette, { name: string; dark: string; light: string }> = {
  mono: { name: "Mono", dark: "#f5f5f5", light: "#171717" },
  cobalt: { name: "Cobalt", dark: "#7aa2ff", light: "#2152e8" },
  mint: { name: "Mint", dark: "#5eead4", light: "#0f766e" },
  amber: { name: "Amber", dark: "#f2a948", light: "#b4470f" },
  emerald: { name: "Emerald", dark: "#4ade80", light: "#15803d" },
  vermilion: { name: "Vermilion", dark: "#ff6b4a", light: "#c92a12" },
};

function Swatch({ palette, className }: { palette: Palette; className: string }) {
  const p = palettes[palette];
  return (
    <span
      aria-hidden
      className={`block flex-none rounded-full ring-1 ring-inset ring-bone/25 ${className}`}
      style={{ background: `linear-gradient(135deg, ${p.dark} 50%, ${p.light} 50%)` }}
    />
  );
}

export function PalettePicker() {
  const current = usePalette();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-5 right-5 z-[70]">
      <AnimatePresence>
        {open && (
          <motion.div
            role="radiogroup"
            aria-label="Color palette"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full right-0 mb-3 w-56 origin-bottom-right rounded-2xl border border-line bg-surface p-2 shadow-xl"
          >
            <p className="px-3 pb-2 pt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
              Color palette
            </p>
            {PALETTES.map((p) => {
              const selected = p === current;
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPalette(p)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2 ${
                    selected ? "bg-surface-2 text-bone" : "text-muted"
                  }`}
                >
                  <Swatch palette={p} className="h-5 w-5" />
                  <span className="flex-1">{palettes[p].name}</span>
                  {selected && (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="h-4 w-4 text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={triggerRef}
        type="button"
        aria-label={`Color palette: ${palettes[current].name}. Change palette`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="group flex h-11 items-center gap-2.5 rounded-full border border-line bg-surface pl-2.5 pr-2.5 shadow-lg transition-colors hover:border-faint sm:pr-4"
      >
        <Swatch palette={current} className="h-6 w-6" />
        <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-bone sm:inline">
          {palettes[current].name}
        </span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`hidden h-3.5 w-3.5 text-faint transition-transform duration-300 sm:block ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 15 6-6 6 6" />
        </svg>
      </button>
    </div>
  );
}
