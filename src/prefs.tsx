import { createContext, useContext } from "react";
import { isQuality, type Quality } from "./lib/quality";

export interface Prefs { theme: "dark" | "light"; motion: boolean; sound: boolean; hud: boolean; quality: Quality }
export type PrefKey = "theme" | "motion" | "sound" | "hud";
export interface PrefsApi extends Prefs { flip: (k: PrefKey) => void; setQuality: (q: Quality) => void }

const KEY = "btt.prefs";
export function initialPrefs(): Prefs {
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const base: Prefs = { theme: "dark", motion: !reduce, sound: true, hud: false, quality: "ultra" };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Prefs>;
    return {
      theme: saved.theme === "light" || saved.theme === "dark" ? saved.theme : base.theme,
      motion: typeof saved.motion === "boolean" ? saved.motion : base.motion,
      sound: typeof saved.sound === "boolean" ? saved.sound : base.sound,
      hud: typeof saved.hud === "boolean" ? saved.hud : base.hud,
      quality: isQuality(saved.quality) ? saved.quality : "ultra",
    };
  } catch { return base; }
}
export function savePrefs(p: Prefs) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* private mode */ } }

export const PrefsCtx = createContext<PrefsApi>({ theme: "dark", motion: true, sound: true, hud: false, quality: "ultra", flip: () => {}, setQuality: () => {} });
export const usePrefs = () => useContext(PrefsCtx);
