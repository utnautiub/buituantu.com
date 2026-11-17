import { createContext, useContext } from "react";

export type Lang = "en" | "vi";

const en = {
  skip: "Skip to content",
  "nav.1": "University", "nav.2": "Work", "nav.3": "Service", "nav.4": "Now", "nav.s": "Tools", "nav.c": "Contact",
  "d.0": "Surface", "d.1": "University", "d.2": "Work", "d.3": "Service", "d.4": "Signal",
  "hero.cadet": "Signal Officer School cadet",
  "hero.lede": "I'm Bùi Tuấn Tú. I went from an Information Systems student at Thuy Loi University to frontend, then backend, at 2NF Software. Then I served in the military, and I'm now a second-degree student at the Signal Officer School. This page is that route, one layer at a time.",
  "hero.cta": "Dive in", "hero.term": "Open the terminal", "hero.cue": "Scroll to go one layer down",
  "l1.tag": "Student", "l1.h2": "Thuy Loi University",
  "l1.lede": "Four years of Information Systems at a university built to teach people how to tame water. I learned to regulate a different kind of flow: data. Analyse it, design for it, store it, and make sure information runs the right way before the first line of code is written.",
  "e.1": "Information Systems", "e.2": "System Analysis & Design", "e.3": "Database Design", "e.4": "Software Engineering", "e.5": "UI/UX Fundamentals", "e.6": "Teamwork",
  "l2.tag": "Engineer", "l2.lede": "Nineteen months, full-time. I started on the interface and then moved one layer down to the server.", "l2.full": "Full-time",
  "l3.tag": "Soldier", "l3.h2": "Military service",
  "l3.lede": "After 2NF Software I stepped away from the keyboard to complete my military service. There are no commits on this layer, but the next one exists because of it.",
  "l4.tag": "Cadet", "l4.now": "now", "l4.h2": "Signal Officer School",
  "l4.lede": "Second-degree student at the school that trains the people who keep the army's lines of communication alive. I used to make sure a request reached the server. Now I'm learning how an order reaches the right person at the right moment.",
  "l4.k": "Try it", "l4.c": "Send a test signal", "l4.send": "Transmit", "l4.msg": "Message",
  "sk.tag": "Kit", "sk.h2": "Tools I reach for.", "sk.lede": "Cloud, deployment, automation and design. The things that sit under everything else.",
  "ct.tag": "Contact", "ct.mail": "Email", "ct.mail.s": "click to copy", "ct.copied": "Email copied",
  "ft.src": "Source", "ft.hint": "Press ⌘K / Ctrl K anywhere.",
  "p.theme": "Colour theme", "p.dark": "Dark", "p.light": "Light", "p.motion": "Motion", "p.sound": "Sound", "p.hud": "HUD", "p.on": "on", "p.off": "off",
  "hud.fps": "This tab, right now", "hud.close": "Close",
  "pal.ph": "Search, or type a command: help", "pal.none": "No results", "pal.morse": "Send a Morse signal", "pal.lang": "Switch language",
  "pal.go": "Go to", "pal.set": "Settings", "pal.links": "Links", "pal.fun": "Terminal", "pal.run": "Run", "pal.copy": "Copy email address", "pal.top": "Back to the top",
  "pal.pulse": "Send a pulse through the stack", "pal.foot": "↑↓ move · ⏎ run · esc close",
  "gauge": "depth",
};

export type Key = keyof typeof en;

const vi: Record<Key, string> = {
  skip: "Bỏ qua tới nội dung",
  "nav.1": "Đại học", "nav.2": "Đi làm", "nav.3": "Nhập ngũ", "nav.4": "Hiện tại", "nav.s": "Công cụ", "nav.c": "Liên hệ",
  "d.0": "Bề mặt", "d.1": "Đại học", "d.2": "Đi làm", "d.3": "Nhập ngũ", "d.4": "Thông tin",
  "hero.cadet": "Học viên Trường Sĩ quan Thông tin",
  "hero.lede": "Mình là Bùi Tuấn Tú. Từ sinh viên Hệ thống thông tin ở Trường Đại học Thủy lợi, mình đi làm frontend rồi backend tại 2NF Software, sau đó lên đường nhập ngũ, và giờ là học viên văn bằng 2 tại Trường Sĩ quan Thông tin. Trang này kể lại chặng đường đó, mỗi lần một tầng.",
  "hero.cta": "Lặn xuống", "hero.term": "Mở terminal", "hero.cue": "Cuộn để xuống thêm một tầng",
  "l1.tag": "Sinh viên", "l1.h2": "Trường Đại học Thủy lợi",
  "l1.lede": "Bốn năm học Hệ thống thông tin ở ngôi trường sinh ra để dạy người ta trị thủy. Còn mình thì học cách điều tiết một dòng chảy khác: dữ liệu. Phân tích, thiết kế, lưu trữ, sao cho thông tin chảy đúng hướng trước khi dòng code đầu tiên được viết ra.",
  "e.1": "Hệ thống thông tin", "e.2": "Phân tích & thiết kế hệ thống", "e.3": "Thiết kế cơ sở dữ liệu", "e.4": "Công nghệ phần mềm", "e.5": "Cơ bản về UI/UX", "e.6": "Làm việc nhóm",
  "l2.tag": "Kỹ sư", "l2.lede": "Mười chín tháng, toàn thời gian. Mình bắt đầu từ giao diện rồi xuống một tầng tới máy chủ.", "l2.full": "Toàn thời gian",
  "l3.tag": "Người lính", "l3.h2": "Nghĩa vụ quân sự",
  "l3.lede": "Sau 2NF Software, mình tạm rời bàn phím để thực hiện nghĩa vụ quân sự. Tầng này không có commit nào, nhưng nhờ nó mà có tầng tiếp theo.",
  "l4.tag": "Học viên", "l4.now": "hiện tại", "l4.h2": "Trường Sĩ quan Thông tin",
  "l4.lede": "Học viên văn bằng 2 tại ngôi trường đào tạo những người giữ mạch máu thông tin liên lạc của quân đội. Trước đây mình lo cho một request tới được server. Giờ mình học cách để một mệnh lệnh tới đúng người, đúng lúc.",
  "l4.k": "Thử xem", "l4.c": "Gửi thử một tín hiệu", "l4.send": "Phát", "l4.msg": "Thông điệp",
  "sk.tag": "Trang bị", "sk.h2": "Những công cụ mình dùng.", "sk.lede": "Cloud, triển khai, tự động hóa và thiết kế. Những thứ nằm bên dưới mọi thứ khác.",
  "ct.tag": "Liên hệ", "ct.mail": "Email", "ct.mail.s": "bấm để chép", "ct.copied": "Đã chép email",
  "ft.src": "Mã nguồn", "ft.hint": "Nhấn ⌘K / Ctrl K ở bất kỳ đâu.",
  "p.theme": "Giao diện", "p.dark": "Tối", "p.light": "Sáng", "p.motion": "Chuyển động", "p.sound": "Âm thanh", "p.hud": "HUD", "p.on": "bật", "p.off": "tắt",
  "hud.fps": "Tab này, hiện tại", "hud.close": "Đóng",
  "pal.ph": "Tìm, hoặc gõ lệnh: help", "pal.none": "Không có kết quả", "pal.morse": "Phát tín hiệu Morse", "pal.lang": "Đổi ngôn ngữ",
  "pal.go": "Đi tới", "pal.set": "Cài đặt", "pal.links": "Liên kết", "pal.fun": "Terminal", "pal.run": "Chạy", "pal.copy": "Chép địa chỉ email", "pal.top": "Về đầu trang",
  "pal.pulse": "Phát một xung qua chồng tầng", "pal.foot": "↑↓ chọn · ⏎ chạy · esc đóng",
  "gauge": "độ sâu",
};

export const DICT: Record<Lang, Record<Key, string>> = { en, vi };

/** Each slab of the stack, top to bottom: the section it lives in, its code and its label in the rail.
 */
export const RAIL: { layer: number; id: string; code: string; key: Key; color: string }[] = [
  { layer: 0, id: "top", code: "L0", key: "d.0", color: "var(--l0)" },
  { layer: 1, id: "l1", code: "L1", key: "d.1", color: "var(--l1)" },
  { layer: 2, id: "l2", code: "L2", key: "d.2", color: "var(--l2)" },
  { layer: 3, id: "l3", code: "L3", key: "d.3", color: "var(--l3)" },
  { layer: 4, id: "l4", code: "L4", key: "d.4", color: "var(--l4)" },
];

export interface LangApi { lang: Lang; t: (k: Key) => string; toggle: () => void }
export const LangCtx = createContext<LangApi>({ lang: "vi", t: (k) => vi[k], toggle: () => {} });
export const useLang = () => useContext(LangCtx);

/** Vietnamese first; English only once the visitor has chosen it. */
export function initialLang(): Lang {
  try { return localStorage.getItem("btt.lang") === "en" ? "en" : "vi"; } catch { return "vi"; }
}
export function saveLang(l: Lang) { try { localStorage.setItem("btt.lang", l); } catch { /* private mode */ } }
