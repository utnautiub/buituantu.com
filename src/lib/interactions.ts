// Pointer niceties that do not need React: the cursor ring, card tilt with a spotlight, magnetic buttons
// and a pulse through the 3D stack when the bare page is clicked. Everything is delegated, so elements
// rendered later are picked up automatically.
import { FINE, S } from "../store";
import { sfx, unlockSound } from "./sound";
import { ripple } from "./fx";

export function initInteractions(ring: HTMLElement) {
  const offs: (() => void)[] = [];
  const on = <E extends Event>(n: string, fn: (e: E) => void) => { document.addEventListener(n, fn as EventListener, { passive: true }); offs.push(() => document.removeEventListener(n, fn as EventListener)); };

  on<PointerEvent>("pointerdown", (e) => {
    unlockSound();
    if ((e.target as Element).closest("a,button,input,.pal,.card")) sfx.click(); else { S.pulse(); sfx.pulse(); }
    ripple(e.clientX, e.clientY);
  });
  on("keydown", () => unlockSound());
  if (!FINE) return () => offs.forEach((f) => f());

  document.body.classList.add("cc");
  let px = 0, py = 0, rx = 0, ry = 0, running = false, hot = false, moved = false;
  const loop = () => {
    rx += (px - rx) * 0.22; ry += (py - ry) * 0.22;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
    if (Math.abs(px - rx) + Math.abs(py - ry) > 0.3) requestAnimationFrame(loop); else running = false;
  };
  on<PointerEvent>("pointermove", (e) => {
    px = e.clientX; py = e.clientY;
    if (!moved) { moved = true; rx = px; ry = py; document.body.classList.add("moved"); }
    if (!running) { running = true; requestAnimationFrame(loop); }
  });

  const wired = new WeakSet<Element>();
  let lastHover: Element | null = null;
  on<PointerEvent>("pointerover", (e) => {
    const t = e.target as Element;
    const target = t.closest("a,button,.card,input,.chip");
    const h = !!target;
    if (h !== hot) { hot = h; ring.classList.toggle("hot", h); }
    if (target && target !== lastHover && !target.classList.contains("tool")) sfx.hover();
    lastHover = target;

    const card = t.closest<HTMLElement>(".card");
    if (card && !wired.has(card)) {
      wired.add(card); let r: DOMRect | null = null;
      card.addEventListener("pointerenter", () => { r = card.getBoundingClientRect(); card.classList.add("tilt"); });
      card.addEventListener("pointermove", (ev) => {
        r ??= card.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${x * 100}%`); card.style.setProperty("--my", `${y * 100}%`);
        if (!S.rm) card.style.transform = `rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg)`;
      });
      card.addEventListener("pointerleave", () => { r = null; card.classList.remove("tilt"); card.style.transform = ""; });
    }
    const mag = t.closest<HTMLElement>(".mag");
    if (mag && !wired.has(mag)) {
      wired.add(mag); let r: DOMRect | null = null;
      mag.addEventListener("pointerenter", () => { r = mag.getBoundingClientRect(); });
      mag.addEventListener("pointermove", (ev) => { if (S.rm) return; r ??= mag.getBoundingClientRect(); mag.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * 0.25}px,${(ev.clientY - r.top - r.height / 2) * 0.35}px)`; });
      mag.addEventListener("pointerleave", () => { r = null; mag.style.transform = ""; });
    }
  });
  return () => { offs.forEach((f) => f()); document.body.classList.remove("cc", "moved"); };
}
