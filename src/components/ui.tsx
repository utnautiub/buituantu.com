import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { reveal, scramble } from "../lib/reveal";
import { Kinetic } from "../lib/kinetic";
import type { Part } from "../data";
import { useLang } from "../i18n";
import { S } from "../store";

type Base = { as?: ElementType; i?: number; className?: string; style?: CSSProperties } & Omit<HTMLAttributes<HTMLElement>, "style" | "className">;
const vars = (i: number, style?: CSSProperties) => ({ "--i": i, ...style }) as CSSProperties;

/** Fades up the first time it scrolls into view. `i` staggers siblings. */
export function R({ as = "div", i = 0, className = "", style, children, ...rest }: Base & { children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => reveal(ref.current!), []);
  const Tag = as as "div";
  return <Tag ref={ref as never} className={`rv ${className}`} style={vars(i, style)} {...rest}>{children}</Tag>;
}

/** A heading whose text decodes into place when revealed, and again when the language changes. */
export function Scr({ as = "h2", i = 0, className = "", style, text, ...rest }: Base & { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang(); // re-run on a language switch even when the text itself is the same in both
  useEffect(() => {
    const el = ref.current!;
    if (el.classList.contains("in")) { scramble(el, text); return; }
    el.textContent = text;
    return reveal(el, () => scramble(el, text));
  }, [text, lang]);
  const Tag = as as "h2";
  return <Tag ref={ref as never} className={`rv ${className}`} style={vars(i, style)} data-own-text="" {...rest} />;
}

/** A headline made of spring letters (see lib/kinetic). `wave` says when the first wave runs. */
export function KineticHeading({ as = "h1", parts, idle, wave, className = "", id }: { as?: "h1" | "h2"; parts: Part[]; idle: () => boolean; wave: "load" | "reveal"; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current!, host = el.closest("section") ?? el;
    const k = new Kinetic(el, host as HTMLElement, idle);
    let timer = 0;
    const go = (ms: number) => { timer = window.setTimeout(() => { k.measure(); k.wave(160); }, ms); };
    let stop = () => {};
    if (wave === "reveal") stop = reveal(el, () => go(450));
    else if (S.ready) { go(350); const onReplay = () => k.scatter(); addEventListener("btt:replay", onReplay); stop = () => removeEventListener("btt:replay", onReplay); } // remounted by a language switch
    else {
      // first load: the letters fly in from all over as the opening sequence lifts
      const onReady = () => k.scatter();
      addEventListener("btt:ready", onReady, { once: true });
      addEventListener("btt:replay", onReady);
      stop = () => { removeEventListener("btt:ready", onReady); removeEventListener("btt:replay", onReady); };
    }
    return () => { clearTimeout(timer); stop(); k.destroy(); };
  }, [parts, idle, wave]);
  const Tag = as;
  let w = 0;
  return (
    <Tag ref={ref} id={id} className={`${wave === "reveal" ? "rv " : ""}${className}`} style={vars(1)} aria-label={parts.filter((p) => p[0] !== "\n").map((p) => p[0]).join(" ")}>
      {parts.map(([word, grad], n) => word === "\n" ? <br key={n} /> : (
        <span key={n}>
          <span className="kw" aria-hidden="true" style={{ "--w": w++ } as CSSProperties}>
            {Array.from(word).map((ch, c) => <span key={c} className={grad ? "kc kg" : "kc"}>{ch}</span>)}
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}
