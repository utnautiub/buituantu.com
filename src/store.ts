// State shared between the page and the 3D scene. It is a plain object on purpose: the scene reads it
// every frame, and nothing here should cause a React render.
const mq = (q: string) => typeof matchMedia === "function" && matchMedia(q).matches;

export const RM = mq("(prefers-reduced-motion: reduce)");
export const FINE = mq("(pointer: fine)");

export const S = {
  /** fractional layer the page is on, 0..4 */
  d: 0,
  /** 0..1, how far into the closing overview (the whole stack back on screen) */
  f: 0,
  /** 1 while the Morse lamp is lit */
  lamp: 0,
  /** layer hovered in the rail during the overview, or -1 */
  focus: -1,
  /** 0..1, how far into the tools section (the kit laid out on the bottom slab) */
  k: 0,
  /** tool card being hovered, or -1 */
  tool: -1,
  /** contact card being hovered (0 is email, then LINKS in order), or -1 */
  link: -1,
  /** true when motion is off, by system setting or by the visitor's own switch */
  rm: RM,
  /** wake the scene up; replaced by the scene once it exists */
  kick: () => {},
  /** flash the current slab */
  pulse: () => {},
  /** re-read the colours after a theme change */
  retheme: () => {},
  /** tell the aurora that the layer or theme changed */
  recolor: () => {},
  /** true once the opening sequence has finished */
  ready: false,
  /** scroll speed in pixels per frame; 0 when the page is still */
  vel: 0,
  /** counts arrivals on a layer; the scene answers each one with a shockwave */
  arrive: 0,
};

export const LAYERS = [0, 1, 2, 3, 4] as const;
