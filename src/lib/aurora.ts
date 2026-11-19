// The aurora lives inside the same WebGL context as the glass stack. A second full-window
// canvas forces the browser to blend two screen-sized layers every frame, which is what
// stutters on a large monitor. The shader itself stays tiny: it paints a small target and
// the scene stretches that picture behind the slabs.
import type { WebGLRenderer } from "three";
import { S } from "../store";
import { Q } from "./quality";

const FRAG = `
uniform vec2 uR; uniform float uT, uLight; uniform vec3 uA, uB, uBg; uniform vec2 uM;
varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1.0,0.0)), f.x), mix(h(i+vec2(0.0,1.0)), h(i+vec2(1.0,1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++) { v += a*n(p); p = p*2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
void main(){
  vec2 uv = vUv;
  vec2 p = uv * vec2(uR.x / uR.y, 1.0) * 1.5;
  float t = uT * 0.05;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
  float f = fbm(p + q*1.9 + vec2(t*0.6, 0.0));
  float band = smoothstep(0.34, 0.8, f);
  float d = distance(uv * vec2(uR.x / uR.y, 1.0), uM * vec2(uR.x / uR.y, 1.0));
  float glow = exp(-d*d*7.0) * 0.5;
  float place = smoothstep(1.15, 0.15, distance(uv, vec2(0.74, 0.5)) * 1.25) * 0.85 + 0.15;
  vec3 col = mix(uA, uB, clamp(q.x * 1.4 - 0.2, 0.0, 1.0));
  float k = band * 0.55 * place + glow * 0.5;
  vec3 c = uLight > 0.5 ? mix(uBg, col, k * 0.34) : uBg + col * k * 0.5;
  float vig = smoothstep(0.18, 1.05, length((uv - vec2(0.7, 0.58)) * vec2(1.05, 0.78)));
  c = mix(c, uBg, vig * 0.62);
  gl_FragColor = vec4(c, 1.0);
}`;
const VERT = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
const BLIT = "uniform sampler2D tMap; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tMap, vUv); }";

export function mountAurora(THREE: typeof import("three"), renderer: WebGLRenderer) {
  const root = document.documentElement;
  const target = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: false, stencilBuffer: false, generateMipmaps: false });
  target.texture.minFilter = THREE.LinearFilter;
  target.texture.magFilter = THREE.LinearFilter;
  target.texture.colorSpace = THREE.NoColorSpace;

  const uniforms = {
    uR: { value: new THREE.Vector2(2, 2) },
    uT: { value: 0 },
    uLight: { value: 0 },
    uA: { value: new THREE.Color() },
    uB: { value: new THREE.Color() },
    uBg: { value: new THREE.Color("#07080b") },
    uM: { value: new THREE.Vector2(0.74, 0.5) },
  };
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false });
  const pass = new THREE.Scene();
  pass.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  cam.position.z = 1;

  const blitMat = new THREE.ShaderMaterial({
    uniforms: { tMap: { value: target.texture } },
    vertexShader: VERT,
    fragmentShader: BLIT,
    depthTest: false,
    depthWrite: false,
  });
  const bg = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blitMat);
  quad.frustumCulled = false;
  bg.add(quad);

  const curA = new THREE.Color(), curB = new THREE.Color(), curBg = new THREE.Color("#07080b");
  const tgtA = new THREE.Color(), tgtB = new THREE.Color(), tgtBg = new THREE.Color("#07080b");
  let light = 0, first = true, dirty = true, mx = 0.74, my = 0.5, t = Math.random() * 100, acc = 1e9, dead = false;

  const paint = (hex: string) => { try { return new THREE.Color(hex.trim() || "#000"); } catch { return new THREE.Color("#000"); } };
  const recolor = () => {
    const cs = getComputedStyle(root), layer = Math.min(4, Math.max(0, +(root.dataset.layer || 0)));
    tgtA.copy(paint(cs.getPropertyValue(`--l${layer}`)));
    tgtB.copy(paint(cs.getPropertyValue(`--l${(layer + 2) % 5}`)));
    tgtBg.copy(paint(cs.getPropertyValue("--bg") || "#07080b"));
    light = root.dataset.theme === "light" ? 1 : 0;
    if (first) { first = false; curA.copy(tgtA); curB.copy(tgtB); curBg.copy(tgtBg); }
    dirty = true;
  };
  const resize = (vw: number, vh: number) => {
    const div = Q[S.quality].auroraDiv;
    let w = Math.max(2, Math.ceil(vw / div)), h = Math.max(2, Math.ceil(vh / div));
    const cap = 420, long = Math.max(w, h);
    if (long > cap) { const s = cap / long; w = Math.max(2, Math.round(w * s)); h = Math.max(2, Math.round(h * s)); }
    if (target.width !== w || target.height !== h) target.setSize(w, h);
    uniforms.uR.value.set(w, h);
    dirty = true;
  };
  const changed = (a: import("three").Color, b: import("three").Color) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) > 0.006;
  const step = (dt: number, px: number, py: number) => {
    if (dead) return;
    if (S.rm) { mx = px; my = py; } else { t += dt; mx += (px - mx) * 0.12; my += (py - my) * 0.12; }
    const k = S.rm ? 1 : 0.07;
    let moving = false;
    for (const [cur, tgt] of [[curA, tgtA], [curB, tgtB], [curBg, tgtBg]] as const) {
      if (changed(cur, tgt)) { cur.lerp(tgt, k); moving = true; } else cur.copy(tgt);
    }
    acc += dt * 1000;
    if (!dirty && !moving && (S.rm || acc < Q[S.quality].auroraMs)) return;
    acc = 0; dirty = false;
    uniforms.uT.value = t; uniforms.uLight.value = light; uniforms.uM.value.set(mx, my);
    uniforms.uA.value.copy(curA); uniforms.uB.value.copy(curB); uniforms.uBg.value.copy(curBg);
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(target); renderer.clear(); renderer.render(pass, cam); renderer.setRenderTarget(prev);
  };
  const blit = () => { if (!dead) renderer.render(bg, cam); };

  const wake = () => resize(innerWidth, innerHeight);
  recolor();
  S.recolor = recolor;
  S.reaurora = wake;
  return {
    resize, step, blit, recolor,
    dispose() {
      dead = true;
      if (S.recolor === recolor) S.recolor = () => {};
      if (S.reaurora === wake) S.reaurora = () => {};
      target.dispose(); mat.dispose(); blitMat.dispose();
    },
  };
}
