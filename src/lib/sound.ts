// UI sound, synthesised with Web Audio: no audio files. Browsers only allow audio after a user gesture,
// so the context is created on the first click or key press.
let ctx: AudioContext | null = null, master: GainNode | null = null, enabled = true;
let tone: { osc: OscillatorNode; gain: GainNode } | null = null;

function ensure() {
  if (!enabled) return null;
  if (!ctx) {
    try { ctx = new AudioContext(); master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination); } catch { return null; }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSound(on: boolean) {
  enabled = on;
  if (!on) { morseTone(false); void ctx?.suspend(); } else if (ctx) void ctx.resume();
}
/** Call from a user gesture. */
export function unlockSound() { ensure(); }

function blip(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0) {
  if (!enabled || !ctx || !master || ctx.state !== "running") return;
  const t = ctx.currentTime, osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master); osc.start(t); osc.stop(t + dur + 0.02);
}

const SCALE = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3]; // C major pentatonic, two octaves

export const sfx = {
  hover: () => blip(1320, 0.045, "sine", 0.018),
  click: () => blip(540, 0.09, "triangle", 0.05, -200),
  /** arriving on a layer: one note per layer, descending as you dive */
  layer: (i: number) => { const f = SCALE[Math.max(0, 4 - i)]; blip(f, 0.26, "sine", 0.06); blip(f * 1.5, 0.3, "sine", 0.025); },
  /** a headline letter being plucked; p is its position along the line, 0..1 */
  letter: (p: number) => blip(330 * Math.pow(2, p * 1.4), 0.11, "triangle", 0.03),
  tool: (i: number) => blip(SCALE[i % SCALE.length] * 2, 0.12, "sine", 0.035),
  toggle: (on: boolean) => blip(on ? 520 : 400, 0.14, "sine", 0.06, on ? 260 : -160),
  pulse: () => blip(150, 0.32, "sine", 0.09, -70),
  open: () => { blip(660, 0.08, "sine", 0.04); setTimeout(() => blip(990, 0.1, "sine", 0.035), 60); },
};

/** The Morse key: a steady tone while the lamp is lit. */
export function morseTone(on: boolean) {
  if (!on) {
    if (tone && ctx) { const t = ctx.currentTime; tone.gain.gain.cancelScheduledValues(t); tone.gain.gain.setTargetAtTime(0.0001, t, 0.008); const o = tone.osc; setTimeout(() => { try { o.stop(); } catch { /* already stopped */ } }, 60); }
    tone = null; return;
  }
  if (tone || !enabled || !ctx || !master || ctx.state !== "running") return;
  const osc = ctx.createOscillator(), gain = ctx.createGain(), t = ctx.currentTime;
  osc.type = "sine"; osc.frequency.value = 640;
  gain.gain.setValueAtTime(0.0001, t); gain.gain.setTargetAtTime(0.07, t, 0.006);
  osc.connect(gain).connect(master); osc.start();
  tone = { osc, gain };
}
