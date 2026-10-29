"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { navLinks, profile } from "./data";
import { ThemeToggle } from "./theme-toggle";
import { setTheme, useTheme } from "@/lib/theme";

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = navLinks.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return active;
}

export function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="relative w-full max-w-[760px]">
        <nav aria-label="Primary" className="card relative overflow-hidden rounded-full">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
            <a
              href="#top"
              className="flex items-center gap-2.5 whitespace-nowrap rounded-full font-mono text-[0.68rem] tracking-[0.1em] text-bone max-[340px]:gap-1.5 max-[340px]:tracking-[0.04em] sm:text-[0.72rem] sm:tracking-[0.14em]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_1px] shadow-accent/50" />
              {profile.fullName}
            </a>
            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`rounded-full px-3 py-1.5 font-mono text-[0.7rem] tracking-[0.06em] transition-colors hover:text-bone ${
                      active === l.id ? "bg-surface-2 text-bone" : "text-muted"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <a
                href="#contact-form"
                className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.04em] text-bone transition-colors hover:border-accent/60 hover:text-accent max-[340px]:px-2 sm:px-3.5 sm:text-[0.7rem]"
              >
                Get in touch
              </a>
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((o) => !o)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-bone lg:hidden"
              >
                {/* SVG strokes are anti-aliased evenly; div lines snap to device pixels and render unevenly */}
                <svg viewBox="0 0 20 20" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <line
                    x1="4"
                    y1="7"
                    x2="16"
                    y2="7"
                    className={`origin-center transition-transform duration-300 [transform-box:fill-box] ${
                      open ? "translate-y-[3px] rotate-45" : ""
                    }`}
                  />
                  <line
                    x1="4"
                    y1="13"
                    x2="16"
                    y2="13"
                    className={`origin-center transition-transform duration-300 [transform-box:fill-box] ${
                      open ? "-translate-y-[3px] -rotate-45" : ""
                    }`}
                  />
                </svg>
              </button>
            </div>
          </div>
          <motion.span
            aria-hidden
            style={{ scaleX }}
            className="absolute bottom-0 left-0 h-px w-full origin-left bg-accent"
          />
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="card absolute inset-x-0 top-full mt-2 rounded-3xl bg-surface! p-2 shadow-xl lg:hidden"
            >
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`block rounded-xl px-4 py-3 font-mono text-[0.8rem] tracking-[0.06em] transition-colors hover:bg-surface-2 ${
                      active === l.id ? "text-accent" : "text-muted"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {/* the bar has no room for the theme toggle on phones, so it lives here */}
              <li className="mt-1 border-t border-line pt-1 sm:hidden">
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="block w-full rounded-xl px-4 py-3 text-left font-mono text-[0.8rem] tracking-[0.06em] text-muted transition-colors hover:bg-surface-2"
                >
                  Switch to {theme === "dark" ? "light" : "dark"} theme
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
