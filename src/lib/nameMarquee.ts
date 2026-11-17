// The big marquee in the footer. It drifts while it scrolls into view, glides to a stop with the name in
// the middle of the screen, holds there for a few seconds, then picks up speed and drifts on. It does
// this once each time it comes into view, and only animates while it is on screen.
import { S } from "../store";

const SPEED = 70;   // px per second
const HOLD = 0;  // ms on the name

export function initNameMarquee(box: HTMLElement, track: HTMLElement) {
  let x = 0, raf = 0, last = 0, visible = false, half = 1, goal = 0, gas = 1, timer = 0;
  let mode: "drift" | "stopping" | "holding" = "drift", doneThisVisit = false;

  const measure = () => { half = track.scrollWidth / 2 || 1; };
  /** The track offset that puts the next copy of the name, ahead in the direction of travel, mid-screen. */
  const target = () => {
    const mid = box.clientWidth / 2;
    let best = x, bestD = Infinity;
    for (const n of track.querySelectorAll<HTMLElement>(".nm")) {
      for (const shift of [0, -half]) {
        const t = mid - (n.offsetLeft + n.offsetWidth / 2) + shift, d = x - t;
        if (d >= -2 && d < bestD) { bestD = d; best = t; }
      }
    }
    return best;
  };
  const paint = () => { track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`; };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    if (mode === "stopping") {
      x += (goal - x) * (1 - Math.exp(-dt * 3.2));
      if (Math.abs(goal - x) < 0.2) { x = goal; hold(); }
    } else if (mode === "drift" && !S.rm) {
      gas = Math.min(1, gas + dt * 0.8); // pick speed back up gently after a stop
      x -= SPEED * dt * gas * gas;
    }
    if (x <= -half) { x += half; goal += half; }
    paint();
    raf = visible && mode !== "holding" && !(S.rm && mode === "drift") ? requestAnimationFrame(frame) : 0;
  };
  const run = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const stop = () => {
    if (mode !== "drift" || doneThisVisit) return;
    doneThisVisit = true; mode = "stopping"; measure(); goal = target();
    box.classList.add("lock");
    if (S.rm) { x = goal; paint(); hold(); }
    run();
  };
  const hold = () => {
    mode = "holding";
    clearTimeout(timer);
    timer = window.setTimeout(() => { mode = "drift"; gas = 0; box.classList.remove("lock"); run(); }, HOLD);
  };
  const reset = () => { clearTimeout(timer); mode = "drift"; gas = 1; doneThisVisit = false; box.classList.remove("lock"); };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!visible) { reset(); return; }
    if (e.intersectionRatio >= 0.6) stop();
    run();
  }, { threshold: [0, 0.6, 1] });
  io.observe(box);
  measure(); addEventListener("resize", measure);
  document.fonts?.ready.then(measure);
  return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); removeEventListener("resize", measure); };
}
