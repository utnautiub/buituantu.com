// A slow aurora behind everything, drawn by one small fragment shader. It is rendered at a third of the
// screen resolution and about 30 frames a second, so it costs very little; the blur from upscaling is
// the look. Its colours follow the current layer and it brightens around the pointer.
import { S } from "../store";

const FRAG = `
precision mediump float;
uniform vec2 uR; uniform float uT, uLight; uniform vec3 uA, uB, uBg; uniform vec2 uM;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1.0,0.0)), f.x), mix(h(i+vec2(0.0,1.0)), h(i+vec2(1.0,1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a*n(p); p = p*2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / uR;
  vec2 p = uv * vec2(uR.x / uR.y, 1.0) * 1.5;
  float t = uT * 0.05;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  float f = fbm(p + q*1.9 + vec2(t*0.6, 0.0));
  float band = smoothstep(0.34, 0.8, f);
  float d = distance(uv * vec2(uR.x / uR.y, 1.0), uM * vec2(uR.x / uR.y, 1.0));
  float glow = exp(-d*d*7.0) * 0.5;
  // strongest on the right, where the stack lives, so text on the left stays easy to read
  float place = smoothstep(1.15, 0.15, distance(uv, vec2(0.74, 0.5)) * 1.25) * 0.85 + 0.15;
  vec3 col = mix(uA, uB, clamp(q.x * 1.4 - 0.2, 0.0, 1.0));
  float k = band * 0.55 * place + glow * 0.5;
  vec3 c = uLight > 0.5 ? mix(uBg, col, k * 0.34) : uBg + col * k * 0.5;
  gl_FragColor = vec4(c, 1.0);
}`;
const VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

const rgb = (hex: string): [number, number, number] => { const n = parseInt(hex.trim().slice(1), 16) || 0; return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };

export function initAurora(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
  if (!gl) return () => {};
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn("aurora shader failed", gl.getProgramInfoLog(prog)); return () => {}; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uR = U("uR"), uT = U("uT"), uA = U("uA"), uB = U("uB"), uBg = U("uBg"), uM = U("uM"), uLight = U("uLight");

  const root = document.documentElement;
  const cur = { a: [0, 0, 0], b: [0, 0, 0], bg: [0, 0, 0] }, tgt = { a: [0, 0, 0], b: [0, 0, 0], bg: [0, 0, 0] };
  let light = 0, first = true, dirty = true, mx = 0.74, my = 0.5, tmx = 0.74, tmy = 0.5, t = Math.random() * 100, last = 0, raf = 0, dead = false;

  const recolor = () => {
    const cs = getComputedStyle(root), layer = Math.min(4, Math.max(0, +(root.dataset.layer || 0)));
    tgt.a = rgb(cs.getPropertyValue(`--l${layer}`)); tgt.b = rgb(cs.getPropertyValue(`--l${(layer + 2) % 5}`)); tgt.bg = rgb(cs.getPropertyValue("--bg"));
    light = root.dataset.theme === "light" ? 1 : 0;
    if (first) { first = false; cur.a = [...tgt.a]; cur.b = [...tgt.b]; cur.bg = [...tgt.bg]; }
    dirty = true;
  };
  const resize = () => { canvas.width = Math.max(2, Math.ceil(innerWidth / 3)); canvas.height = Math.max(2, Math.ceil(innerHeight / 3)); gl.viewport(0, 0, canvas.width, canvas.height); dirty = true; };
  const onMove = (e: PointerEvent) => { tmx = e.clientX / innerWidth; tmy = 1 - e.clientY / innerHeight; };

  const frame = (now: number) => {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden || now - last < 32) return;
    // With motion off the picture is frozen: redraw only when colours or size changed.
    if (S.rm && !dirty) return;
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!S.rm) { t += dt; mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08; }
    let moving = false;
    for (const key of ["a", "b", "bg"] as const) for (let i = 0; i < 3; i++) {
      const d = tgt[key][i] - cur[key][i];
      if (Math.abs(d) > 0.002) { cur[key][i] += d * (S.rm ? 1 : 0.07); moving = true; } else cur[key][i] = tgt[key][i];
    }
    dirty = moving;
    gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT, t); gl.uniform1f(uLight, light);
    gl.uniform3fv(uA, cur.a); gl.uniform3fv(uB, cur.b); gl.uniform3fv(uBg, cur.bg); gl.uniform2f(uM, mx, my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  recolor(); resize();
  addEventListener("resize", resize); addEventListener("pointermove", onMove, { passive: true });
  S.recolor = recolor;
  root.dataset.aurora = "on";
  raf = requestAnimationFrame(frame);
  return () => { dead = true; cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", onMove); S.recolor = () => {}; delete root.dataset.aurora; };
}
