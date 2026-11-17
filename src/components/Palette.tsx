// The command palette (⌘K / Ctrl K). The listed commands are searchable; anything else that is typed is
// run as a terminal command and answered in the output pane.
import { memo, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { LINKS, MAIL_B64, TOOLS } from "../data";
import { useLang } from "../i18n";
import { usePrefs } from "../prefs";
import { S } from "../store";
import { confetti, matrix, party } from "../lib/fx";
import { sfx } from "../lib/sound";

interface Cmd { label: string; hint: string; group: "go" | "set" | "links" | "fun"; run: () => void; keep?: boolean }

export const Palette = memo(function Palette({ open, onClose, notify, onExplore, onShowcase }: { open: boolean; onClose: () => void; notify: (m: string) => void; onExplore: () => void; onShowcase: () => void }) {
  const { lang, t, toggle } = useLang();
  const p = usePrefs();
  const [q, setQ] = useState(""), [sel, setSel] = useState(0), [log, setLog] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null), out = useRef<HTMLPreElement>(null), list = useRef<HTMLUListElement>(null);
  const L = (e: string, v: string) => (lang === "vi" ? v : e);
  const onoff = (v: boolean) => t(v ? "p.on" : "p.off");
  const go = (id: string) => () => { location.hash = id; };
  const ext = (u: string) => () => { window.open(u, "_blank", "noopener"); };
  const copyMail = () => { const a = atob(MAIL_B64); navigator.clipboard?.writeText(a).then(() => notify(t("ct.copied")), () => {}); return a; };

  /** The terminal: returns the lines to print, or null to close the palette. */
  const term = (raw: string): string[] | null => {
    const [cmd, ...rest] = raw.trim().split(/\s+/), arg = rest.join(" "), c = cmd.toLowerCase();
    const places: Record<string, string> = { "/": "top", "~": "top", l0: "top", l1: "l1", l2: "l2", l3: "l3", l4: "l4", tools: "stack", kit: "stack", contact: "contact" };
    switch (c) {
      case "help": return [L("commands:", "các lệnh:"), "  whoami · ls · cat <file> · cd <l0…l4|tools|contact> · pwd · date · echo <text>",
        "  demo · explore · theme · motion · sound · hud · lang · pulse · morse <text> · email", "  matrix · party · sudo hire me · clear · exit"];
      case "whoami": return ["Bùi Tuấn Tú", L("software engineer · second-degree student, Signal Officer School", "kỹ sư phần mềm · học viên văn bằng 2, Trường Sĩ quan Thông tin")];
      case "ls": return ["about.txt  route.txt  stack.txt  contact.txt"];
      case "pwd": return [`/layers/${S.f > 0.5 ? "overview" : `L${Math.round(S.d)}`}`];
      case "date": return [new Date().toLocaleString(lang === "vi" ? "vi-VN" : "en-GB", { timeZone: "Asia/Ho_Chi_Minh" }) + " (Asia/Ho_Chi_Minh)"];
      case "echo": return [arg];
      case "cat": switch (arg.replace(/\.txt$/, "")) {
        case "about": return ["Creating with code. Small details matter."];
        case "route": return [`L1  ${t("l1.h2").padEnd(26)}2021 – 2025`, "L2  2NF Software · Frontend     12.2023 – 05.2024", "L2  2NF Software · Backend      06.2024 – 06.2025", `L3  ${L("Military service", "Nghĩa vụ quân sự")}`, `L4  ${L("Signal Officer School", "Trường Sĩ quan Thông tin")}  ← ${L("now", "hiện tại")}`];
        case "stack": return TOOLS.map((x) => `${x.name.padEnd(12)}${lang === "vi" ? x.what[1] : x.what[0]}`);
        case "contact": return LINKS.map((l) => `${l.name.padEnd(10)}${l.href}`);
        default: return [`cat: ${arg || "?"}: ${L("no such file. Try: ls", "không có file này. Thử: ls")}`];
      }
      case "cd": { const id = places[arg.toLowerCase()]; if (!id) return [`cd: ${arg || "?"}: ${L("no such layer", "không có tầng này")}`]; go(id)(); return null; }
      case "theme": p.flip("theme"); return [`${t("p.theme")}: ${t(p.theme === "dark" ? "p.light" : "p.dark")}`];
      case "motion": p.flip("motion"); return [`${t("p.motion")} ${onoff(!p.motion)}`];
      case "sound": p.flip("sound"); return [`${t("p.sound")} ${onoff(!p.sound)}`];
      case "hud": p.flip("hud"); return [`${t("p.hud")} ${onoff(!p.hud)}`];
      case "lang": toggle(); return [lang === "vi" ? "EN" : "VI"];
      case "pulse": S.pulse(); sfx.pulse(); return ["~~~ ▮ ~~~"];
      case "email": return [copyMail(), t("ct.copied")];
      case "morse": go("l4")(); setTimeout(() => dispatchEvent(new CustomEvent("btt:morse", { detail: arg || undefined })), 700); return null;
      case "explore": if (document.documentElement.dataset.gl !== "on") return [L("3D is not available on this device", "Thiết bị này không chạy được 3D")]; onExplore(); return null;
      case "demo": case "showcase": setTimeout(onShowcase, 250); return null;
      case "matrix": matrix(); return null;
      case "party": party(); return null;
      case "sudo": if (arg.toLowerCase() === "hire me") { confetti(innerWidth / 2, innerHeight * 0.4, 60); return [L("Permission granted. Opening a channel…", "Đã cấp quyền. Đang mở kênh liên lạc…"), `→ ${copyMail()}`]; }
        return [L("sudo: only `sudo hire me` is allowed here", "sudo: ở đây chỉ cho phép `sudo hire me`")];
      case "clear": setLog([]); return [];
      case "exit": return null;
      case "": return [];
      default: return [`${cmd}: ${L("command not found. Try: help", "không có lệnh này. Thử: help")}`];
    }
  };
  const runTerm = (raw: string) => {
    const res = term(raw);
    if (res === null) { onClose(); return; }
    if (raw.trim().toLowerCase() !== "clear") setLog((l) => [...l, `$ ${raw}`, ...res].slice(-60));
    setQ(""); setSel(0);
  };

  const cmds = useMemo<Cmd[]>(() => [
    { label: `L0 · ${t("d.0")}`, hint: "cd /", group: "go", run: go("top") },
    { label: `L1 · ${t("l1.h2")}`, hint: "cd L1", group: "go", run: go("l1") },
    { label: "L2 · 2NF Software", hint: "cd L2", group: "go", run: go("l2") },
    { label: `L3 · ${t("l3.h2")}`, hint: "cd L3", group: "go", run: go("l3") },
    { label: `L4 · ${t("l4.h2")}`, hint: "cd L4", group: "go", run: go("l4") },
    { label: t("nav.s"), hint: "cd tools", group: "go", run: go("stack") },
    { label: t("nav.c"), hint: "cd contact", group: "go", run: go("contact") },
    { label: `${t("p.theme")}: ${t(p.theme === "dark" ? "p.dark" : "p.light")}`, hint: "theme", group: "set", run: () => p.flip("theme"), keep: true },
    { label: `${t("p.motion")} ${onoff(p.motion)}`, hint: "motion", group: "set", run: () => p.flip("motion"), keep: true },
    { label: `${t("p.sound")} ${onoff(p.sound)}`, hint: "sound", group: "set", run: () => p.flip("sound"), keep: true },
    { label: `${t("p.hud")} ${onoff(p.hud)}`, hint: "hud", group: "set", run: () => p.flip("hud"), keep: true },
    { label: `${t("pal.lang")} → ${lang === "vi" ? "English" : "Tiếng Việt"}`, hint: "lang", group: "set", run: toggle, keep: true },
    { label: t("pal.copy"), hint: "email", group: "links", run: () => { copyMail(); } },
    ...LINKS.map((l): Cmd => ({ label: l.name, hint: l.handle, group: "links", run: ext(l.href) })),
    { label: L("Source code", "Mã nguồn"), hint: "github", group: "links", run: ext("https://github.com/utnautiub/buituantu.com") },
    { label: t("demo.cmd"), hint: "demo", group: "fun", run: () => runTerm("demo") },
    { label: t("pal.x"), hint: "explore", group: "fun", run: () => runTerm("explore") },
    { label: t("pal.morse"), hint: "morse", group: "fun", run: () => runTerm("morse") },
    { label: t("pal.pulse"), hint: "pulse", group: "fun", run: () => runTerm("pulse"), keep: true },
    { label: "help", hint: "⏎", group: "fun", run: () => runTerm("help"), keep: true },
    { label: "whoami", hint: "⏎", group: "fun", run: () => runTerm("whoami"), keep: true },
    { label: "cat route.txt", hint: "⏎", group: "fun", run: () => runTerm("cat route.txt"), keep: true },
    { label: "sudo hire me", hint: "⏎", group: "fun", run: () => runTerm("sudo hire me"), keep: true },
    { label: "matrix", hint: "⏎", group: "fun", run: () => runTerm("matrix") },
    { label: "party", hint: "⏎", group: "fun", run: () => runTerm("party") },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [lang, p.theme, p.motion, p.sound, p.hud]);

  const needle = q.trim().toLowerCase();
  const shown = needle ? cmds.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(needle)) : cmds;
  const cur = Math.min(sel, Math.max(0, shown.length - 1));

  useEffect(() => { if (open) { setQ(""); setSel(0); input.current?.focus(); } }, [open]);
  useEffect(() => { if (out.current) out.current.scrollTop = out.current.scrollHeight; }, [log]);
  useEffect(() => { list.current?.querySelector(".sel")?.scrollIntoView({ block: "nearest" }); }, [cur, needle]);

  const run = (i: number) => {
    const c = shown[i];
    if (!c) { runTerm(q); return; }
    if (!c.keep) onClose();
    c.run();
  };

  let lastGroup = "";
  return (
    <div className={`pal${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="box">
        <div className="pal__in">
          <span aria-hidden="true">&gt;_</span>
          <input ref={input} value={q} placeholder={t("pal.ph")} autoComplete="off" spellCheck={false}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              else if (e.key === "ArrowDown") { e.preventDefault(); setSel(Math.min(shown.length - 1, cur + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel(Math.max(0, cur - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); run(cur); }
            }} />
        </div>
        {log.length > 0 && <pre className="pal__out" ref={out}>{log.join("\n")}</pre>}
        <ul ref={list}>
          {shown.length ? shown.map((c, i) => {
            const head = !needle && c.group !== lastGroup; lastGroup = c.group;
            return (
              <Fragment key={c.group + c.label}>
                {head && <li className="hd" aria-hidden="true">{t(`pal.${c.group}` as "pal.go")}</li>}
                <li className={i === cur ? "sel" : ""} onClick={() => run(i)} onPointerMove={() => i !== cur && setSel(i)}><span>{c.label}</span><small>{c.hint}</small></li>
              </Fragment>
            );
          }) : <li className="sel" onClick={() => runTerm(q)}><span>{t("pal.run")}: <code>{q}</code></span><small>⏎</small></li>}
        </ul>
        <div className="pal__foot">{t("pal.foot")}<span>{shown.length} / {cmds.length}</span></div>
      </div>
    </div>
  );
});
