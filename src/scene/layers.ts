// The layer stack: five glass slabs, one per stage of the route. Scrolling peels the upper slabs away and
// the camera follows the current one down; at the end of the page the whole stack reassembles.
// Budget rules: render on demand, stop when idle or hidden, clamp the pixel ratio, and step quality down
// (then hand over to the CSS stack) when the measured frame time says the device cannot keep up.
import { S } from "../store";
import { LINKS, TOOLS } from "../data";
import { paintLayer, paintTile, TEX_H, TEX_W, TILE_H, TILE_W } from "./textures";

export interface LayerScene { dispose(): void }

const N = 5, W = 4.2, D = (W * TEX_H) / TEX_W, GAP = 1.15;
const TIERS = [
  { dpr: 2, packets: 56, aa: true },
  { dpr: 1.35, packets: 32, aa: true },
  { dpr: 1, packets: 16, aa: false },
];
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Ease out with a little overshoot, for things that land. */
const backOut = (t: number) => { const c = 1.70158, u = t - 1; return 1 + (c + 1) * u * u * u + c * u * u; };
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export async function createLayerScene(canvas: HTMLCanvasElement, onGiveUp: () => void): Promise<LayerScene> {
  // three is loaded on demand so the page never waits for it, and so a failed load only costs the 3D.
  const THREE = await import("three");
  const root = document.documentElement;
  let tier = (navigator.hardwareConcurrency || 4) >= 8 ? 0 : 1;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: TIERS[tier].aa, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const stack = new THREE.Group();
  scene.add(stack);

  const readHex = () => { const cs = getComputedStyle(root); return [0, 1, 2, 3, 4].map((i) => cs.getPropertyValue(`--l${i}`).trim() || "#ffffff"); };
  const HEX = readHex();
  const COL = HEX.map((h) => new THREE.Color(h));
  let light = root.dataset.theme === "light";

  /* ----- geometry ----- */
  const shape = new THREE.Shape(), r = 0.32, x0 = -W / 2, y0 = -D / 2;
  shape.moveTo(x0 + r, y0); shape.lineTo(x0 + W - r, y0); shape.quadraticCurveTo(x0 + W, y0, x0 + W, y0 + r);
  shape.lineTo(x0 + W, y0 + D - r); shape.quadraticCurveTo(x0 + W, y0 + D, x0 + W - r, y0 + D);
  shape.lineTo(x0 + r, y0 + D); shape.quadraticCurveTo(x0, y0 + D, x0, y0 + D - r); shape.lineTo(x0, y0 + r); shape.quadraticCurveTo(x0, y0, x0 + r, y0);
  const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 8 });
  slabGeo.rotateX(-Math.PI / 2);
  const topGeo = new THREE.ShapeGeometry(shape, 8);
  topGeo.rotateX(-Math.PI / 2);
  { // ShapeGeometry UVs are in shape units; remap them to 0..1 for the texture.
    const uv = topGeo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / W + 0.5, uv.getY(i) / D + 0.5);
  }
  const haloGeo = new THREE.PlaneGeometry(W * 1.9, D * 2.1);
  haloGeo.rotateX(-Math.PI / 2);
  const outline = new THREE.BufferGeometry().setFromPoints(shape.getPoints(12).map((p) => new THREE.Vector3(p.x, 0.1, -p.y)));

  const sprite = (size: number, stops: [number, number][]) => {
    const c = document.createElement("canvas"); c.width = c.height = size;
    const g = c.getContext("2d")!, gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    for (const [o, a] of stops) gr.addColorStop(o, `rgba(255,255,255,${a})`);
    g.fillStyle = gr; g.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(c);
  };
  const haloTex = sprite(128, [[0, 0.55], [0.45, 0.16], [1, 0]]);
  const dotTex = sprite(32, [[0, 1], [0.35, 0.6], [1, 0]]);

  const slabs = HEX.map((hex, i) => {
    const group = new THREE.Group(), baseY = (2 - i) * GAP;
    group.position.y = baseY;
    const cv = document.createElement("canvas"); cv.width = TEX_W; cv.height = TEX_H;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const bodyMat = new THREE.MeshBasicMaterial({ color: COL[i], transparent: true, opacity: 0.28, depthWrite: false });
    const topMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const haloMat = new THREE.MeshBasicMaterial({ map: haloTex, color: COL[i], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const edgeMat = new THREE.LineBasicMaterial({ color: COL[i], transparent: true });
    const body = new THREE.Mesh(slabGeo, bodyMat), top = new THREE.Mesh(topGeo, topMat), halo = new THREE.Mesh(haloGeo, haloMat), edge = new THREE.LineLoop(outline, edgeMat);
    top.position.y = 0.101; halo.position.y = -0.05;
    const ro = (N - i) * 10; halo.renderOrder = ro; body.renderOrder = ro + 1; top.renderOrder = ro + 2; edge.renderOrder = ro + 3;
    group.add(halo, body, top, edge); stack.add(group);
    return { group, halo, bodyMat, topMat, haloMat, edgeMat, cv, tex, baseY, hex, foc: 0 };
  });
  /* Small labelled tiles laid out above a slab and tied to the cards on the left: the kit sits on the
     bottom slab while the tools section is on screen, the contacts sit on the top slab in the overview. */
  const tileGeo = new THREE.PlaneGeometry(0.9, (0.9 * TILE_H) / TILE_W);
  tileGeo.rotateX(-Math.PI / 2);
  const makeTiles = (names: string[], cols: number, gapX: number, order: number) => names.map((name, i) => {
    const cv = document.createElement("canvas"); cv.width = TILE_W; cv.height = TILE_H;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 });
    const mesh = new THREE.Mesh(tileGeo, mat);
    mesh.position.set(((i % cols) - (cols - 1) / 2) * gapX, 0, (Math.floor(i / cols) - 0.5) * 0.66);
    mesh.renderOrder = order + i; mesh.visible = false; stack.add(mesh);
    return { mesh, mat, cv, tex, name, hov: 0 };
  });
  const tiles = makeTiles(TOOLS.map((t) => t[0]), 4, 0.98, 60);
  const cards = makeTiles(["Email", ...LINKS.map((l) => l.name)], 3, 1.2, 80);
  const sets = [
    { list: tiles, dim: 0, slab: N - 1, amount: () => kit, hovered: () => S.tool },
    { list: cards, dim: 0, slab: 0, amount: () => smooth(0.55, 1, fin), hovered: () => S.link },
  ];

  const paintAll = () => {
    slabs.forEach((s, i) => { paintLayer(s.cv.getContext("2d")!, i, s.hex); s.tex.needsUpdate = true; });
    for (const set of sets) set.list.forEach((t, i) => { paintTile(t.cv.getContext("2d")!, t.name, slabs[i % N].hex); t.tex.needsUpdate = true; });
    kick();
  };
  const retheme = () => {
    light = root.dataset.theme === "light";
    const hex = readHex(), blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    slabs.forEach((s, i) => {
      s.hex = hex[i]; COL[i].set(hex[i]);
      s.bodyMat.color.set(hex[i]); s.edgeMat.color.set(hex[i]); s.haloMat.color.set(hex[i]);
      s.haloMat.blending = blend; s.haloMat.needsUpdate = true;
    });
    pointsMat.blending = blend; pointsMat.needsUpdate = true;
    paintAll();
  };

  /* shockwaves: two rings that open out from the slab you have just arrived on */
  const ringGeo = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 72 }, (_, k) => { const a = (k / 72) * Math.PI * 2; return new THREE.Vector3(Math.cos(a), 0, Math.sin(a) * (D / W)); }));
  const rings = [0, 1].map(() => {
    const mat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    const mesh = new THREE.LineLoop(ringGeo, mat); mesh.visible = false; mesh.renderOrder = 90; stack.add(mesh);
    return { mesh, mat, t: 2 };
  });

  /* corner guide posts */
  const postMat = new THREE.LineDashedMaterial({ color: 0x7c8596, dashSize: 0.08, gapSize: 0.1, transparent: true, opacity: 0.35 });
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const px = sx * (W / 2 - 0.25), pz = sz * (D / 2 - 0.25);
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(px, 2 * GAP + 0.1, pz), new THREE.Vector3(px, -2 * GAP, pz)]), postMat);
    l.computeLineDistances(); stack.add(l);
  }

  /* packets falling through the layers, tinted by the one they pass */
  const MAXP = TIERS[0].packets, pPos = new Float32Array(MAXP * 3), pCol = new Float32Array(MAXP * 3);
  const seed = Array.from({ length: MAXP }, () => ({ x: (Math.random() - 0.5) * (W - 0.8), z: (Math.random() - 0.5) * (D - 0.6), speed: 0.35 + Math.random() * 0.5, off: Math.random() }));
  const pGeo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(pPos, 3), colAttr = new THREE.BufferAttribute(pCol, 3);
  pGeo.setAttribute("position", posAttr); pGeo.setAttribute("color", colAttr);
  const pointsMat = new THREE.PointsMaterial({ size: 0.12, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const packets = new THREE.Points(pGeo, pointsMat);
  packets.frustumCulled = false; packets.renderOrder = 100; stack.add(packets);

  /* ----- layout ----- */
  let vw = 1, vh = 1, aspect = 1;
  const resize = () => {
    vw = innerWidth; vh = innerHeight; aspect = vw / vh;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, TIERS[tier].dpr)); renderer.setSize(vw, vh, false);
    camera.aspect = aspect;
    // Keep the stack on the clear side of the viewport: right on wide screens, low on tall ones.
    if (aspect >= 1.05) camera.setViewOffset(vw, vh, -vw * 0.22, 0, vw, vh); else camera.setViewOffset(vw, vh, 0, -vh * 0.28, vw, vh);
    camera.updateProjectionMatrix(); kick();
  };

  /* ----- state ----- */
  let intro = S.rm ? 1 : 0, vel = 0, fovKick = 0, arrived = S.arrive, fov = 32;
  let dive = S.d, fin = S.f, kit = S.k, mx = 0, my = 0, tmx = 0, tmy = 0, lamp = 0, pulse = 0, boost = 0, clock = 0, dim = 0;
  let lastInput = performance.now(), running = false, paused = false, dead = false, raf = 0, last = 0;
  const camOff = new THREE.Vector3(6.2, 5.0, 8.2), look = new THREE.Vector3();

  const update = (dt: number) => {
    const k = S.rm ? 1 : 1 - Math.exp(-dt * 5.5);
    dive += (S.d - dive) * k; if (Math.abs(S.d - dive) < 0.0005) dive = S.d;
    fin += (S.f - fin) * k; if (Math.abs(S.f - fin) < 0.0005) fin = S.f;
    kit += (S.k - kit) * k; if (Math.abs(S.k - kit) < 0.0005) kit = S.k;
    const km = 1 - Math.exp(-dt * 4); mx += (tmx - mx) * km; my += (tmy - my) * km;
    lamp += (S.lamp - lamp) * (1 - Math.exp(-dt * 30));
    pulse *= Math.exp(-dt * 2.6); boost *= Math.exp(-dt * 1.4);
    if (!S.rm) clock += dt * (1 + boost * 5);

    // Opening: the slabs drop in one after another once the page is ready.
    if (S.rm) intro = 1; else if (S.ready && intro < 1) intro = Math.min(1, intro + dt / 1.7);
    // Scroll speed stretches the stack like an accordion and leans it; it relaxes when the page stops.
    vel += (Math.max(-1, Math.min(1, S.vel / 55)) - vel) * (1 - Math.exp(-dt * 8));
    if (S.rm) vel = 0;
    fovKick *= Math.exp(-dt * 3.4);
    if (S.arrive !== arrived) { arrived = S.arrive; if (!S.rm) { rings.forEach((r, j) => { r.t = -j * 0.2; }); fovKick = 1; boost = Math.max(boost, 0.7); } }

    const cur = Math.min(N - 1, Math.max(0, dive)), over = smooth(0, 1, fin), ci = Math.round(cur);
    // In the overview, hovering a layer in the rail picks its slab out of the stack.
    const kf = 1 - Math.exp(-dt * 9), focus = over > 0.5 ? S.focus : -1;
    dim += ((focus >= 0 ? 1 : 0) - dim) * kf;

    slabs.forEach((s, i) => {
      s.foc += ((i === focus ? 1 : 0) - s.foc) * kf;
      const land = backOut(clamp01(intro * 1.7 - i * 0.14)), shown = clamp01(land * 1.4);
      const peel = smooth(0.25, 0.95, dive - i) * (1 - over);
      let near = Math.max(1 - Math.min(1, Math.abs(cur - i)), over * 0.8);
      near = near * (1 - dim * 0.85) + s.foc * 0.9;
      const spread = (1 - smooth(0, 0.6, dive)) * (i - 2) * -0.08 + over * (i - 2) * -0.1;
      s.group.position.y = s.baseY + peel * 3.4 + spread + s.foc * 0.22 + Math.sin(clock * 0.8 + i) * 0.02
        + (1 - land) * (5 - i * 0.5) + (cur - i) * Math.abs(vel) * 0.24;
      s.group.rotation.x = peel * -0.35; s.group.rotation.z = peel * 0.12 + (1 - land) * (0.55 - i * 0.22);
      s.group.rotation.y = (1 - land) * (i % 2 ? -0.5 : 0.5);
      const fade = (1 - peel) * shown, f = 0.55 + Math.min(1, near) * 0.45 - dim * (1 - s.foc) * 0.35;
      const hit = i === ci ? pulse : 0, lit = i === N - 1 ? lamp : 0;
      s.topMat.opacity = fade * f * (i === N - 1 ? 1 - kit * 0.6 : i === 0 ? 1 - smooth(0.55, 1, fin) * 0.6 : 1);
      s.bodyMat.opacity = fade * (light ? 0.6 : 0.28) * f;
      s.edgeMat.opacity = fade * (0.45 + Math.min(1, near) * 0.55) * (1 - dim * (1 - s.foc) * 0.6);
      s.haloMat.opacity = Math.min(1, fade * (0.12 + near * 0.35 + hit * 0.5 + lit * 0.55 + s.foc * 0.35)) * (light ? 0.4 : 1);
      s.halo.scale.setScalar(1 + hit * 0.22 + lit * 0.1 + s.foc * 0.12);
      s.group.visible = fade > 0.01;
    });
    postMat.opacity = 0.35 * Math.max(1 - smooth(3, 4, dive), over) * clamp01(intro * 2 - 1);

    for (const r of rings) {
      if (r.t >= 1) { r.mesh.visible = false; continue; }
      r.t += dt * 1.15;
      const p = clamp01(r.t);
      r.mesh.visible = r.t > 0;
      r.mesh.position.y = slabs[ci].group.position.y + 0.12;
      r.mesh.scale.setScalar(1.6 + p * 4.4);
      r.mat.color.copy(COL[ci]); r.mat.opacity = (1 - p) * (1 - p) * 0.95;
    }

    // Hovering a card on the left lifts its tile on the right.
    for (const set of sets) {
      const amt = set.amount(), hovered = amt > 0.5 ? set.hovered() : -1, baseY = slabs[set.slab].group.position.y;
      set.dim += ((hovered >= 0 ? 1 : 0) - set.dim) * kf;
      set.list.forEach((t, i) => {
        t.hov += ((i === hovered ? 1 : 0) - t.hov) * kf;
        t.mesh.visible = amt > 0.01;
        t.mesh.position.y = baseY + 0.16 + amt * 0.42 + t.hov * 0.34;
        t.mesh.scale.setScalar(0.8 + amt * 0.2 + t.hov * 0.16);
        t.mat.opacity = amt * (0.92 - set.dim * (1 - t.hov) * 0.62);
      });
    }

    const count = TIERS[tier].packets, topY = 2 * GAP, span = 4 * GAP, curY = slabs[Math.floor(cur)].group.position.y;
    for (let i = 0; i < MAXP; i++) {
      const s = seed[i], o = i * 3;
      if (i >= count) { pPos[o + 1] = -999; continue; }
      const f = (s.off + clock * s.speed * 0.25) % 1, y = topY - f * span;
      pPos[o] = s.x; pPos[o + 1] = y; pPos[o + 2] = s.z;
      const c = COL[Math.min(N - 1, Math.round(f * (N - 1)))], vis = over > 0.5 || y < curY + 0.3 ? 1 : 0.15;
      pCol[o] = c.r * vis; pCol[o + 1] = c.g * vis; pCol[o + 2] = c.b * vis;
    }
    posAttr.needsUpdate = true; colAttr.needsUpdate = true;

    const y = (2 - cur) * GAP * (1 - over) + over * 0.25, far = (aspect < 1 ? Math.min(2.1, 1.08 / aspect) : 1) * (1 + over * 0.46);
    look.set(0, y, 0); camera.position.copy(camOff).multiplyScalar(far).add(look); camera.lookAt(look);
    stack.rotation.y = -0.62 + mx * 0.3 + over * Math.sin(clock * 0.25) * 0.25;
    stack.rotation.x = my * 0.09;
    stack.rotation.z = vel * 0.045;
    const wantFov = 32 + fovKick * 2.6 + Math.abs(vel) * 1.6;
    if (Math.abs(wantFov - fov) > 0.01) { fov = wantFov; camera.fov = fov; camera.updateProjectionMatrix(); }
  };

  /* ----- adaptive quality ----- */
  const samples: number[] = []; let warm = 0;
  const giveUp = () => { pause(); onGiveUp(); };
  const assess = (ms: number) => {
    if (++warm < 30) return; samples.push(ms); if (samples.length < 80) return;
    const med = samples.slice().sort((a, b) => a - b)[samples.length >> 1]; samples.length = 0; warm = 0;
    if (med > 22) { if (tier < TIERS.length - 1) { tier++; resize(); } else giveUp(); }
  };
  // Run continuously only while something is actually moving: the hero, the overview, a transition,
  // a recent pointer move, a pulse or the Morse lamp.
  const busy = (now: number) => S.d < 1.1 || S.f > 0.5 || Math.abs(S.d - dive) > 0.001 || Math.abs(S.f - fin) > 0.001 || Math.abs(S.k - kit) > 0.001 || (S.ready && intro < 1) || Math.abs(vel) > 0.004 || fovKick > 0.01 || rings.some((r) => r.t < 1) || now - lastInput < 1200 || pulse > 0.01 || boost > 0.02 || Math.abs(S.lamp - lamp) > 0.01;
  const frame = (now: number) => {
    if (!running) return;
    const ms = Math.min(100, Math.max(0, now - last) || 16.7); last = now;
    update(ms / 1000); renderer.render(scene, camera); assess(ms);
    if (busy(now) && !paused && !document.hidden) raf = requestAnimationFrame(frame); else running = false;
  };
  function kick() { if (running || paused || dead || document.hidden) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function pause() { paused = true; running = false; cancelAnimationFrame(raf); }

  const onMove = (e: PointerEvent) => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; lastInput = performance.now(); kick(); };
  const onVis = () => { if (!document.hidden) kick(); };
  const onLost = (e: Event) => { e.preventDefault(); giveUp(); };
  addEventListener("pointermove", onMove, { passive: true });
  addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", onVis);
  canvas.addEventListener("webglcontextlost", onLost);

  S.kick = () => { lastInput = performance.now(); kick(); };
  S.pulse = () => { pulse = 1; boost = 1; kick(); };
  S.retheme = retheme;

  paintAll(); resize(); update(0); renderer.render(scene, camera); kick();
  document.fonts?.ready.then(() => { if (!dead) paintAll(); });

  return {
    dispose() {
      dead = true; pause();
      removeEventListener("pointermove", onMove); removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis); canvas.removeEventListener("webglcontextlost", onLost);
      S.kick = () => {}; S.pulse = () => {}; S.retheme = () => {};
      renderer.dispose();
    },
  };
}
