"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "./data";
import { useLowEnd } from "@/lib/perf";
import { icons } from "./icons";

const ease = [0.16, 1, 0.3, 1] as const;

function Clock({ seconds }: { seconds?: boolean }) {
  const [t, setT] = useState(seconds ? "--:--:--" : "--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" } : {}),
      hour12: false,
      timeZone: profile.timeZone,
    });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [seconds]);
  return <span className="tnum">{t}</span>;
}

export { Clock };

function WordSwap() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % profile.builds.length), 2200);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <span className="relative inline-grid h-[1.25em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={profile.builds[i]}
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.5, ease }}
          className="col-start-1 row-start-1 whitespace-nowrap font-medium text-accent"
        >
          {profile.builds[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// The blur-in is a filter animation on huge text; weak devices get the same reveal without it.
const word = (lowEnd: boolean) => ({
  hidden: { y: "0.4em", opacity: 0, ...(lowEnd ? {} : { filter: "blur(8px)" }) },
  show: { y: 0, opacity: 1, ...(lowEnd ? {} : { filter: "blur(0px)" }), transition: { duration: 0.8, ease } },
});

// only the social links the CV provides
const socials = (["github", "linkedin"] as const).flatMap((name) => {
  const link = profile.contact[name];
  return link ? [{ name, url: link.url }] : [];
});

export function Hero() {
  const reduced = useReducedMotion();
  const wordVariants = word(useLowEnd());
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setDrawn(true), reduced ? 0 : 850);
    return () => clearTimeout(id);
  }, [reduced]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <section id="top" className="relative flex min-h-dvh items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/55 to-transparent [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-28 sm:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.12em] text-muted">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              OPEN TO SELECT PROJECTS
            </span>
            <span className="kicker normal-case">
              {profile.city} · <Clock seconds />
            </span>
          </motion.div>

          <motion.h1
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
            className="font-display text-[clamp(3rem,8.5vw,7rem)] font-bold leading-[0.94] tracking-[-0.035em] text-bone"
          >
            {profile.name.map((w) => (
              <span key={w} className="block overflow-hidden">
                <motion.span
                  variants={wordVariants}
                  className="inline-block bg-gradient-to-b from-bone to-[color-mix(in_srgb,var(--color-bone)_58%,transparent)] bg-clip-text pb-[0.08em] text-transparent"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            {...fade(0.34)}
            className="mt-6 font-display text-[clamp(1.15rem,2.6vw,1.9rem)] font-medium text-muted"
          >
            {profile.role[0]}{" "}
            <span className={`draw-underline pb-1 text-bone ${drawn ? "drawn" : ""}`}>{profile.role[1]}</span>{" "}
            {profile.role[2]}
          </motion.p>

          <motion.p
            {...fade(0.42)}
            className="mt-3 flex items-center gap-3 font-mono text-sm tracking-[0.06em] text-faint"
          >
            <span>BUILDS //</span>
            <WordSwap />
          </motion.p>

          <motion.p {...fade(0.5)} className="mt-8 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            {profile.intro}
          </motion.p>

          <motion.div {...fade(0.62)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-accent px-6 py-3 font-mono text-[0.8rem] font-semibold tracking-[0.02em] text-on-accent transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_color-mix(in_srgb,var(--color-accent)_55%,transparent)]"
            >
              Start a project →
            </a>
            <a
              href="#work"
              className="rounded-full border border-line px-6 py-3 font-mono text-[0.8rem] tracking-[0.02em] text-bone transition-colors hover:border-accent/60 hover:text-accent"
            >
              View work
            </a>
            <a
              href={profile.cv.href}
              download={profile.cv.filename}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-mono text-[0.8rem] tracking-[0.02em] text-bone transition-colors hover:border-accent/60 hover:text-accent"
            >
              <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className="h-4 w-4">
                <path d={icons.download} />
              </svg>
              Download CV
            </a>
            <div className="ml-1 flex items-center gap-2">
              {socials.map(({ name, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener"
                  aria-label={name === "github" ? "GitHub" : "LinkedIn"}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                >
                  <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className="h-[18px] w-[18px]">
                    <path d={icons[name]} />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.dl {...fade(0.74)} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["BASE", profile.base],
              ["STACK", profile.stackLine],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="font-mono text-[0.62rem] tracking-[0.12em] text-faint">{k}</dt>
                <dd className="font-mono text-sm text-bone">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-3">
        <span className="font-mono text-[0.62rem] tracking-[0.3em] text-faint">SCROLL</span>
        <span aria-hidden className="scroll-cue" />
      </div>
    </section>
  );
}
