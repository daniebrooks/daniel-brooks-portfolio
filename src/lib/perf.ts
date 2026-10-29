import { useSyncExternalStore } from "react";

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

// Heuristic for weak devices: few cores, little RAM, or the user asked to save data.
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as NavigatorHints;
  return (
    (n.hardwareConcurrency ?? 8) <= 4 ||
    (n.deviceMemory ?? 8) <= 4 ||
    n.connection?.saveData === true
  );
}

const subscribe = () => () => {};

// SSR renders the full-quality tree; the client re-renders once with the real value.
export function useLowEnd(): boolean {
  return useSyncExternalStore(subscribe, isLowEndDevice, () => false);
}
