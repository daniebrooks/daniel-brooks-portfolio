"use client";

import { useEffect, useRef } from "react";
import { isLowEndDevice } from "@/lib/perf";
import { usePalette, useTheme } from "@/lib/theme";

const BINS = 24;

type Rgb = number[];
type Pal = { fills: string[]; glow: string[] };

// Depth ramp: far points fade out, near points read strongest.
const buildFills = (far: Rgb, near: Rgb, maxAlpha: number) =>
  Array.from({ length: BINS }, (_, b) => {
    const t = (b + 0.5) / BINS;
    const a = 0.05 + maxAlpha * Math.pow(t, 1.35);
    const [r, g, bl] = far.map((f, i) => Math.round(f + (near[i] - f) * t));
    return `rgba(${r},${g},${bl},${a.toFixed(3)})`;
  });

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const hexToRgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a: Rgb, b: Rgb, t: number): Rgb => a.map((v, i) => v + (b[i] - v) * t);
const csv = (c: Rgb) => c.map(Math.round).join(",");

// Derive the particle colors from the live CSS tokens, so every palette and theme recolors the canvas.
function derivePalette(light: boolean): Pal {
  const accent = hexToRgb(cssVar("--accent"));
  const bg = hexToRgb(cssVar("--bg"));
  const bone = hexToRgb(cssVar("--bone"));
  const far = light ? mix(accent, bg, 0.55) : accent;
  const near = light ? mix(accent, [0, 0, 0], 0.6) : mix(accent, bone, 0.8);
  return {
    fills: buildFills(far, near, light ? 0.8 : 0.85),
    glow: [`rgba(${csv(accent)},0.10)`, `rgba(${csv(accent)},0.04)`, `rgba(${csv(bg)},0)`],
  };
}
const radii = Array.from({ length: BINS }, (_, b) => 0.35 + 1.45 * ((b + 0.5) / BINS));

// Rotating 3D point sphere, tilts toward the pointer. Fixed behind the page.
// Points are bucketed by depth: one path + one fill per bucket, no per-frame sort or string building.
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  const palRef = useRef<Pal | null>(null);
  const redraw = useRef<() => void>(() => {});
  const theme = useTheme();
  const palette = usePalette();

  // follow theme + palette without restarting the animation; static (reduced-motion) mode repaints once
  useEffect(() => {
    palRef.current = derivePalette(theme === "light");
    redraw.current();
  }, [theme, palette]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // quality scales the particle count: weak devices start reduced, and any device steps down
    // if frames run long (never scales back up, to avoid flapping)
    let quality = isLowEndDevice() ? 0.4 : 1;
    let frameGap = 0;
    let W = 0;
    let H = 0;
    let N = 0;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let pz = new Float32Array(0);
    let sx = new Float32Array(0);
    let sy = new Float32Array(0);
    let bin = new Uint8Array(0);
    let order = new Uint32Array(0);
    const counts = new Uint32Array(BINS);
    const start = new Uint32Array(BINS);

    const layout = () => {
      const mobile = W < 760;
      return {
        cx: mobile ? W * 0.5 : W * 0.66,
        cy: mobile ? H * 0.4 : H * 0.5,
        R: Math.min(W, H) * (mobile ? 0.42 : 0.46),
      };
    };

    const resize = () => {
      const dpr = quality < 1 ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      N = Math.round(Math.min(W < 760 ? 1200 : 2400, Math.max(700, (W * H) / 1300)) * quality);
      px = new Float32Array(N);
      py = new Float32Array(N);
      pz = new Float32Array(N);
      sx = new Float32Array(N);
      sy = new Float32Array(N);
      bin = new Uint8Array(N);
      order = new Uint32Array(N);
      for (let i = 0; i < N; i++) {
        const y = Math.random() * 2 - 1;
        const a = Math.random() * Math.PI * 2;
        const s = Math.sqrt(1 - y * y);
        const r = Math.cbrt(Math.random());
        px[i] = s * Math.cos(a) * r;
        py[i] = y * r;
        pz[i] = s * Math.sin(a) * r;
      }
    };
    resize();
    canvas.dataset.quality = quality.toFixed(2);

    const pointer = { x: 0.5, y: 0.5, active: false };
    const tilt = { x: -0.35, y: 0 };
    const target = { x: -0.35, y: 0 };
    let spin = 0;

    const draw = (dt: number) => {
      const { cx, cy, R } = layout();
      if (!reduced) {
        spin += 0.13 * dt;
        if (pointer.active) {
          target.x = -0.35 + (pointer.y - 0.5) * 0.7;
          target.y = (pointer.x - 0.5) * 0.7;
        }
        tilt.x += (target.x - tilt.x) * 0.05;
        tilt.y += (target.y - tilt.y) * 0.05;
      }
      const yaw = spin + tilt.y;
      const cY = Math.cos(yaw);
      const sY = Math.sin(yaw);
      const cX = Math.cos(tilt.x);
      const sX = Math.sin(tilt.x);

      counts.fill(0);
      for (let i = 0; i < N; i++) {
        const x1 = px[i] * cY + pz[i] * sY;
        const z1 = -px[i] * sY + pz[i] * cY;
        const y2 = py[i] * cX - z1 * sX;
        const z2 = py[i] * sX + z1 * cX;
        sx[i] = cx + x1 * R;
        sy[i] = cy + y2 * R;
        const b = Math.min(BINS - 1, Math.max(0, Math.floor((z2 + 1) * 0.5 * BINS)));
        bin[i] = b;
        counts[b]++;
      }
      // counting sort by depth bucket: far points first
      let acc = 0;
      for (let b = 0; b < BINS; b++) {
        start[b] = acc;
        acc += counts[b];
      }
      for (let i = 0; i < N; i++) order[start[bin[i]]++] = i;

      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.25);
      const pal = palRef.current;
      if (!pal) return;
      g.addColorStop(0, pal.glow[0]);
      g.addColorStop(0.6, pal.glow[1]);
      g.addColorStop(1, pal.glow[2]);
      ctx.fillStyle = g;
      ctx.fillRect(cx - R * 1.3, cy - R * 1.3, R * 2.6, R * 2.6);

      let k = 0;
      for (let b = 0; b < BINS; b++) {
        const n = counts[b];
        if (!n) continue;
        const r = radii[b];
        ctx.fillStyle = pal.fills[b];
        ctx.beginPath();
        for (let j = 0; j < n; j++, k++) {
          const i = order[k];
          ctx.moveTo(sx[i] + r, sy[i]);
          ctx.arc(sx[i], sy[i], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    if (reduced) {
      draw(0);
      redraw.current = () => draw(0);
      const onResize = () => {
        resize();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => {
        redraw.current = () => {};
        window.removeEventListener("resize", onResize);
      };
    }

    let raf = 0;
    let last = 0;
    let running = true;
    let slow = 0;
    const loop = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (!last) last = t;
      if (t - last < frameGap) return;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const t0 = performance.now();
      draw(dt);
      if (performance.now() - t0 > 9) {
        if (++slow > 20 && quality > 0.25) {
          slow = 0;
          quality = Math.max(0.25, quality * 0.7);
          if (quality < 0.4) frameGap = 30;
          resize();
          canvas.dataset.quality = quality.toFixed(2);
        }
      } else {
        slow = Math.max(0, slow - 1);
      }
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
      pointer.active = true;
    };
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
