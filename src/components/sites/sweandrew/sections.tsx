"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Clock } from "./hero";
import { profile, stack, experience, education, work, sites } from "./data";
import { icons } from "./icons";
import { ContactForm } from "./contact-form";

const ease = [0.16, 1, 0.3, 1] as const;
const pad = "relative py-[clamp(6rem,14vh,11rem)]";

// One header pattern for every section: numbered label on the left, short lede on the right.
function SectionHeader({
  index,
  title,
  lede,
  className = "",
}: {
  index: string;
  title: string;
  lede: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <span aria-hidden className="font-mono text-[0.72rem] font-medium tracking-[0.2em] text-accent">
          {index}
        </span>
        <span aria-hidden className="h-px w-8 bg-line" />
        <h2 className="font-mono text-[0.72rem] font-normal uppercase tracking-[0.2em] text-faint">{title}</h2>
      </div>
      <p className="max-w-md text-sm text-muted md:text-right">{lede}</p>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className={pad}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionHeader
          index="00"
          title="About"
          lede="Senior software engineer across AI/ML and data engineering."
          className="mb-12"
        />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            {profile.about.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease, delay: 0.1 * i }}
                className={`max-w-2xl text-lg leading-relaxed sm:text-xl ${i === 0 ? "text-bone" : "mt-6 text-muted"}`}
              >
                {p}
              </motion.p>
            ))}
          </div>
          {/* Corner cells carry their own radius (outer radius minus the 1px border). Clipping with
              overflow-hidden alone left the corners square while the cells were animating. */}
          <div className="isolate grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:col-span-5 [&>:first-child]:rounded-tl-[calc(var(--radius-2xl)_-_1px)] [&>:nth-child(2)]:rounded-tr-[calc(var(--radius-2xl)_-_1px)] [&>:nth-last-child(2)]:rounded-bl-[calc(var(--radius-2xl)_-_1px)] [&>:last-child]:rounded-br-[calc(var(--radius-2xl)_-_1px)]">
            {profile.facts.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease, delay: 0.08 * i }}
                className="bg-surface p-6 sm:p-7"
              >
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-faint">{f.label}</div>
                <div className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-bone sm:text-xl">
                  {f.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CHIP =
  "inline-flex h-7 flex-none items-center rounded-full border border-line bg-surface-2/60 px-3 font-mono text-[0.74rem] tracking-[0.02em] text-muted transition-colors duration-300";
const CHIP_ROWS = 3;
const CHIP_GAP = 10; // px, matches gap-2.5

// Shows as many chips as fit in two rows so every card is the same height. The rest collapse into a
// "+N" chip; pressing it opens a popover listing the hidden items.
function ChipList({ items, label, delay }: { items: string[]; label: string; delay: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(items.length);
  const [open, setOpen] = useState(false);

  // Measure against a hidden copy of all chips (plus a sample "+99" chip) so we know how many fit.
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => {
      const kids = Array.from(el.children) as HTMLElement[];
      const plus = kids.pop();
      if (!plus || kids.length === 0) return;
      const tops = [...new Set(kids.map((k) => k.offsetTop))].sort((a, b) => a - b);
      const lastRowTop = tops[CHIP_ROWS - 1] ?? tops[tops.length - 1];
      let fit = kids.filter((k) => k.offsetTop <= lastRowTop).length;
      if (fit < kids.length) {
        // leave room for the "+N" chip at the end of the last row
        while (fit > 0) {
          const last = kids[fit - 1];
          if (last.offsetLeft + last.offsetWidth + CHIP_GAP + plus.offsetWidth <= el.clientWidth) break;
          fit--;
        }
      }
      setVisible(fit);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hidden = items.slice(visible);
  return (
    <div ref={wrapRef} className="relative">
      <ul
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap gap-2.5"
      >
        {items.map((it) => (
          <li key={it}>
            <span className={CHIP}>{it}</span>
          </li>
        ))}
        <li>
          <span className={CHIP}>+99</span>
        </li>
      </ul>

      <ul className="flex h-[104px] flex-wrap gap-2.5 overflow-hidden">
        {items.slice(0, visible).map((it, i) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease, delay: delay + 0.03 * i }}
          >
            <span className={`${CHIP} hover:border-accent/50 hover:text-bone`}>{it}</span>
          </motion.li>
        ))}
        {hidden.length > 0 && (
          <li>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={`Show ${hidden.length} more in ${label}`}
              onClick={() => setOpen((o) => !o)}
              className={`${CHIP} cursor-pointer border-accent/40 text-accent hover:bg-accent/10`}
            >
              +{hidden.length}
            </button>
          </li>
        )}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`More in ${label}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease }}
            className="absolute inset-x-0 top-full z-30 mt-3 rounded-xl border border-line bg-surface p-4 shadow-xl"
          >
            <ul className="flex flex-wrap gap-2">
              {hidden.map((it) => (
                <li key={it}>
                  <span className={CHIP}>{it}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Stack() {
  return (
    <section id="skills" className={pad}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionHeader
          index="01"
          title="Stack"
          lede={`Technologies across ${stack.length} areas, from backend and AI to cloud and data.`}
          className="mb-12"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((g, gi) => (
            <div key={g.title} className="card relative rounded-2xl p-6 has-[[aria-expanded=true]]:z-20 sm:p-8">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <h3 className="font-mono text-[0.72rem] font-normal uppercase tracking-[0.16em] text-faint">
                  {g.title}
                </h3>
              </div>
              <ChipList items={g.items} label={g.title} delay={0.05 * gi} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({ e, index }: { e: (typeof experience)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const active =
    useInView(ref, { amount: 0.7, margin: "-35% 0px -35% 0px" }) || Boolean(e.current);
  return (
    <div ref={ref} className="relative pl-10 lg:pl-12">
      <span
        className={`absolute left-[7px] top-[0.45rem] z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border transition-all duration-500 ${
          active ? "border-accent bg-accent" : "border-faint bg-bg"
        }`}
      >
        {e.current && <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-accent/60" />}
      </span>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease, delay: 0.04 * index }}
        className="pb-12 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
      >
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 lg:mb-0 lg:flex-col lg:items-start lg:gap-y-2 lg:pt-1.5">
          <span className="font-mono text-[0.72rem] tracking-[0.1em] text-accent">{e.range}</span>
          <span className="font-mono text-[0.72rem] tracking-[0.08em] text-faint">{e.duration}</span>
          {e.current && (
            <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.14em] text-accent">
              CURRENT
            </span>
          )}
        </div>
        <div>
          <h3
            className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-500 sm:text-3xl ${
              active ? "text-bone" : "text-muted"
            }`}
          >
            {e.title} <span className="text-accent">@ {e.org}</span>
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] tracking-[0.06em] text-faint">
            {e.type && (
              <>
                <span>{e.type}</span>
                <span aria-hidden>·</span>
              </>
            )}
            <span>{e.place}</span>
          </div>
          <ul className="mt-4 space-y-2.5 text-[0.92rem] leading-relaxed text-muted">
            {e.highlights.map((h) => (
              <li
                key={h}
                className="relative pl-5 before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-2.5 before:bg-accent/70"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </div>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="experience" className={pad}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionHeader
          index="02"
          title="Experience"
          lede="From machine learning at Walmart to leading a team at AS-P."
          className="mb-12"
        />
        <div ref={ref} className="relative">
          <div className="absolute bottom-1 left-[7px] top-1 w-px bg-line">
            <motion.div
              aria-hidden
              style={{ scaleY: scrollYProgress }}
              className="h-full w-full origin-top bg-accent"
            />
          </div>
          <motion.span
            aria-hidden
            style={{ top }}
            className="absolute left-[7px] z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_4px] shadow-accent/50"
          />
          <div>
            {experience.map((e, i) => (
              <TimelineEntry key={`${e.org}-${i}`} e={e} index={i} />
            ))}
          </div>
        </div>
        <div className="mt-16 border-t border-line pt-10">
          <p className="mb-6 font-mono text-[0.72rem] tracking-[0.18em] text-faint">EDUCATION</p>
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease }}
            className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 lg:pl-12"
          >
            <span className="mb-1 block font-mono text-[0.72rem] tracking-[0.1em] text-accent lg:mb-0 lg:pt-1.5">
              {education.range}
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
                {education.school}
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{education.degree}</p>
              <p className="mt-3 font-mono text-[0.72rem] tracking-[0.06em] text-faint">{education.place}</p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy command: ${command}`}
      className="mt-5 flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-bg/60 px-3 py-2.5 text-left transition-colors hover:border-accent/40"
    >
      <code className="truncate font-mono text-[0.78rem] text-accent">
        <span className="text-faint">$ </span>
        {command}
      </code>
      <span
        aria-live="polite"
        className={`flex-none rounded border px-1.5 py-0.5 font-mono text-[0.62rem] tracking-[0.1em] transition-colors ${
          copied ? "border-accent text-accent" : "border-line text-faint"
        }`}
      >
        {copied ? "COPIED" : "COPY"}
      </span>
    </button>
  );
}

function WorkCard({ w, index }: { w: (typeof work)[number]; index: number }) {
  const reduced = useReducedMotion();
  const frame = useRef(0);
  // at most one style write per animation frame, however fast the pointer moves
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || frame.current) return;
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease, delay: (index % 3) * 0.08 }}
      onMouseMove={onMove}
      className="card card-accent group relative flex flex-col rounded-2xl p-6 transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-accent/40 sm:p-7"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[calc(var(--radius-2xl)_-_1px)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx,50%) var(--my,0%), color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 70%)",
        }}
      />
      {/* decorative illustration (the card title carries the meaning), faded into the card at the bottom */}
      <div className="relative -mx-6 -mt-6 mb-6 aspect-[3/2] overflow-hidden rounded-t-[calc(var(--radius-2xl)_-_1px)] sm:-mx-7 sm:-mt-7">
        <Image
          src={w.image}
          alt=""
          fill
          sizes="(min-width: 1152px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[0.72rem] font-medium tracking-[0.18em] text-accent">
          0{index + 1}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
      </div>
      <h3 className="relative mt-5 font-display text-xl font-semibold tracking-tight text-bone">{w.title}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">{w.text}</p>
      <div className="relative">
        <CopyCommand command={w.cmd} />
        <ul className="mt-4 flex flex-wrap gap-2">
          {w.tags.map((t) => (
            <li
              key={t}
              className="rounded-md border border-line px-2 py-1 font-mono text-[0.66rem] tracking-[0.02em] text-faint"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function Work() {
  return (
    <section id="work" className={pad}>
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionHeader
          index="03"
          title="Selected Work"
          lede="What I’m hired to build, end to end, and the sites I’ve worked on and with."
          className="mb-12"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((w, i) => (
            <WorkCard key={w.title} w={w} index={i} />
          ))}
        </div>

        <div className="mt-16">
          <h3 className="mb-6 font-mono text-[0.72rem] font-normal tracking-[0.18em] text-faint">
            WORKED ON AND WITH
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {sites.map((s, i) => (
              <motion.li
                key={s.url}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease, delay: (i % 2) * 0.06 }}
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-start justify-between gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/40"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-semibold tracking-tight text-bone transition-colors group-hover:text-accent">
                      {s.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.7rem] tracking-[0.04em] text-faint">
                      {new URL(s.url).hostname.replace(/^www\./, "")}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted">{s.text}</span>
                  </span>
                  <span
                    aria-hidden
                    className="flex-none font-mono text-bone transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  >
                    ↗
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


type Row = { label: string; value: string; href: string; icon: string; download?: boolean };

export function Contact() {
  const c = profile.contact;
  const rows = [
    { label: "EMAIL", value: c.email, href: `mailto:${c.email}`, icon: "email" },
    c.phone && { label: "PHONE", value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}`, icon: "phone" },
    c.phone && c.whatsapp && {
      label: "WHATSAPP",
      value: c.phone,
      href: `https://wa.me/${c.phone.replace(/\D/g, "")}`,
      icon: "whatsapp",
    },
    c.github && { label: "GITHUB", value: c.github.handle, href: c.github.url, icon: "github" },
    c.linkedin && { label: "LINKEDIN", value: c.linkedin.handle, href: c.linkedin.url, icon: "linkedin" },
    c.telegram && { label: "TELEGRAM", value: c.telegram.handle, href: c.telegram.url, icon: "telegram" },
    {
      label: "LOCATION",
      value: profile.city,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.city)}`,
      icon: "location",
    },
    { label: "RESUME", value: "Download CV (PDF)", href: profile.cv.href, icon: "download", download: true },
  ].filter((r): r is Row => Boolean(r)); // only show contact rows the CV actually provides
  return (
    <section id="contact" className="relative pb-10 pt-[clamp(6rem,16vh,12rem)]">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <SectionHeader
          index="04"
          title="Contact"
          lede="Reach out by email or LinkedIn."
          className="mb-12"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-3xl font-display text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone"
        >
          Let’s build something <span className="text-accent">that lasts.</span>
        </motion.h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Custom software, AI agents, APIs, data pipelines, or automation. If it needs to actually work, let’s talk.
          Based in {profile.city}, working with teams everywhere.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
        <ul className="divide-y divide-line border-y border-line lg:flex lg:flex-col">
          {rows.map((r) => (
            <li key={r.label} className="lg:flex-1">
              <a
                href={r.href}
                title={r.value}
                download={r.download ? profile.cv.filename : undefined}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel={r.href.startsWith("http") ? "noopener" : undefined}
                className="group -mx-3 flex items-center justify-between gap-4 rounded-lg px-3 py-5 transition-colors hover:bg-surface/60 lg:h-full">
                <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    fill="currentColor"
                    className="h-5 w-5 flex-none text-muted transition-colors group-hover:text-accent"
                  >
                    <path d={icons[r.icon]} />
                  </svg>
                  <span className="hidden w-24 flex-none font-mono text-[0.72rem] tracking-[0.16em] text-faint transition-colors group-hover:text-accent sm:inline lg:hidden xl:inline">
                    {r.label}
                  </span>
                  <span className="min-w-0 break-all font-display text-base sm:truncate sm:break-normal text-bone transition-colors group-hover:text-accent sm:text-xl xl:text-lg">
                    {r.value}
                  </span>
                </span>
                <span className="flex-none font-mono text-bone transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <ContactForm />
        </div>
        <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-mono text-[0.7rem] tracking-[0.1em] text-faint">
          <span>{profile.fullName} © 2026</span>
          <span>
            {profile.city} · <Clock />
          </span>
          <a href="#top" className="pr-12 transition-colors hover:text-accent">
            BACK TO TOP ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
