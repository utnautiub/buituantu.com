// Surface art for each slab, painted into a 2D canvas in code. Every slab shows what that stage was
// about: a web page, an entity diagram, two panes of code, a contour map, radio waves and Morse.
export const TEX_W = 768;
export const TEX_H = 512;
export const TILE_W = 288;
export const TILE_H = 168;

const NAMES = ["SURFACE", "THUY LOI UNIVERSITY", "2NF SOFTWARE", "MILITARY SERVICE", "SIGNAL OFFICER SCHOOL"];
const MONO = "'Geist Mono', ui-monospace, Menlo, Consolas, monospace";

const rgba = (hex: string, a: number) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h);
}

export function paintLayer(g: CanvasRenderingContext2D, i: number, c: string) {
  const a = (v: number) => rgba(c, v), TW = TEX_W, TH = TEX_H;
  g.clearRect(0, 0, TW, TH);
  const fill = g.createLinearGradient(0, 0, TW, TH); fill.addColorStop(0, a(0.22)); fill.addColorStop(1, a(0.05));
  rr(g, 4, 4, TW - 8, TH - 8, 44); g.fillStyle = fill; g.fill(); g.lineWidth = 4; g.strokeStyle = a(0.95); g.stroke();
  g.font = `600 22px ${MONO}`; g.fillStyle = c; g.fillText(`L${i}`, 40, TH - 36);
  g.font = `500 17px ${MONO}`; g.fillStyle = a(0.75); g.fillText(NAMES[i], 92, TH - 37);
  g.lineCap = "round"; g.lineJoin = "round";
  [page, diagram, code, contours, signal][i](g, a);
}

/** A small labelled tile for one tool or one contact. */
export function paintTile(g: CanvasRenderingContext2D, name: string, c: string) {
  g.clearRect(0, 0, TILE_W, TILE_H);
  rr(g, 5, 5, TILE_W - 10, TILE_H - 10, 30); g.fillStyle = rgba(c, 0.2); g.fill(); g.lineWidth = 5; g.strokeStyle = rgba(c, 0.95); g.stroke();
  g.beginPath(); g.arc(34, 36, 7, 0, 7); g.fillStyle = c; g.fill();
  g.font = `600 ${name.length > 8 ? 34 : 42}px ${MONO}`; g.fillStyle = c; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(name, TILE_W / 2, TILE_H / 2 + 8); g.textAlign = "start"; g.textBaseline = "alphabetic";
}

type A = (v: number) => string;

function page(g: CanvasRenderingContext2D, a: A) {
  rr(g, 40, 38, TEX_W - 80, 54, 14); g.fillStyle = a(0.2); g.fill();
  g.beginPath(); g.arc(72, 65, 13, 0, 7); g.fillStyle = a(0.85); g.fill();
  for (let k = 0; k < 4; k++) { rr(g, 420 + k * 74, 57, 54, 16, 8); g.fillStyle = a(0.45); g.fill(); }
  rr(g, 40, 122, 380, 34, 10); g.fillStyle = a(0.8); g.fill();
  rr(g, 40, 168, 290, 34, 10); g.fill();
  g.fillStyle = a(0.4); rr(g, 40, 226, 340, 12, 6); g.fill(); rr(g, 40, 248, 300, 12, 6); g.fill(); rr(g, 40, 270, 200, 12, 6); g.fill();
  rr(g, 40, 308, 130, 46, 12); g.fillStyle = a(0.9); g.fill();
  rr(g, 184, 308, 150, 46, 12); g.strokeStyle = a(0.6); g.lineWidth = 3; g.stroke();
  for (let k = 0; k < 2; k++) {
    const x = 466 + k * 134;
    rr(g, x, 122, 120, 250, 16); g.fillStyle = a(0.1); g.fill(); g.strokeStyle = a(0.45); g.lineWidth = 2.5; g.stroke();
    rr(g, x + 14, 136, 92, 110, 10); g.fillStyle = a(0.28); g.fill();
    rr(g, x + 14, 262, 80, 12, 6); g.fillStyle = a(0.6); g.fill();
    rr(g, x + 14, 284, 56, 10, 5); g.fillStyle = a(0.35); g.fill();
  }
}

function diagram(g: CanvasRenderingContext2D, a: A) {
  const tables: [number, number, string, number][] = [[60, 50, "STUDENT", 3], [470, 44, "COURSE", 3], [270, 206, "ENROLMENT", 4], [520, 268, "GRADE", 3]];
  g.strokeStyle = a(0.6); g.lineWidth = 3; g.setLineDash([8, 8]); g.beginPath();
  g.moveTo(170, 172); g.lineTo(170, 268); g.lineTo(270, 268);
  g.moveTo(580, 166); g.lineTo(580, 220); g.lineTo(490, 220); g.lineTo(490, 240);
  g.moveTo(490, 300); g.lineTo(520, 300); g.stroke(); g.setLineDash([]);
  for (const [x, y, name, rows] of tables) {
    const w = 220, h = 44 + rows * 26;
    rr(g, x, y, w, h, 14); g.fillStyle = a(0.12); g.fill(); g.strokeStyle = a(0.75); g.lineWidth = 3; g.stroke();
    rr(g, x, y, w, 36, 14); g.fillStyle = a(0.35); g.fill();
    g.font = `600 16px ${MONO}`; g.fillStyle = a(1); g.fillText(name, x + 14, y + 24);
    for (let r = 0; r < rows; r++) {
      g.beginPath(); g.arc(x + 20, y + 58 + r * 26, 4, 0, 7); g.fillStyle = a(r ? 0.45 : 0.95); g.fill();
      rr(g, x + 34, y + 53 + r * 26, 90 + ((r * 37) % 70), 10, 5); g.fillStyle = a(0.45); g.fill();
    }
  }
}

function code(g: CanvasRenderingContext2D, a: A) {
  const half = TEX_W / 2;
  g.strokeStyle = a(0.4); g.lineWidth = 2.5; g.beginPath(); g.moveTo(half, 40); g.lineTo(half, TEX_H - 80); g.stroke();
  const fe = ["<template>", "  <a-table", '    :columns="cols"', '    :data-source="rows" />', "</template>", "", "const { data: rows } =", "  await useFetch(api)"];
  const be = ["class Api::V1::Orders", "  def index", "    orders = Order.page(p)", "    render json: orders", "  end", "", "  def create", "    Sms.deliver(order)", "  end"];
  g.font = `600 14px ${MONO}`; g.fillStyle = a(0.7); g.fillText("frontend.vue", 44, 60); g.fillText("orders_controller.rb", half + 28, 60);
  g.font = `500 17px ${MONO}`;
  fe.forEach((l, k) => { g.fillStyle = a(k % 3 === 0 ? 1 : 0.62); g.fillText(l, 44, 100 + k * 34); });
  be.forEach((l, k) => { g.fillStyle = a(k % 3 === 1 ? 1 : 0.62); g.fillText(l, half + 28, 100 + k * 34); });
}

function contours(g: CanvasRenderingContext2D, a: A) {
  g.strokeStyle = a(0.16); g.lineWidth = 1.5;
  for (let x = 60; x < TEX_W; x += 60) { g.beginPath(); g.moveTo(x, 30); g.lineTo(x, TEX_H - 80); g.stroke(); }
  for (let y = 60; y < TEX_H - 80; y += 60) { g.beginPath(); g.moveTo(30, y); g.lineTo(TEX_W - 30, y); g.stroke(); }
  const ring = (cx: number, cy: number, r: number, sq: number, ph: number) => {
    g.beginPath();
    for (let k = 0; k <= 72; k++) {
      const t = (k / 72) * Math.PI * 2, rad = r * (1 + 0.16 * Math.sin(t * 3 + ph) + 0.08 * Math.sin(t * 5 + ph * 2));
      const x = cx + Math.cos(t) * rad * 1.5, y = cy + Math.sin(t) * rad * sq;
      if (k) g.lineTo(x, y); else g.moveTo(x, y);
    }
    g.closePath(); g.stroke();
  };
  for (let k = 0; k < 7; k++) { g.strokeStyle = a(0.9 - k * 0.1); g.lineWidth = k % 3 === 0 ? 3.5 : 2; ring(300, 210, 20 + k * 22, 0.82, k * 0.35); }
  for (let k = 0; k < 4; k++) { g.strokeStyle = a(0.75 - k * 0.14); g.lineWidth = 2; ring(590, 300, 14 + k * 18, 0.9, 2 + k * 0.5); }
  g.strokeStyle = a(1); g.lineWidth = 3; g.beginPath(); g.moveTo(300, 188); g.lineTo(300, 232); g.moveTo(278, 210); g.lineTo(322, 210); g.stroke();
  g.beginPath(); g.arc(300, 210, 34, 0, 7); g.stroke();
  g.font = `600 15px ${MONO}`; g.fillStyle = a(0.9); g.fillText("N", 688, 70);
  g.beginPath(); g.moveTo(694, 84); g.lineTo(694, 130); g.moveTo(684, 98); g.lineTo(694, 84); g.lineTo(704, 98); g.stroke();
}

function signal(g: CanvasRenderingContext2D, a: A) {
  for (let k = 1; k <= 6; k++) { g.strokeStyle = a(1 - k * 0.13); g.lineWidth = 3.5; g.beginPath(); g.arc(110, 330, k * 44, -1.25, -0.12); g.stroke(); }
  g.strokeStyle = a(1); g.lineWidth = 4; g.beginPath(); g.moveTo(110, 330); g.lineTo(110, 250); g.moveTo(86, 330); g.lineTo(110, 282); g.lineTo(134, 330); g.stroke();
  g.beginPath(); g.arc(110, 246, 7, 0, 7); g.fillStyle = a(1); g.fill();
  const x1 = TEX_W - 44, wave = (alpha: number, fn: (u: number) => number) => {
    g.strokeStyle = a(alpha); g.lineWidth = 3; g.beginPath();
    for (let x = 400; x <= x1; x += 4) { const y = 120 + fn((x - 400) / (x1 - 400)); if (x === 400) g.moveTo(x, y); else g.lineTo(x, y); }
    g.stroke();
  };
  wave(0.85, (u) => Math.sin(u * 22) * 34 * Math.sin(u * Math.PI));
  wave(0.45, (u) => Math.sin(u * 9 + 1) * 46);
  let x = 400;
  for (const s of "-... - -") { if (s === " ") { x += 26; continue; } const w = s === "-" ? 46 : 14; rr(g, x, 236, w, 14, 7); g.fillStyle = a(0.95); g.fill(); x += w + 12; }
  for (let k = 0; k < 9; k++) { rr(g, 400 + k * 36, 290, 22, 60 - ((k * 23) % 44), 5); g.fillStyle = a(0.3 + (k % 3) * 0.2); g.fill(); }
}
