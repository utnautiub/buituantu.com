// One shared observer for everything that fades up on first view.
import { S } from "../store";

type Cb = () => void;
const pending = new WeakMap<Element, Cb>();
let io: IntersectionObserver | null = null;

function show(el: Element) { el.classList.add("in"); pending.get(el)?.(); pending.delete(el); }

export function reveal(el: Element, onShow?: Cb) {
  if (onShow) pending.set(el, onShow);
  if (S.rm || !("IntersectionObserver" in window)) { show(el); return () => {}; }
  io ??= new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { show(e.target); io!.unobserve(e.target); } }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  io.observe(el);
  return () => io?.unobserve(el);
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_";
const tokens = new WeakMap<Element, number>();

/** Decode-style reveal of a heading. The element's text is owned by this function, not by React. */
export function scramble(el: HTMLElement, text: string) {
  const tok = (tokens.get(el) ?? 0) + 1; tokens.set(el, tok);
  if (S.rm) { el.textContent = text; return; }
  const t0 = performance.now(), dur = 600; let lastN = -1;
  const step = (now: number) => {
    if (tokens.get(el) !== tok) return;
    const p = Math.min(1, (now - t0) / dur), n = Math.floor(p * text.length);
    if (n !== lastN || p >= 1) {
      lastN = n; let out = text.slice(0, n);
      for (let i = n; i < text.length; i++) out += text[i] === " " ? " " : i > n + 6 ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = p < 1 ? out : text;
    }
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---- language switch: every visible piece of text on the page decodes into the new language ---- */
const LOWER = "abcdefghijklmnopqrstuvwxyz", UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let wave = 0;
let live: { n: Text; text: string; delay: number; dur: number }[] = [];

/** Put any half-decoded text back to its final form. Call before React swaps the strings. */
export function settleText() {
  wave++;
  for (const it of live) it.n.nodeValue = it.text;
  live = [];
}

/** Scramble every text node currently on screen. Only `nodeValue` of existing nodes is touched, so React
 *  keeps owning them; headings that animate themselves (`data-own-text`, spring letters) are skipped. */
export function scrambleAll(root: HTMLElement) {
  settleText();
  if (S.rm) return;
  const vh = innerHeight, id = wave, items: typeof live = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      const p = n.parentElement;
      if (!p || !n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return p.closest(".kw,[data-own-text],.stage,svg,script,style,.mcode,.pal,.hud b") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  while (walker.nextNode()) {
    const n = walker.currentNode as Text, r = n.parentElement!.getBoundingClientRect();
    if (r.width === 0 || r.bottom < -40 || r.top > vh + 40) continue;
    const text = n.nodeValue!;
    items.push({ n, text, delay: (Math.max(0, r.top) / vh) * 220, dur: Math.min(750, 260 + text.length * 5) });
  }
  live = items;
  const t0 = performance.now();
  const step = (now: number) => {
    if (id !== wave) return;
    let busy = false;
    for (const it of items) {
      const p = Math.min(1, Math.max(0, (now - t0 - it.delay) / it.dur));
      if (p >= 1) { if (it.n.nodeValue !== it.text) it.n.nodeValue = it.text; continue; }
      busy = true;
      const n = Math.floor(p * it.text.length); let out = it.text.slice(0, n);
      for (let i = n; i < it.text.length; i++) {
        const c = it.text[i];
        if (c === " " || c === "\u00A0" || !/[\p{L}\p{N}]/u.test(c)) out += c;
        else { const pool = c.toLowerCase() === c && c.toUpperCase() !== c ? LOWER : UPPER; out += pool[(Math.random() * pool.length) | 0]; }
      }
      it.n.nodeValue = out;
    }
    if (busy) requestAnimationFrame(step); else live = [];
  };
  requestAnimationFrame(step);
}
