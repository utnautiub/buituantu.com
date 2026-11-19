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
  /** drawing-buffer cap */
  dprCap: number;
  /** raise sparse screens up to this, so the steps stay visible on a 1x display */
  dprFloor: number;
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

export const Q: Record<Quality, QProfile> = {
  low:   { dprCap: 1,   dprFloor: 1,   aa: false, packets: 12, aniso: 1,  auroraDiv: 5, auroraMs: 70, frameMs: 40, curve: 6,  bevel: 1, outline: 8,  ring: 48,  halo: 64,  dot: 16, tex: 0.75, octaves: 3 },
  mid:   { dprCap: 1.5, dprFloor: 1.25, aa: false, packets: 28, aniso: 4,  auroraDiv: 3, auroraMs: 48, frameMs: 32, curve: 10, bevel: 2, outline: 16, ring: 72,  halo: 128, dot: 32, tex: 1,    octaves: 3 },
  high:  { dprCap: 2,   dprFloor: 1.5, aa: true,  packets: 48, aniso: 8,  auroraDiv: 2, auroraMs: 28, frameMs: 16, curve: 16, bevel: 3, outline: 28, ring: 112, halo: 192, dot: 48, tex: 1.5,  octaves: 4 },
  ultra: { dprCap: 3,   dprFloor: 2,   aa: true,  packets: 72, aniso: 16, auroraDiv: 1, auroraMs: 16, frameMs: 0,  curve: 24, bevel: 4, outline: 48, ring: 160, halo: 256, dot: 64, tex: 2,    octaves: 5 },
};

/** Pixel ratio for the current level. Ultra always draws at its cap, so it stays sharper than High even on a dense screen. */
export function drawingRatio(q: Quality) {
  const p = Q[q];
  if (q === "ultra") return p.dprCap;
  const dpr = typeof devicePixelRatio === "number" ? devicePixelRatio : 1;
  return Math.min(p.dprCap, Math.max(dpr, p.dprFloor));
}
