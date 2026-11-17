// One-shot effects made of a few short-lived DOM nodes animated with the Web Animations API.
import { S } from "../store";

const EASE = "cubic-bezier(.22,1,.36,1)";

/** A ring that opens where the page was clicked. */
export function ripple(x: number, y: number) {
  if (S.rm) return;
  const el = document.createElement("span");
  el.className = "fx-ripple"; el.style.left = `${x}px`; el.style.top = `${y}px`;
  document.body.appendChild(el);
  el.animate([{ transform: "translate(-50%,-50%) scale(.15)", opacity: 0.8 }, { transform: "translate(-50%,-50%) scale(1)", opacity: 0 }], { duration: 700, easing: EASE }).onfinish = () => el.remove();
}

/** A burst of layer-coloured bits, thrown up and pulled back down. */
export function confetti(x: number, y: number, count = 26) {
  if (S.rm) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span"), a = Math.random() * Math.PI * 2, v = 70 + Math.random() * 150;
    const dx = Math.cos(a) * v, dy = Math.sin(a) * v - 90, rot = (Math.random() - 0.5) * 900;
    el.className = "fx-bit"; el.style.left = `${x}px`; el.style.top = `${y}px`; el.style.background = `var(--l${i % 5})`;
    if (i % 3 === 0) el.style.borderRadius = "50%";
    document.body.appendChild(el);
    el.animate([
      { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.8}px), calc(-50% + ${dy * 0.8}px)) rotate(${rot * 0.6}deg) scale(1)`, opacity: 1, offset: 0.45 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 220}px)) rotate(${rot}deg) scale(.6)`, opacity: 0 },
    ], { duration: 950 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => el.remove();
  }
}

/** A bright line that crosses the screen in the direction of travel when the layer changes. */
export function sweep(el: HTMLElement, down: boolean) {
  if (S.rm) return;
  el.dataset.dir = down ? "down" : "up";
  const from = down ? "-6vh" : "106vh", to = down ? "106vh" : "-6vh";
  el.animate([{ transform: `translateY(${from})`, opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 0.9, offset: 0.7 }, { transform: `translateY(${to})`, opacity: 0 }], { duration: 950, easing: "cubic-bezier(.6,0,.2,1)" });
}

/** A comet tail behind the pointer, drawn on one overlay canvas that only animates while the tail is alive. */
export function initTrail(canvas: HTMLCanvasElement) {
  const g = canvas.getContext("2d");
  if (!g || !matchMedia("(pointer: fine)").matches) return () => {};
  const pts: { x: number; y: number; t: number }[] = [];
  let raf = 0, color = "#ffb545";
  const LIFE = 420;
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  const draw = (now: number) => {
    while (pts.length && now - pts[0].t > LIFE) pts.shift();
    g.clearRect(0, 0, canvas.width, canvas.height);
    if (pts.length < 2 || S.rm) { raf = 0; pts.length = 0; return; }
    g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = color;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], k = i / pts.length, life = 1 - (now - b.t) / LIFE;
      g.globalAlpha = k * life * 0.16; g.lineWidth = 3 + k * 16;
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      g.globalAlpha = k * life * 0.8; g.lineWidth = 0.6 + k * 2.6;
      g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
    }
    g.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  };
  const onMove = (e: PointerEvent) => {
    if (S.rm || e.pointerType === "touch") return;
    if (!pts.length) color = getComputedStyle(document.documentElement).getPropertyValue("--acc").trim() || color;
    pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    if (pts.length > 40) pts.shift();
    if (!raf) raf = requestAnimationFrame(draw);
  };
  resize();
  addEventListener("resize", resize); addEventListener("pointermove", onMove, { passive: true });
  return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", onMove); };
}

/** Falling glyphs over the whole page for a few seconds. */
export function matrix(ms = 5200) {
  const c = document.createElement("canvas"), g = c.getContext("2d");
  if (!g) return;
  c.className = "fx-matrix"; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
  const size = 18, cols = Math.ceil(c.width / size), drops = Array.from({ length: cols }, () => Math.random() * -40);
  const glyphs = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>/{}=+BTT", col = getComputedStyle(document.documentElement).getPropertyValue("--l3").trim() || "#5be49b";
  const t0 = performance.now(); let last = 0;
  g.font = `600 ${size}px ui-monospace, Menlo, Consolas, monospace`;
  const step = (now: number) => {
    if (now - t0 > ms) { c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600 }).onfinish = () => c.remove(); return; }
    requestAnimationFrame(step);
    if (now - last < 45) return; last = now;
    g.globalCompositeOperation = "destination-out"; g.fillStyle = "rgba(0,0,0,.16)"; g.fillRect(0, 0, c.width, c.height);
    g.globalCompositeOperation = "source-over";
    for (let i = 0; i < cols; i++) {
      const y = drops[i] * size;
      g.fillStyle = "#fff"; g.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, y);
      g.fillStyle = col; g.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, y - size);
      drops[i] = y > c.height && Math.random() > 0.965 ? 0 : drops[i] + 1;
    }
  };
  requestAnimationFrame(step);
}

/** Five seconds of everything at once. */
export function party(ms = 5000) {
  const root = document.documentElement;
  root.classList.add("party");
  const id = setInterval(() => confetti(Math.random() * innerWidth, innerHeight * (0.15 + Math.random() * 0.6), 20), 220);
  setTimeout(() => { clearInterval(id); root.classList.remove("party"); }, ms);
}
