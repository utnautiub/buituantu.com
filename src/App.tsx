import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DICT, LangCtx, initialLang, saveLang, type Key, type Lang, type LangApi } from "./i18n";
import { initInteractions } from "./lib/interactions";
import { scrambleAll, settleText } from "./lib/reveal";
import { initTrail, party, sweep } from "./lib/fx";
import { setSound, sfx } from "./lib/sound";
import { PrefsCtx, initialPrefs, savePrefs, type Prefs, type PrefsApi } from "./prefs";
import { S } from "./store";
import { useScrollState } from "./lib/useScrollState";
import { Boot, Depth, Footer, Gauge, Hud, Nav, Stage, useFocus } from "./components/Chrome";
import { Palette } from "./components/Palette";
import { Explore, useExplore } from "./components/Explore";
import { runShowcase, stopShowcase } from "./lib/showcase";
import { Contact, Hero, Service, Signal, Tools, University, Work } from "./components/Sections";

export function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const api = useMemo<LangApi>(() => ({
    lang,
    t: (k: Key) => DICT[lang][k],
    toggle: () => { settleText(); setLang((l) => { const n = l === "vi" ? "en" : "vi"; saveLang(n); return n; }); },
  }), [lang]);

  const [prefs, setPrefs] = useState<Prefs>(initialPrefs);
  const prefsApi = useMemo<PrefsApi>(() => ({
    ...prefs,
    flip: (k) => setPrefs((p) => {
      const n = { ...p, [k]: k === "theme" ? (p.theme === "dark" ? "light" : "dark") : !p[k] } as Prefs;
      savePrefs(n);
      if (k === "sound") { setSound(n.sound); sfx.toggle(n.sound); } else sfx.toggle(k === "theme" ? n.theme === "light" : (n[k] as boolean));
      return n;
    }),
  }), [prefs]);
  // Preferences live on <html> so CSS and the scene can both read them.
  useEffect(() => {
    const r = document.documentElement;
    r.dataset.theme = prefs.theme; r.dataset.motion = prefs.motion ? "on" : "off";
    S.rm = !prefs.motion; setSound(prefs.sound); S.retheme(); S.recolor(); S.kick();
  }, [prefs]);

  const main = useRef<HTMLElement>(null), bar = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null), line = useRef<HTMLDivElement>(null);
  // The page comes alive when the opening sequence lets go.
  const [bootKey, setBootKey] = useState(0);
  const onReady = useCallback(() => {
    if (S.ready) {
      // a replay of the opening: the stack drops in again and the headline flies back together
      S.replay++; S.kick(); dispatchEvent(new Event("btt:replay"));
      return;
    }
    S.ready = true; document.body.classList.add("ready"); S.kick();
    dispatchEvent(new Event("btt:ready"));
  }, []);
  const mark = useRef<HTMLDivElement>(null), read = useRef<HTMLElement>(null), trail = useRef<HTMLCanvasElement>(null);
  const where = useScrollState(main, bar, lang, mark, read);
  const [focus, setFocus] = useFocus(where.over);
  const setFocusRef = useRef(setFocus); setFocusRef.current = setFocus;
  const langRef = useRef(lang); langRef.current = lang;
  const [exploring, setExploring] = useExplore();
  const [demo, setDemo] = useState<{ label: string; p: number } | null>(null);
  const startShowcase = useCallback(() => {
    void runShowcase({
      replayOpening: () => setBootKey((k) => k + 1),
      setExplore: setExploring,
      setFocus: (i) => { S.focus = i; S.kick(); setFocusRef.current(i); },
      status: (label, p) => setDemo(label === null ? null : { label, p }),
      L: (en, vi) => (DICT[langRef.current] === DICT.vi ? vi : en),
    });
  }, [setExploring]);
  const [palette, setPalette] = useState(false);
  const openExplore = useCallback(() => setExploring(true), [setExploring]);
  const closeExplore = useCallback(() => setExploring(false), [setExploring]);
  // E opens explore mode from anywhere (outside text fields)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as Element).closest?.("input,textarea")) return;
      if (e.key.toLowerCase() === "e" && document.documentElement.dataset.gl === "on") setExploring((o) => !o);
    };
    // Double-click (or double-tap) on empty page space opens it too; inside it, a double-click resets the view.
    const onDbl = (e: MouseEvent) => {
      if (document.documentElement.dataset.gl !== "on") return;
      if ((e.target as Element).closest?.("a,button,input,textarea,.card,.lk,.chip,h1,h2,h3,p,li,.pal,.xui__panel,.xui__bar,.foot")) return;
      getSelection()?.removeAllRanges();
      if (S.explore) S.xreset++; else setExploring(true);
      S.kick();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("dblclick", onDbl);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("dblclick", onDbl); };
  }, [setExploring]);
  const [toast, setToast] = useState("");
  const openPalette = useCallback(() => setPalette(true), []);
  const closePalette = useCallback(() => setPalette(false), []);
  useEffect(() => { if (palette) sfx.open(); }, [palette]);

  // The accent colour and the rail's overview mode hang off attributes on <html>, so a layer change is
  // one attribute write, not a re-render of every component.
  // Switching language: the new strings are already in the DOM here, so decode them into place.
  const firstLang = useRef(true);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "vi" ? "Bùi Tuấn Tú — Kỹ sư phần mềm · Software Engineer" : "Bùi Tuấn Tú — Software Engineer";
    if (firstLang.current) { firstLang.current = false; return; }
    scrambleAll(document.getElementById("root")!);
  }, [lang]);
  // One note per layer as you arrive on it (not on first load).
  // Arriving on a layer: a note, a line sweeping across the screen in the direction of travel, and a
  // shockwave through the 3D stack.
  const lastOrder = useRef(-1);
  useEffect(() => {
    const order = ["top", "l1", "l2", "l3", "l4", "stack", "contact"].indexOf(where.id), prev = lastOrder.current;
    lastOrder.current = order;
    if (prev < 0) return;
    sfx.layer(where.over ? 0 : where.index);
    if (line.current) sweep(line.current, order > prev);
    S.arrive++; S.recolor(); S.kick();
  }, [where.id, where.over, where.index]);
  useEffect(() => {
    const r = document.documentElement;
    r.dataset.layer = String(where.layer);
    if (where.over) r.dataset.over = "1"; else delete r.dataset.over;
    S.recolor();
  }, [where]);
  useEffect(() => initInteractions(ring.current!), []);
  useEffect(() => initTrail(trail.current!), []);
  // ↑↑↓↓←→←→BA
  useEffect(() => {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]; let at = 0;
    const onKey = (e: KeyboardEvent) => { at = e.key === code[at] ? at + 1 : e.key === code[0] ? 1 : 0; if (at === code.length) { at = 0; party(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((o) => !o); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(""), 1800); return () => clearTimeout(id); }, [toast]);

  return (
    <PrefsCtx.Provider value={prefsApi}><LangCtx.Provider value={api}>
      <a className="skip" href="#main">{api.t("skip")}</a>
      <Boot key={bootKey} onDone={onReady} />
      <Stage where={where} focus={focus} />
      <div className="sweep" ref={line} aria-hidden="true" />
      <div className="txglow" aria-hidden="true" />
      <canvas className="trail" ref={trail} aria-hidden="true" />
      <Gauge mark={mark} read={read} />
      <div className="ring" ref={ring}><i /></div>
      <Nav where={where} bar={bar} onPalette={openPalette} />
      <Depth where={where} focus={focus} onFocus={setFocus} />
      <main id="main" ref={main}>
        <Hero onPalette={openPalette} />
        <University />
        <Work />
        <Service />
        <Signal />
        <Tools />
        <Contact notify={setToast} />
      </main>
      <Footer />
      <Palette open={palette} onClose={closePalette} notify={setToast} onExplore={openExplore} onShowcase={startShowcase} />
      {demo && (
        <div className="demo" role="status">
          <span className="demo__dot" /><b>{api.t("demo.title")}</b><span className="demo__lbl" key={demo.label}>{demo.label}</span>
          <button onClick={stopShowcase}>{api.t("demo.stop")} <kbd>Esc</kbd></button>
          <i style={{ transform: `scaleX(${demo.p})` }} />
        </div>
      )}
      <Explore open={exploring} onClose={closeExplore} />
      <Hud />
      <div className={`toast${toast ? " on" : ""}`} role="status">{toast}</div>
    </LangCtx.Provider></PrefsCtx.Provider>
  );
}
