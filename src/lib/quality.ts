// Four image-quality levels the visitor can pick. The scene, the aurora and the settings
// all read this table, so a level changes the picture rather than only the label.
export type Quality = "low" | "mid" | "high" | "ultra";
export const QUALITIES: Quality[] = ["low", "mid", "high", "ultra"];

export function isQuality(v: unknown): v is Quality {
  return v === "low" || v === "mid" || v === "high" || v === "ultra";
}

export function nextQuality(q: Quality): Quality {
  return QUALITIES[(QUALITIES.indexOf(q) + 1) % QUALITIES.length];
}

export interface QProfile {
  /** drawing-buffer cap on a small window */
  dprCap: number;
  /** raise sparse screens up to this, so the steps stay visible on a 1x display */
  dprFloor: number;
  /** longest side of the 3D buffer. A big window scales this up instead of painting more pixels. */
  maxSide: number;
  /** full-window framebuffer budget, in pixels */
  px: number;
  aa: boolean;
  packets: number;
  aniso: number;
  /** aurora canvas is the viewport divided by this */
  auroraDiv: number;
  /** minimum milliseconds between aurora frames */
  auroraMs: number;
  /** minimum milliseconds between 3D frames; 0 draws every frame */
  frameMs: number;
  curve: number;
  bevel: number;
  outline: number;
  ring: number;
  halo: number;
  dot: number;
  /** slab textures are painted at this multiple of their coordinate space */
  tex: number;
  /** aurora noise octaves */
  octaves: number;
}

// Antialiasing stays off at every level. On a full-window transparent canvas it multiplies the
// pixels the GPU has to fill, and the slabs are large enough that the extra samples barely show.
// Sharpness comes from the pixel ratio, the textures and the geometry instead.
export const Q: Record<Quality, QProfile> = {
  low:   { dprCap: 1,    dprFloor: 1,    maxSide: 960,  px: 800_000,   aa: false, packets: 16, aniso: 1,  auroraDiv: 6, auroraMs: 50, frameMs: 0, curve: 6,  bevel: 1, outline: 8,  ring: 48,  halo: 48,  dot: 16, tex: 1,    octaves: 3 },
  mid:   { dprCap: 1.25, dprFloor: 1.15, maxSide: 1200, px: 1_100_000, aa: false, packets: 28, aniso: 4,  auroraDiv: 5, auroraMs: 40, frameMs: 0, curve: 8,  bevel: 1, outline: 12, ring: 64,  halo: 64,  dot: 24, tex: 1,    octaves: 3 },
  high:  { dprCap: 1.5,  dprFloor: 1.35, maxSide: 1440, px: 1_400_000, aa: false, packets: 40, aniso: 8,  auroraDiv: 4, auroraMs: 33, frameMs: 0, curve: 12, bevel: 2, outline: 16, ring: 80,  halo: 96,  dot: 32, tex: 1.25, octaves: 3 },
  ultra: { dprCap: 2,    dprFloor: 1.75, maxSide: 1680, px: 1_700_000, aa: false, packets: 56, aniso: 16, auroraDiv: 3, auroraMs: 33, frameMs: 0, curve: 16, bevel: 2, outline: 24, ring: 96,  halo: 128, dot: 48, tex: 1.5,  octaves: 3 },
};

/** Pixel ratio for the current level. A large window keeps the same pixel count as a small one and is scaled up on screen. */
export function drawingRatio(q: Quality) {
  const p = Q[q];
  const dpr = typeof devicePixelRatio === "number" ? devicePixelRatio : 1;
  const vw = typeof innerWidth === "number" ? innerWidth : 1;
  const vh = typeof innerHeight === "number" ? innerHeight : 1;
  let ratio = Math.min(p.dprCap, Math.max(dpr, p.dprFloor));
  const long = Math.max(vw, vh);
  if (long > 0 && long * ratio > p.maxSide) ratio = p.maxSide / long;
  const area = vw * vh * ratio * ratio;
  if (area > p.px) ratio *= Math.sqrt(p.px / area);
  return Math.max(0.35, Math.round(ratio * 100) / 100);
}
