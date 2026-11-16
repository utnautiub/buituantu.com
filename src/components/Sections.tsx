import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { EXP, HEADLINE, LINKS, MAIL_B64, MARQUEE, SIGNOFF, TOOLS, type ExpKey } from "../data";
import { useLang } from "../i18n";
import { S } from "../store";
import { morseTone, sfx } from "../lib/sound";
import { confetti } from "../lib/fx";
import { KineticHeading, R, Scr } from "./ui";

const onHero = () => S.d < 0.6;
const onOverview = () => S.f > 0.5;

export function Hero({ onPalette }: { onPalette: () => void }) {
  const { lang, t } = useLang();
  return (
    <section className="sec hero" id="top" data-d="0" data-f="0" data-layer="0">
      <div className="wrap"><div className="col">
        <div className="eyebrow">{t("hero.eyebrow")}</div>
        <KineticHeading key={lang} as="h1" parts={HEADLINE[lang]} idle={onHero} wave="load" />
        <R as="p" className="lede" i={6}>{t("hero.lede")}</R>
        <R className="cta" i={7}>
          <a className="btn btn--p mag" href="#l1">{t("hero.cta")} ↓</a>
          <button className="btn mag" onClick={onPalette}>{t("hero.term")} <kbd>⌘K</kbd></button>
        </R>
        <R className="cue" i={8}><i /><span>{t("hero.cue")}</span></R>
      </div></div>
    </section>
  );
}

export function University() {
  const { t } = useLang();
  return (
    <section className="sec" id="l1" data-d="1" data-f="0" data-layer="1">
      <div className="wrap"><span className="ghost" aria-hidden="true">01</span><div className="col">
        <R className="tag">L1 · {t("l1.tag")} <em>2021 – 2025</em></R>
        <Scr i={1} text={t("l1.h2")} />
        <R as="p" className="lede" i={2}>{t("l1.lede")}</R>
        <R as="ul" className="chips" i={3} style={{ marginTop: 24 }}>
          {(["e.1", "e.2", "e.3", "e.4", "e.5", "e.6"] as const).map((k) => <li key={k} className="chip">{t(k)}</li>)}
        </R>
      </div></div>
    </section>
  );
}

export function Work() {
  const { lang, t } = useLang();
  const [k, setK] = useState<ExpKey>("fe");
  const seg = useRef<HTMLDivElement>(null);
  const e = EXP[k];
  // Slide the pill under the selected tab.
  useLayoutEffect(() => {
    const el = seg.current!, btn = el.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
    el.style.setProperty("--px", `${btn.offsetLeft - 3}px`); el.style.setProperty("--pw", `${btn.offsetWidth}px`);
  }, [k, lang]);
  const pick = (n: ExpKey) => { if (n !== k) { setK(n); S.pulse(); sfx.toggle(n === "be"); } };
  return (
    <section className="sec" id="l2" data-d="2" data-f="0" data-layer="2">
      <div className="wrap"><span className="ghost" aria-hidden="true">02</span><div className="col">
        <R className="tag">L2 · {t("l2.tag")} <em>12.2023 – 06.2025</em></R>
        <Scr i={1} text="2NF Software" />
        <R as="p" className="lede" i={2}>{t("l2.lede")}</R>
        <R i={3}>
          <div className="seg" ref={seg} role="tablist" onKeyDown={(ev) => { if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") pick(k === "fe" ? "be" : "fe"); }}>
            <span className="pill" />
            <button role="tab" data-k="fe" aria-selected={k === "fe"} onClick={() => pick("fe")}>Frontend</button>
            <button role="tab" data-k="be" aria-selected={k === "be"} onClick={() => pick("be")}>Backend</button>
          </div>
        </R>
        <R className="card" i={4} id="expPanel" role="tabpanel">
          <div key={k} className="sw" style={{ display: "contents" }}>
            <div className="k"><span>{t("l2.full")}</span><b>{e.when}</b></div>
            <h3>{e.title}</h3>
            <ul className="list">{e.bullets.map((b) => <li key={b[0]}>{lang === "vi" ? b[1] : b[0]}</li>)}</ul>
            <ul className="chips">{e.skills.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
          </div>
        </R>
      </div></div>
    </section>
  );
}

export function Service() {
  const { t } = useLang();
  return (
    <section className="sec sec--short" id="l3" data-d="3" data-f="0" data-layer="3">
      <div className="wrap"><span className="ghost" aria-hidden="true">03</span><div className="col">
        <R className="tag">L3 · {t("l3.tag")}</R>
        <Scr i={1} text={t("l3.h2")} />
        <R as="p" className="lede" i={2}>{t("l3.lede")}</R>
      </div></div>
    </section>
  );
}

const MORSE: Record<string, string> = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", 0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----." };
type Mark = { kind: "d" | "h" | "gap" | "space"; units: number };
/** Vietnamese text is reduced to plain A–Z first, so "Tú" is sent as TU. */
const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "D").toUpperCase().replace(/[^A-Z0-9 ]/g, "").replace(/\s+/g, " ").trim();
function encode(text: string): Mark[] {
  const out: Mark[] = [];
  Array.from(text).forEach((ch, i) => {
    if (ch === " ") { out.push({ kind: "space", units: 4 }); return; }
    if (i && text[i - 1] !== " ") out.push({ kind: "gap", units: 2 });
    for (const s of MORSE[ch]) out.push(s === "." ? { kind: "d", units: 1 } : { kind: "h", units: 3 });
  });
  return out;
}

export function Signal() {
  const { t } = useLang();
  const [text, setText] = useState("BTT"), [marks, setMarks] = useState(() => encode("BTT")), [lit, setLit] = useState(0), [lamp, setLampState] = useState(false);
  const run = useRef(0), value = useRef(text); value.current = text;
  const setLamp = (v: boolean) => { setLampState(v); S.lamp = v ? 1 : 0; S.kick(); morseTone(v); };

  const play = useCallback(() => {
    const msg = plain(value.current) || "BTT", seq = encode(msg), id = ++run.current, unit = 85;
    setText(msg); setMarks(seq); setLit(0); setLamp(false); S.pulse();
    if (S.rm) { setLit(seq.length); return; }
    let i = 0;
    const next = () => {
      if (id !== run.current) return;
      if (i >= seq.length) { setLamp(false); return; }
      const m = seq[i++]; setLit(i);
      if (m.kind === "d" || m.kind === "h") { setLamp(true); setTimeout(() => { if (id !== run.current) return; setLamp(false); setTimeout(next, unit); }, m.units * unit); }
      else setTimeout(next, m.units * unit);
    };
    next();
  }, []);
  useEffect(() => { addEventListener("btt:morse", play); return () => { removeEventListener("btt:morse", play); run.current++; S.lamp = 0; morseTone(false); }; }, [play]);

  return (
    <section className="sec" id="l4" data-d="4" data-f="0" data-layer="4">
      <div className="wrap"><span className="ghost" aria-hidden="true">04</span><div className="col">
        <R className="tag">L4 · {t("l4.tag")} <em>{t("l4.now")}</em></R>
        <Scr i={1} text={t("l4.h2")} />
        <R as="p" className="lede" i={2}>{t("l4.lede")}</R>
        <div className="grid">
          <R className="card" i={3}>
            <div className="k"><span>{t("l4.k")}</span><b>Morse</b></div>
            <h3>{t("l4.c")}</h3>
            <div className="morse" style={{ marginTop: 12 }}>
              <input value={text} maxLength={18} aria-label={t("l4.msg")} autoComplete="off" spellCheck={false}
                onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); play(); } }} />
              <button className="btn btn--p" type="button" onClick={play}>{t("l4.send")}</button>
            </div>
            <div className="mrow">
              <span className={`lamp${lamp ? " on" : ""}`} />
              <div className="mcode">
                {marks.map((m, i) => m.kind === "gap" ? <b key={i} /> : m.kind === "space" ? <s key={i} /> : <i key={i} className={`${m.kind}${i < lit ? " on" : ""}`} />)}
              </div>
            </div>
          </R>
        </div>
      </div></div>
    </section>
  );
}

export function Tools() {
  const { t } = useLang();
  const point = (i: number) => { if (S.tool === i) return; S.tool = i; S.kick(); if (i >= 0) sfx.tool(i); };
  return (
    <>
      <div className="marq" aria-hidden="true"><div className="track">{[...MARQUEE, ...MARQUEE].map((n, i) => <span key={i}>{n}</span>)}</div></div>
      <section className="sec" id="stack" data-d="4" data-f="0" data-k="1" data-layer="4">
        <div className="wrap"><div className="col" style={{ maxWidth: 720 }}>
          <R className="tag">{t("sk.tag")}</R>
          <Scr i={1} text={t("sk.h2")} />
          <R as="p" className="lede" i={2}>{t("sk.lede")}</R>
          {/* Each card is tied to its tile in the 3D kit on the right: hover one and its tile lifts. */}
          <R className="grid tools" i={3} onPointerLeave={() => point(-1)}>
            {TOOLS.map(([name, kind, href], i) => (
              <a key={name} className="card tool" href={href} target="_blank" rel="noopener" style={{ "--n": i } as CSSProperties}
                onPointerEnter={() => point(i)} onFocus={() => point(i)} onBlur={() => point(-1)}>
                <div className="k"><span>{kind}</span><b>{String(i + 1).padStart(2, "0")}</b></div><h3>{name}</h3>
              </a>
            ))}
          </R>
        </div></div>
      </section>
    </>
  );
}

export function Contact({ notify }: { notify: (msg: string) => void }) {
  const { lang, t } = useLang();
  const [mail, setMail] = useState("");
  // Each card is tied to a tile laid on top of the stack on the right: hover one and its tile lifts.
  const point = (i: number) => { if (S.link === i) return; S.link = i; S.kick(); if (i >= 0) sfx.tool(i); };
  const copy = (e: MouseEvent) => {
    const a = atob(MAIL_B64); setMail(a); confetti(e.clientX, e.clientY);
    navigator.clipboard?.writeText(a).then(() => notify(t("ct.copied")), () => {});
  };
  return (
    <section className="sec contact" id="contact" data-d="2" data-f="1" data-layer="0">
      <div className="wrap"><div className="col" style={{ maxWidth: 720 }}>
        <R className="tag">{t("ct.tag")}</R>
        <KineticHeading key={lang} as="h2" parts={SIGNOFF[lang]} idle={onOverview} wave="reveal" />
        <R className="links" i={2} onPointerLeave={() => point(-1)}>
          <button className="lk mag" onClick={copy} style={{ "--n": 0 } as CSSProperties} onPointerEnter={() => point(0)} onFocus={() => point(0)} onBlur={() => point(-1)}>
            <span className="ic ic--m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5 21 3Z" /></svg></span>
            <span><b>{t("ct.mail")}</b><small>{mail || t("ct.mail.s")}</small></span>
          </button>
          {LINKS.map((l, i) => (
            <a key={l.name} className="lk mag" href={l.href} target="_blank" rel="noopener" style={{ "--n": i + 1 } as CSSProperties} onPointerEnter={() => point(i + 1)} onFocus={() => point(i + 1)} onBlur={() => point(-1)}>
              <img className="ic" src={l.icon} alt="" width={36} height={36} />
              <span><b>{l.name}</b><small>{l.handle}</small></span>
            </a>
          ))}
        </R>
      </div></div>
    </section>
  );
}
