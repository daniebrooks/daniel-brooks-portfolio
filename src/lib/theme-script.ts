export const THEME_KEY = "theme";
export const PALETTE_KEY = "palette";
export const DEFAULT_PALETTE = "mono";

// Runs in <head> before first paint so the page never flashes the wrong theme or palette.
// Saved choice wins; theme otherwise follows the OS preference, palette falls back to the default.
export const themeInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.dataset.theme=t;d.dataset.palette=localStorage.getItem("${PALETTE_KEY}")||"${DEFAULT_PALETTE}"}catch(e){d.dataset.theme="dark";d.dataset.palette="${DEFAULT_PALETTE}"}})()`;
