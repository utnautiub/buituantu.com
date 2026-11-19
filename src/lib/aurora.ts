// A slow aurora behind everything, drawn by one small fragment shader. Resolution and frame rate
// follow the image-quality setting: low stays soft and cheap, ultra draws near the full screen.
// Its colours follow the current layer and it brightens around the pointer.
import { S } from "../store";
import { Q } from "./quality";

const FRAG = `
precision mediump float;
uniform vec2 uR; uniform float uT, uLight; uniform vec3 uA, uB, uBg; uniform vec2 uM;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1.0,0.0)), f.x), mix(h(i+vec2(0.0,1.0)), h(i+vec2(1.0,1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++) { v += a*n(p); p = p*2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
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
  // Attributes stay fixed so a quality change can keep this context and only resize it.
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, powerPreference: "low-power" });
  if (!gl) return () => {};
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const buf = gl.createBuffer();
  let prog: WebGLProgram | null = null, octaves = 0;
  let uR: WebGLUniformLocation | null = null, uT: WebGLUniformLocation | null = null, uA: WebGLUniformLocation | null = null, uB: WebGLUniformLocation | null = null, uBg: WebGLUniformLocation | null = null, uM: WebGLUniformLocation | null = null, uLight: WebGLUniformLocation | null = null;
  const bind = () => {
    if (!prog) return;
    gl.useProgram(prog); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  };
  const build = () => {
    const next = Q[S.quality].octaves;
    if (prog && octaves === next) return;
    octaves = next;
    if (prog) gl.deleteProgram(prog);
    const frag = FRAG
      .replace("precision mediump float;", next >= 4 ? "precision highp float;" : "precision mediump float;")
      .replace("for (int i = 0; i < 3; i++)", `for (int i = 0; i < ${next}; i++)`);
    prog = gl.createProgram()!;
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, frag);
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn("aurora shader failed", gl.getProgramInfoLog(prog)); prog = null; return; }
    const U = (n: string) => gl.getUniformLocation(prog!, n);
    uR = U("uR"); uT = U("uT"); uA = U("uA"); uB = U("uB"); uBg = U("uBg"); uM = U("uM"); uLight = U("uLight");
    bind();
  };

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
  const resize = () => {
    const div = Q[S.quality].auroraDiv;
    const w = Math.max(2, Math.ceil(innerWidth / div)), h = Math.max(2, Math.ceil(innerHeight / div));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, canvas.width, canvas.height); bind(); dirty = true;
  };
  const apply = () => { build(); resize(); };
  const onMove = (e: PointerEvent) => { tmx = e.clientX / innerWidth; tmy = 1 - e.clientY / innerHeight; };

  const frame = (now: number) => {
    if (dead) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden || now - last < Q[S.quality].auroraMs) return;
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
    if (!prog) return;
    gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT, t); gl.uniform1f(uLight, light);
    gl.uniform3fv(uA, cur.a); gl.uniform3fv(uB, cur.b); gl.uniform3fv(uBg, cur.bg); gl.uniform2f(uM, mx, my);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  apply(); recolor();
  addEventListener("resize", resize); addEventListener("pointermove", onMove, { passive: true });
  S.recolor = recolor; S.reaurora = apply;
  root.dataset.aurora = "on";
  raf = requestAnimationFrame(frame);
  return () => { dead = true; cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("pointermove", onMove); S.recolor = () => {}; S.reaurora = () => {}; if (prog) gl.deleteProgram(prog); delete root.dataset.aurora; };
}
