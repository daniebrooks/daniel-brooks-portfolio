"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY, PALETTE_KEY, DEFAULT_PALETTE } from "./theme-script";

export type Theme = "dark" | "light";

export const PALETTES = ["mono", "cobalt", "mint", "amber", "emerald", "vermilion"] as const;
export type Palette = (typeof PALETTES)[number];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const readPalette = (): Palette => (document.documentElement.dataset.palette as Palette) || DEFAULT_PALETTE;

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
  emit();
}

export function setPalette(palette: Palette) {
  document.documentElement.dataset.palette = palette;
  try {
    localStorage.setItem(PALETTE_KEY, palette);
  } catch {}
  emit();
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme, () => "dark");
}

export function usePalette(): Palette {
  return useSyncExternalStore(subscribe, readPalette, () => DEFAULT_PALETTE);
}
