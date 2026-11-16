// Spring letters for a headline. Each letter is its own damped spring: near the pointer it lifts away,
// tilts, grows and takes a layer colour, then settles back. A wave can be sent through all of them.
import { S } from "../store";
import { sfx } from "./sound";

interface Letter { el: HTMLElement; i: number; g: boolean; cx: number; cy: number; x: number; y: number; r: number; s: number; vx: number; vy: number; vr: number; vs: number; tint: number }

const K = 170, C = 17;

export class Kinetic {
  private letters: Letter[] = [];
  private fs = 96; private px = 0; private py = 0; private active = false; private raf = 0; private last = 0;
  private impulses: { at: number; i: number; v: number }[] = [];
  private lastInput = 0; private timer = 0; private near = -1; private off: (() => void)[] = [];

  constructor(private h: HTMLElement, host: HTMLElement, private idleOk: () => boolean) {
    this.letters = Array.from(h.querySelectorAll<HTMLElement>(".kc")).map((el, i) => ({ el, i, g: el.classList.contains("kg"), cx: 0, cy: 0, x: 0, y: 0, r: 0, s: 1, vx: 0, vy: 0, vr: 0, vs: 0, tint: -1 }));
    const on = <E extends Event>(t: EventTarget, n: string, fn: (e: E) => void) => { t.addEventListener(n, fn as EventListener, { passive: true }); this.off.push(() => t.removeEventListener(n, fn as EventListener)); };
    on<PointerEvent>(host, "pointermove", (e) => { if (e.pointerType === "touch") return; this.point(e.clientX, e.clientY); });
    on(host, "pointerleave", () => this.release());
    on<PointerEvent>(host, "pointerdown", (e) => this.burst(e.clientX, e.clientY));
    on(host, "pointerenter", () => this.measure());
    const touch = (e: TouchEvent) => { const t = e.touches[0]; if (t) this.point(t.clientX, t.clientY); else this.release(); };
    on<TouchEvent>(h, "touchstart", touch); on<TouchEvent>(h, "touchmove", touch); on<TouchEvent>(h, "touchend", touch); on(h, "touchcancel", () => this.release());
    on(window, "resize", () => this.measure());
    document.fonts?.ready.then(() => this.measure());
    this.timer = window.setInterval(() => { if (this.idleOk() && !document.hidden && !this.active && performance.now() - this.lastInput > 9000) this.wave(90); }, 9000);
    this.measure();
  }

  private point(x: number, y: number) { this.px = x; this.py = y; this.active = true; this.lastInput = performance.now(); this.kick(); }
  private release() { this.active = false; this.kick(); }

  measure() {
    if (!this.letters.length) return;
    const hr = this.h.getBoundingClientRect(), ox = hr.left + scrollX, oy = hr.top + scrollY;
    this.fs = parseFloat(getComputedStyle(this.h).fontSize) || 96;
    for (const l of this.letters) { l.cx = ox + l.el.offsetLeft + l.el.offsetWidth / 2; l.cy = oy + l.el.offsetTop + l.el.offsetHeight / 2; }
    // One gradient across the highlighted words: every letter shows its own slice of it.
    const gs = this.letters.filter((l) => l.g);
    if (gs.length) {
      const pad = parseFloat(getComputedStyle(gs[0].el).paddingLeft) || 0;
      const total = gs.reduce((a, l) => a + l.el.offsetWidth - 2 * pad, 0);
      let cum = 0;
      for (const l of gs) { l.el.style.setProperty("--gx", `${pad - cum}px`); l.el.style.setProperty("--gw", `${total}px`); cum += l.el.offsetWidth - 2 * pad; }
    }
  }

  wave(strength = 160) {
    if (S.rm) return;
    const now = performance.now();
    for (const l of this.letters) this.impulses.push({ at: now + l.i * 32, i: l.i, v: -strength });
    this.kick();
  }

  /** Start every letter somewhere else, spinning, and let the springs pull the line together. */
  scatter() {
    if (S.rm) return;
    this.measure();
    for (const l of this.letters) {
      l.x = (Math.random() - 0.5) * this.fs * 7; l.y = (Math.random() - 0.5) * this.fs * 4.5 - this.fs;
      l.r = (Math.random() - 0.5) * 160; l.s = 0.3 + Math.random() * 0.5; l.vx = l.vy = l.vr = l.vs = 0;
      l.el.style.transform = `translate(${l.x.toFixed(1)}px,${l.y.toFixed(1)}px) rotate(${l.r.toFixed(1)}deg) scale(${l.s.toFixed(2)})`;
    }
    this.kick();
  }

  /** Kick the letters away from a point, like a small explosion. */
  burst(x: number, y: number) {
    if (S.rm) return;
    const R = this.fs * 3.2, k = this.fs / 96;
    for (const l of this.letters) {
      const dx = l.cx - scrollX - x, dy = l.cy - scrollY - y, d = Math.hypot(dx, dy) || 1, f = Math.max(0, 1 - d / R);
      if (!f) continue;
      l.vx += (dx / d) * f * 1500 * k; l.vy += (dy / d) * f * 1500 * k - f * 300 * k; l.vr += (Math.random() - 0.5) * f * 1400;
    }
    this.kick();
  }

  private kick() { if (!this.raf && !S.rm) { this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); } }

  private frame = (t: number) => {
    const dt = Math.min(1 / 30, Math.max(0, t - this.last) / 1000 || 1 / 60); this.last = t;
    const R = this.fs * 1.7, k = this.fs / 96, sx = scrollX, sy = scrollY;
    let moving = this.impulses.length > 0, best = -1, bestF = 0.45;
    for (let j = this.impulses.length - 1; j >= 0; j--) {
      const im = this.impulses[j];
      if (im.at <= t) { const l = this.letters[im.i]; if (l) l.vy += im.v * k; this.impulses.splice(j, 1); }
    }
    for (const l of this.letters) {
      let tx = 0, ty = 0, tr = 0, ts = 1, f = 0;
      if (this.active) {
        const dx = this.px - (l.cx - sx), dy = this.py - (l.cy - sy);
        f = Math.max(0, 1 - Math.hypot(dx, dy) / R);
        if (f > 0) { tx = -dx * f * 0.25; ty = -dy * f * 0.45 - f * 16 * k; tr = (dx * f * 0.08) / k; ts = 1 + f * 0.22; if (f > bestF) { bestF = f; best = l.i; } }
      }
      l.vx += (K * (tx - l.x) - C * l.vx) * dt; l.vy += (K * (ty - l.y) - C * l.vy) * dt;
      l.vr += (K * (tr - l.r) - C * l.vr) * dt; l.vs += (K * (ts - l.s) - C * l.vs) * dt;
      l.x += l.vx * dt; l.y += l.vy * dt; l.r += l.vr * dt; l.s += l.vs * dt;
      const still = Math.abs(l.x) + Math.abs(l.y) + Math.abs(l.r) + Math.abs(l.s - 1) < 0.02 && Math.abs(l.vx) + Math.abs(l.vy) < 0.05;
      if (still && f === 0) { l.x = l.y = l.r = l.vx = l.vy = l.vr = l.vs = 0; l.s = 1; } else moving = true;
      l.el.style.transform = l.x || l.y || l.r || l.s !== 1 ? `translate(${l.x.toFixed(2)}px,${l.y.toFixed(2)}px) rotate(${l.r.toFixed(2)}deg) scale(${l.s.toFixed(3)})` : "";
      const tint = f > 0.18 ? l.i % 5 : -1;
      if (tint !== l.tint) { l.tint = tint; l.el.style.color = tint < 0 ? "" : `var(--l${tint})`; if (l.g) l.el.classList.toggle("tint", tint >= 0); }
    }
    if (best >= 0 && best !== this.near) sfx.letter(best / Math.max(1, this.letters.length - 1));
    this.near = best;
    this.raf = moving ? requestAnimationFrame(this.frame) : 0;
  };

  destroy() {
    cancelAnimationFrame(this.raf); clearInterval(this.timer);
    this.off.forEach((f) => f()); this.off = [];
  }
}
