import { createContext, useContext } from "react";

export interface Prefs { theme: "dark" | "light"; motion: boolean; sound: boolean; hud: boolean }
export interface PrefsApi extends Prefs { flip: (k: keyof Prefs) => void }

const KEY = "btt.prefs";
export function initialPrefs(): Prefs {
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const base: Prefs = { theme: "dark", motion: !reduce, sound: true, hud: false };
  try { return { ...base, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return base; }
}
export function savePrefs(p: Prefs) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* private mode */ } }

export const PrefsCtx = createContext<PrefsApi>({ theme: "dark", motion: true, sound: true, hud: false, flip: () => {} });
export const usePrefs = () => useContext(PrefsCtx);
