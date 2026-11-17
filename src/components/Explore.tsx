// Explore mode: the 3D stack takes over the screen and can be handled directly. The scene does the
// orbiting, hovering and presenting (scene/layers.ts); this is the controls and the facts about each layer.
import { memo, useEffect, useState, type CSSProperties } from "react";
import { useLang, type Key } from "../i18n";
import { S } from "../store";
import { sfx } from "../lib/sound";

const LAYERS: { title: Key | string; when?: string; body: Key; chips?: (Key | string)[]; id: string }[] = [
  { id: "top", title: "Bùi Tuấn Tú", body: "x.surface", chips: ["hero.cadet"] },
  { id: "l1", title: "l1.h2", when: "2021 – 2025", body: "l1.lede", chips: ["e.1", "e.2", "e.3", "e.4", "e.5"] },
  { id: "l2", title: "2NF Software", when: "12.2023 – 06.2025", body: "l2.lede", chips: ["Vue.js", "Nuxt.js", "Ant Design Vue", "Ruby on Rails", "RESTful API", "AWS", "Twilio"] },
  { id: "l3", title: "l3.h2", body: "l3.lede" },
  { id: "l4", title: "l4.h2", when: "l4.now", body: "l4.lede" },
];

export function useExplore() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const r = document.documentElement;
    S.explore = open; S.pick = -1; S.kick();
    if (open) { r.dataset.explore = "1"; sfx.open(); } else delete r.dataset.explore;
  }, [open]);
  return [open, setOpen] as const;
}

export const Explore = memo(function Explore({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [pick, setPickState] = useState(-1), [hover, setHover] = useState(-1), [spread, setSpread] = useState(false);
  const tr = (k: Key | string) => (k in DICT_KEYS ? t(k as Key) : k);

  const setPick = (i: number) => { S.pick = i; S.kick(); setPickState(i); if (i >= 0) sfx.layer(i); };
  const toggleSpread = () => setSpread((v) => { S.spread = v ? 0 : 1; S.kick(); sfx.toggle(!v); return !v; });
  const reset = () => { S.xreset++; setPick(-1); if (spread) toggleSpread(); };

  // the scene reports hovers and clicks on the slabs
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ hover?: number; pick?: number; spread?: number }>).detail;
      if (d.spread !== undefined) setSpread(!!d.spread);
      if (d.hover !== undefined) { setHover(d.hover); if (d.hover >= 0) sfx.hover(); }
      if (d.pick !== undefined) { setPickState(d.pick); if (d.pick >= 0) sfx.layer(d.pick); }
    };
    addEventListener("btt:x", on);
    return () => removeEventListener("btt:x", on);
  }, []);
  useEffect(() => { if (!open) { setPickState(-1); setHover(-1); setSpread(false); S.spread = 0; } }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element).closest?.("input,textarea")) return;
      if (e.key === "Escape") { if (S.pick >= 0) setPick(-1); else onClose(); }
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") setPick((Math.max(-1, S.pick) + 1) % 5);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") setPick(S.pick <= 0 ? 4 : S.pick - 1);
      else if (/^[0-4]$/.test(e.key)) setPick(+e.key);
      else if (e.key.toLowerCase() === "s") toggleSpread();
      else if (e.key.toLowerCase() === "r") reset();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  if (!open) return null;
  const L = pick >= 0 ? LAYERS[pick] : null;
  const goTo = (id: string) => { onClose(); setTimeout(() => { location.hash = id; }, 350); };
  return (
    <div className="xui" style={{ "--c": pick >= 0 ? `var(--l${pick})` : "var(--acc)" } as CSSProperties}>
      <div className="xui__bar">
        <b>{t("x.title")}</b>
        <div className="xui__chips" role="tablist">
          <button role="tab" aria-selected={pick < 0} onClick={() => setPick(-1)}>{t("x.all")}</button>
          {LAYERS.map((_, i) => (
            <button key={i} role="tab" aria-selected={pick === i} className={hover === i && pick < 0 ? "hov" : ""} style={{ "--c": `var(--l${i})` } as CSSProperties} onClick={() => setPick(i)}>L{i}</button>
          ))}
        </div>
        <div className="xui__act">
          <button onClick={toggleSpread} aria-pressed={spread}>{t(spread ? "x.merge" : "x.spread")}</button>
          <button onClick={reset}>{t("x.reset")}</button>
          <button className="xui__close" onClick={onClose} aria-label={t("x.close")}>✕</button>
        </div>
      </div>

      {hover >= 0 && pick < 0 && <div className="xui__tip" style={{ "--c": `var(--l${hover})` } as CSSProperties}>L{hover} · {tr(LAYERS[hover].title)}</div>}

      {L && (
        <aside className="xui__panel" key={pick}>
          <div className="xui__code">L{pick}{L.when ? <em>{tr(L.when)}</em> : null}</div>
          <h2>{tr(L.title)}</h2>
          <p>{t(L.body)}</p>
          {L.chips && <ul className="chips">{L.chips.map((c) => <li key={c} className="chip">{tr(c)}</li>)}</ul>}
          <div className="xui__row">
            <button className="btn btn--p" onClick={() => goTo(L.id)}>{t("x.go")} →</button>
            {pick === 4 && <button className="btn" onClick={() => dispatchEvent(new Event("btt:morse"))}>{t("x.morse")}</button>}
          </div>
          <div className="xui__nav">
            <button onClick={() => setPick(pick <= 0 ? 4 : pick - 1)} aria-label={t("x.prev")}>←</button>
            <span>{pick + 1} / 5</span>
            <button onClick={() => setPick((pick + 1) % 5)} aria-label={t("x.next")}>→</button>
          </div>
        </aside>
      )}

      <div className="xui__hint">{t(pick >= 0 ? "x.hint2" : "x.hint")}<span>{t("x.keys")}</span></div>
    </div>
  );
});

/** Which strings in LAYERS are translation keys rather than literal text. */
const DICT_KEYS: Record<string, true> = Object.fromEntries(
  ["l1.h2", "l3.h2", "l4.h2", "l4.now", "hero.cadet", "e.1", "e.2", "e.3", "e.4", "e.5"].map((k) => [k, true]),
);
