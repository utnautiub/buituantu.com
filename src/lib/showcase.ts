// The showcase: one scripted run through the best of the page, top to bottom, then through explore mode.
// Any wheel, touch, click or key from the visitor stops it and hands the page back.
import { S } from "../store";
import { confetti } from "./fx";

export interface ShowcaseApi {
  replayOpening: () => void;
  setExplore: (on: boolean) => void;
  setFocus: (i: number) => void;
  status: (label: string | null, progress: number) => void;
  L: (en: string, vi: string) => string;
}

class Stop extends Error {}
let current: AbortController | null = null;

export const showcaseRunning = () => current !== null;
export function stopShowcase() { current?.abort(); }

export async function runShowcase(api: ShowcaseApi) {
  stopShowcase();
  const ctl = new AbortController(), sig = ctl.signal;
  current = ctl; S.demo = true;
  const root = document.documentElement;
  const check = () => { if (sig.aborted) throw new Stop(); };
  const wait = (ms: number) => new Promise<void>((res, rej) => {
    const id = setTimeout(res, ms);
    sig.addEventListener("abort", () => { clearTimeout(id); rej(new Stop()); }, { once: true });
  });
  const y = (id: string, at = 0.5) => { const el = document.getElementById(id)!; const r = el.getBoundingClientRect(); return scrollY + r.top + r.height / 2 - innerHeight * at; };
  /** Scroll with an ease, frame by frame (instant steps, so CSS smooth scrolling does not fight it). */
  const glide = (to: number, ms: number) => new Promise<void>((res, rej) => {
    const from = scrollY, max = root.scrollHeight - innerHeight, end = Math.max(0, Math.min(max, to)), t0 = performance.now();
    const step = (now: number) => {
      if (sig.aborted) { rej(new Stop()); return; }
      const p = Math.min(1, (now - t0) / ms), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      scrollTo({ top: from + (end - from) * e, behavior: "instant" as ScrollBehavior });
      if (p < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
  /** Show a card as if it were hovered, for a moment. */
  const touch = async (el: Element | null, ms: number) => { if (!el) return; el.setAttribute("data-demo", ""); try { await wait(ms); } finally { el.removeAttribute("data-demo"); } };
  const STEPS = 11; let n = 0;
  const say = (en: string, vi: string) => { check(); api.status(api.L(en, vi), n++ / STEPS); };

  // the visitor takes over
  const take = (e: Event) => {
    if (!e.isTrusted) return; // the script's own synthetic events
    if (e instanceof KeyboardEvent && !["Escape", " ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) return;
    if ((e.target as Element)?.closest?.(".demo")) return;
    ctl.abort();
  };
  const opts = { capture: true, passive: true } as const;
  addEventListener("wheel", take, opts); addEventListener("touchstart", take, opts); addEventListener("pointerdown", take, opts); addEventListener("keydown", take, opts);

  try {
    say("Opening", "Mở màn");
    await glide(0, 900);
    api.replayOpening(); await wait(3200);

    say("Headline", "Tiêu đề");
    const h1 = document.querySelector("#top h1");
    if (h1) {
      const r = h1.getBoundingClientRect();
      h1.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.left + r.width * 0.42, clientY: r.top + r.height * 0.5 }));
    }
    await wait(1600);

    say("L1 · University", "L1 · Đại học"); await glide(y("l1"), 1700); await wait(1900);
    say("L2 · 2NF Software", "L2 · 2NF Software"); await glide(y("l2"), 1500); await wait(900);
    dispatchEvent(new CustomEvent("btt:tab", { detail: "be" })); await wait(1500);
    dispatchEvent(new CustomEvent("btt:tab", { detail: "fe" })); await wait(900);
    say("L3 · Military service", "L3 · Nghĩa vụ quân sự"); await glide(y("l3"), 1500); await wait(1700);

    say("L4 · Telecom", "L4 · Thông tin"); await glide(y("l4"), 1500); await wait(500);
    dispatchEvent(new CustomEvent("btt:morse", { detail: "BTT" })); await wait(4200);

    say("Tools", "Công cụ"); await glide(y("stack", 0.45), 1600); await wait(700);
    const tools = Array.from(document.querySelectorAll(".tool"));
    for (let i = 0; i < tools.length; i++) { S.tool = i; S.kick(); await touch(tools[i], 420); }
    S.tool = -1; S.kick();

    say("Reassembly", "Ráp lại chồng tầng"); await glide(y("contact", 0.42), 1900); await wait(1200);
    for (let i = 0; i < 5; i++) { api.setFocus(i); await wait(650); }
    api.setFocus(-1);
    const links = Array.from(document.querySelectorAll(".lk"));
    for (let i = 0; i < links.length; i++) { S.link = i; S.kick(); await touch(links[i], 380); }
    S.link = -1; S.kick();

    say("Sign-off", "Lời chào");
    await glide(root.scrollHeight, 1800); await wait(2600);
    const nm = document.querySelector(".bigmarq .nm");
    if (nm) { const r = nm.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, 46); }
    await wait(1400);

    if (root.dataset.gl === "on") {
      say("Explore", "Khám phá 3D");
      api.setExplore(true); await wait(2600);
      S.spread = 1; S.kick(); dispatchEvent(new CustomEvent("btt:x", { detail: { spread: 1 } })); await wait(2400);
      for (let i = 0; i < 5; i++) {
        S.pick = i; S.kick(); dispatchEvent(new CustomEvent("btt:x", { detail: { pick: i } }));
        await wait(i === 4 ? 1200 : 2100);
        if (i === 4) { dispatchEvent(new CustomEvent("btt:morse", { detail: "OK" })); await wait(2200); }
      }
      S.pick = -1; S.spread = 0; S.kick(); dispatchEvent(new CustomEvent("btt:x", { detail: { pick: -1, spread: 0 } }));
      await wait(2600);
      api.setExplore(false); await wait(800);
    }

    say("Back to the surface", "Trở lại bề mặt");
    await glide(0, 2400);
    confetti(innerWidth / 2, innerHeight * 0.35, 60);
    api.status(api.L("Over.", "Hết."), 1); await wait(1600);
  } catch (e) {
    if (!(e instanceof Stop)) console.warn(e);
  } finally {
    removeEventListener("wheel", take, opts); removeEventListener("touchstart", take, opts); removeEventListener("pointerdown", take, opts); removeEventListener("keydown", take, opts);
    document.querySelectorAll("[data-demo]").forEach((el) => el.removeAttribute("data-demo"));
    S.tool = -1; S.link = -1; S.pick = -1; S.spread = 0; S.demo = false; S.kick();
    api.setFocus(-1);
    if (S.explore) api.setExplore(false);
    api.status(null, 0);
    if (current === ctl) current = null;
  }
}
