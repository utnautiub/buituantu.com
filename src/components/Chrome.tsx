import { memo, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { RAIL, useLang, type Key } from "../i18n";
import { QUALITIES, nextQuality, type Quality } from "../lib/quality";
import { usePrefs } from "../prefs";
import { Logo } from "./Logo";
import { S } from "../store";
import { createLayerScene } from "../scene/layers";
import { initNameMarquee } from "../lib/nameMarquee";
import type { Where } from "../lib/useScrollState";

const NAV: { href: string; key: "nav.1" | "nav.2" | "nav.3" | "nav.4" | "nav.s" | "nav.c" }[] = [
  { href: "l1", key: "nav.1" }, { href: "l2", key: "nav.2" }, { href: "l3", key: "nav.3" }, { href: "l4", key: "nav.4" }, { href: "stack", key: "nav.s" }, { href: "contact", key: "nav.c" },
];

export function Nav({ where, bar, onPalette }: { where: Where; bar: RefObject<HTMLDivElement | null>; onPalette: () => void }) {
  const { lang, t, toggle } = useLang();
  const p = usePrefs();
  // One underline that slides between the links instead of each link owning its own.
  const links = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = links.current!, a = el.querySelector<HTMLElement>('[aria-current="true"]');
    el.style.setProperty("--io", a ? "1" : "0");
    if (a) { el.style.setProperty("--ix", `${a.offsetLeft + 10}px`); el.style.setProperty("--iw", `${a.offsetWidth - 20}px`); }
  }, [where.id, lang]);
  return (
    <header className="nav">
      <div className="wrap nav__in">
        <a className="brand" href="#top" aria-label="Bùi Tuấn Tú"><span className="brand__mark" key={where.layer}><Logo /></span><span>Bùi Tuấn Tú</span></a>
        <nav className="nav__links" aria-label="Primary" ref={links}>
          {NAV.map((n) => <a key={n.href} href={`#${n.href}`} aria-current={where.id === n.href ? "true" : undefined}>{t(n.key)}</a>)}
          <span className="nav__ind" />
        </nav>
        <div className="nav__act">
          <button className="ibtn ibtn--k" onClick={onPalette} aria-label="Open command palette"><Ico d="m5 7 5 5-5 5M13 17h6" /> <kbd>⌘K</kbd></button>
          <button className="ibtn" onClick={toggle} aria-label="Switch language" title={t("pal.lang")}>
            <Ico d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM3 12h18M12 3c2.6 2.7 3.8 5.7 3.8 9s-1.2 6.300-3.8 9c-2.600-2.700-3.800-5.700-3.800-9S9.400 5.700 12 3Z" /> {lang.toUpperCase()}
          </button>
          <button className="ibtn ibtn--i" onClick={() => p.flip("theme")} aria-label={t("p.theme")} title={`${t("p.theme")}: ${t(p.theme === "dark" ? "p.dark" : "p.light")}`}>
            {p.theme === "dark" ? <Ico d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500Z" /> : <Ico d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2.500M12 19.500V22M2 12h2.500M19.500 12H22M5 5l1.800 1.800M17.200 17.200 19 19M19 5l-1.800 1.800M6.800 17.200 5 19" />}
          </button>
          <button className="ibtn ibtn--i" onClick={() => p.flip("sound")} aria-pressed={p.sound} aria-label={t("p.sound")} title={`${t("p.sound")}: ${t(p.sound ? "p.on" : "p.off")}`}>
            <Ico d={p.sound ? "M4 9.500v5h3.500L12 18.500v-13L7.500 9.500H4ZM15.500 9a4.200 4.200 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11" : "M4 9.500v5h3.500L12 18.500v-13L7.500 9.500H4ZM16 9.500l5 5M21 9.500l-5 5"} />
          </button>
          <button className="ibtn ibtn--i wide" onClick={() => p.flip("motion")} aria-pressed={p.motion} aria-label={t("p.motion")} title={`${t("p.motion")}: ${t(p.motion ? "p.on" : "p.off")}`}>
            <Ico d={p.motion ? "M3 12c2.200-5 4.400-5 6.600 0s4.400 5 6.600 0 3.300-3.800 4.800-1.500" : "M3 12h18"} />
          </button>
          <button className="ibtn ibtn--i wide" onClick={() => p.flip("hud")} aria-pressed={p.hud} aria-label={t("p.hud")} title={`${t("p.hud")}: ${t(p.hud ? "p.on" : "p.off")}`}>
            <Ico d={p.hud ? ["M9 4.5H5v4", "M15 4.5h4v4", "M19 15.5v4h-4", "M9 19.5H5v-4", "M8.5 14.5h7"] : ["M9 4.5H5v4", "M15 4.5h4v4", "M19 15.5v4h-4", "M9 19.5H5v-4", "M6.5 17.5 17.5 6.5"]} />
          </button>
          <button className="ibtn ibtn--i qbtn" data-q={p.quality} onClick={() => p.setQuality(nextQuality(p.quality))} aria-label={`${t("p.quality")}: ${t(`q.${p.quality}` as Key)}`} title={`${t("p.quality")}: ${t(`q.${p.quality}` as Key)}`}>
            <Ico d={QMARK} />
            <span>{QWORD[p.quality]}</span>
          </button>
        </div>
      </div>
      <div className="prog" ref={bar} />
    </header>
  );
}

/** The layer rail. While scrolling it marks the current layer; in the closing overview, when the whole
 *  stack is back on screen, it turns into the stack's legend: every layer lit, joined by one line, and
 *  hovering an entry picks that slab out on the right. */
export function Depth({ where, focus, onFocus }: { where: Where; focus: number; onFocus: (i: number) => void }) {
  const { t } = useLang();
  const onStack = where.id === "top" || /^l\d$/.test(where.id);
  return (
    <nav className="depth" aria-label="Layers" onPointerLeave={() => onFocus(-1)}>
      {RAIL.map((r, j) => (
        <a key={r.id} href={`#${r.id}`} className={`${onStack && !where.over && r.layer === where.index ? "on" : ""}${focus === r.layer ? " foc" : ""}`}
          style={{ "--c": r.color, "--j": j } as CSSProperties}
          onPointerEnter={() => onFocus(r.layer)} onFocus={() => onFocus(r.layer)} onBlur={() => onFocus(-1)}>
          <i>{r.code}</i><span>{t(r.key)}</span>
        </a>
      ))}
    </nav>
  );
}

/** The fixed 3D backdrop, with a CSS version of the stack underneath for when WebGL is not available. */
export function Stage({ where, focus, quality }: { where: Where; focus: number; quality: Quality }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    S.quality = quality;
    const root = document.documentElement, off = () => { delete root.dataset.gl; delete root.dataset.dpr; };
    let scene: { dispose(): void } | null = null, dead = false;
    createLayerScene(canvas.current!, off)
      .then((s) => { if (dead) s.dispose(); else { scene = s; root.dataset.gl = "on"; } })
      .catch((e) => { console.warn("3D scene unavailable, using the CSS stack", e); off(); });
    return () => { dead = true; scene?.dispose(); };
  }, [quality]);
  return (
    <div className="stage" aria-hidden="true">
      <canvas className="gl" key={quality} ref={canvas} />
      <div className="cstack-wrap">
        <div className={`cstack${focus >= 0 ? " has-focus" : ""}`}>
          {[4, 3, 2, 1, 0].map((layer, j) => (
            <div key={layer} className={`cl${!where.over && layer < where.index ? " is-up" : ""}${focus === layer ? " is-cur" : ""}`} style={{ "--i": j, "--c": `var(--l${layer})` } as CSSProperties}>
              L{layer}<i>{["Surface", "University", "2NF Software", "Service", "Telecom"][layer]}</i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const QMARK = ["M4.5 6.2h15v11.6h-15z", "M4.5 14.8 8.7 10.6l2.6 2.6 2.4-2.4 5.8 5.6", "M9.2 9.5a.9.9 0 1 1-1.8 0 .9.9 0 1 1 1.8 0"] as const;
const QWORD = { low: "low", mid: "medium", high: "high", ultra: "ultra" } as const;

const Ico = ({ d }: { d: string | readonly string[] }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.900" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {(typeof d === "string" ? [d] : d).map((p) => <path key={p} d={p} />)}
  </svg>
);

export const Footer = memo(function Footer() {
  const { t } = useLang();
  const p = usePrefs();
  const onoff = (v: boolean) => t(v ? "p.on" : "p.off");
  const box = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  useEffect(() => initNameMarquee(box.current!, track.current!), []);
  return (
    <footer className="foot">
      <div className="bigmarq" ref={box} aria-hidden="true">
        <div ref={track}>{[0, 1].map((k) => <span key={k}><b className="nm">Bùi Tuấn Tú</b> <i>✦</i> Creating with code <i>✦</i> Small details matter <i>✦</i> </span>)}</div>
      </div>
      <div className="wrap">
      <span className="mono">© {new Date().getFullYear()} Bùi Tuấn Tú · buituantu.com · {t("ft.hint")}</span>
      <span className="foot__prefs">
        <span className="qset" role="group" aria-label={t("p.quality")}>
          <span className="qset__k">{t("p.quality")}</span>
          {QUALITIES.map((q) => (
            <button key={q} type="button" className="tbtn" aria-pressed={p.quality === q} onClick={() => p.setQuality(q)}>{t(`q.${q}` as Key)}</button>
          ))}
        </span>
        <button className="tbtn" onClick={() => p.flip("theme")}>{t("p.theme")}: {t(p.theme === "dark" ? "p.dark" : "p.light")}</button>
        <button className="tbtn" aria-pressed={p.motion} onClick={() => p.flip("motion")}>{t("p.motion")} {onoff(p.motion)}</button>
        <button className="tbtn" aria-pressed={p.sound} onClick={() => p.flip("sound")}>{t("p.sound")} {onoff(p.sound)}</button>
        <button className="tbtn" aria-pressed={p.hud} onClick={() => p.flip("hud")}>{t("p.hud")} {onoff(p.hud)}</button>
      </span>
    </div></footer>
  );
});

/** A depth gauge on the right edge: a marker that sinks as you scroll, with the depth in metres.
 *  The marker and the number are written directly by the scroll handler (see useScrollState). */
export const Gauge = memo(function Gauge({ mark, read }: { mark: RefObject<HTMLDivElement | null>; read: RefObject<HTMLElement | null> }) {
  const { t } = useLang();
  return (
    <div className="gauge" aria-hidden="true">
      <span>{t("gauge")}</span>
      <div className="gauge__rail">{Array.from({ length: 21 }, (_, i) => <i key={i} className={i % 5 === 0 ? "maj" : ""} />)}<div className="gauge__mark" ref={mark}><b ref={read}>−00 m</b></div></div>
    </div>
  );
});

/** The opening sequence: five layer-coloured bands fill the screen while a counter runs, then slide away. */
export function Boot({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"load" | "out" | "gone">(S.rm ? "gone" : "load");
  const num = useRef<HTMLElement>(null);
  useEffect(() => {
    if (S.rm) { onDone(); return; }
    const t0 = performance.now(), dur = 950; let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      if (num.current) num.current.textContent = String(Math.round(e * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick); else { setPhase("out"); onDone(); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);
  useEffect(() => { if (phase !== "out") return; const id = setTimeout(() => setPhase("gone"), 1100); return () => clearTimeout(id); }, [phase]);
  if (phase === "gone") return null;
  return (
    <div className={`boot${phase === "out" ? " out" : ""}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ "--i": i, "--c": `var(--l${i})` } as CSSProperties} />)}
      <div className="boot__meta"><span>BTT / LAYER DIVE</span><b ref={num}>000</b></div>
    </div>
  );
}

/** A small live frame-rate readout for this tab. Its loop only runs while it is switched on. */
export const Hud = memo(function Hud() {
  const { t } = useLang();
  const p = usePrefs();
  const out = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!p.hud) return;
    let raf = 0, frames = 0, t0 = performance.now();
    const loop = (now: number) => {
      frames++;
      if (now - t0 >= 500) { if (out.current) out.current.textContent = String(Math.round((frames * 1000) / (now - t0))); frames = 0; t0 = now; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p.hud]);
  if (!p.hud) return null;
  return (
    <div className="hud" role="status" aria-live="off">
      <i /><span>{t("hud.fps")} <b ref={out}>–</b> fps</span>
      <button onClick={() => p.flip("hud")} aria-label={t("hud.close")}>×</button>
    </div>
  );
});

/** Marks which layer the rail is pointing at, for the scene and for React. */
export function useFocus(over: boolean) {
  const [focus, set] = useState(-1);
  const setFocus = (i: number) => { const v = over || S.demo ? i : -1; S.focus = v; S.kick(); set(v); };
  useEffect(() => { if (!over) { S.focus = -1; set(-1); } }, [over]);
  return [focus, setFocus] as const;
}
