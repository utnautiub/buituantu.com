// Works out where the page is in the stack. Section centres are measured once (and again when layout
// changes); each scroll frame only does arithmetic, writes the result into the shared store for the 3D
// scene, and tells React only when the nearest section actually changes.
import { useEffect, useState, type RefObject } from "react";
import { S } from "../store";

export interface Where { id: string; layer: number; index: number; over: boolean }

export function useScrollState(main: RefObject<HTMLElement | null>, bar: RefObject<HTMLElement | null>, dep: unknown) {
  const [where, setWhere] = useState<Where>({ id: "top", layer: 0, index: 0, over: false });

  useEffect(() => {
    const root = main.current; if (!root) return;
    const secs = Array.from(root.querySelectorAll<HTMLElement>(":scope > section")).map((el) => ({ el, id: el.id, d: +el.dataset.d!, f: +el.dataset.f!, k: +(el.dataset.k || 0), layer: +el.dataset.layer!, c: 0 }));
    let vh = innerHeight, maxY = 1, ticking = false, cur = "", prevY = scrollY, skew = 0;
    const marq = document.querySelector<HTMLElement>(".marq .track");

    const update = () => {
      ticking = false;
      const sy = scrollY, mid = sy + vh * 0.48, n = secs.length;
      // Scroll speed feeds the marquee's lean and the stack's stretch. Keep ticking until both have settled.
      const v = sy - prevY; prevY = sy; S.vel = v;
      skew += (Math.max(-14, Math.min(14, v * 0.45)) - skew) * 0.2;
      if (Math.abs(skew) < 0.05) skew = 0;
      marq?.style.setProperty("--skew", S.rm ? "0deg" : `${(-skew).toFixed(2)}deg`);
      if (v !== 0 || skew !== 0) { ticking = true; requestAnimationFrame(update); }
      let a = secs[0], b = secs[0], t = 0;
      if (mid >= secs[n - 1].c) a = b = secs[n - 1];
      else if (mid > secs[0].c) for (let i = 0; i < n - 1; i++) if (mid < secs[i + 1].c) { a = secs[i]; b = secs[i + 1]; t = (mid - a.c) / (b.c - a.c); break; }
      const near = t < 0.5 ? a : b; t = t * t * (3 - 2 * t);
      S.d = a.d + (b.d - a.d) * t; S.f = a.f + (b.f - a.f) * t; S.k = a.k + (b.k - a.k) * t; S.kick();
      if (bar.current) bar.current.style.transform = `scaleX(${sy / maxY})`;
      if (near.id !== cur) { cur = near.id; setWhere({ id: near.id, layer: near.layer, index: Math.round(near.d), over: near.f >= 1 }); }
    };
    const measure = () => {
      vh = innerHeight; const y = scrollY;
      for (const o of secs) { const r = o.el.getBoundingClientRect(); o.c = r.top + y + r.height / 2; }
      maxY = Math.max(1, document.documentElement.scrollHeight - vh); update();
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", measure); addEventListener("load", measure);
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure); ro.observe(root);
    measure();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", measure); removeEventListener("load", measure); ro.disconnect(); };
  }, [main, bar, dep]);

  return where;
}
