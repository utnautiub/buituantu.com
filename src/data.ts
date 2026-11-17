export type Pair = [en: string, vi: string];

export const EXP = {
  fe: {
    title: "Frontend Developer",
    when: "12.2023 – 05.2024",
    skills: ["Vue.js", "Nuxt.js", "Ant Design Vue", "REST API Integration", "GitHub", "SVN", "Teamwork"],
    bullets: [
      ["Developed and maintained user interfaces for internal systems and client-facing products.", "Phát triển và bảo trì giao diện cho hệ thống nội bộ và sản phẩm dành cho khách hàng."],
      ["Implemented reusable UI components to ensure consistency and scalability.", "Xây dựng các UI component tái sử dụng để đảm bảo nhất quán và dễ mở rộng."],
      ["Collaborated with backend developers to integrate APIs and handle data flow.", "Phối hợp với backend để tích hợp API và xử lý luồng dữ liệu."],
      ["Focused on performance, maintainability, and clean UI structure.", "Chú trọng hiệu năng, khả năng bảo trì và cấu trúc UI gọn gàng."],
    ] as Pair[],
  },
  be: {
    title: "Backend Developer",
    when: "06.2024 – 06.2025",
    skills: ["Ruby", "Ruby on Rails", "RESTful API Design", "AWS", "Twilio", "Database Design", "System Thinking"],
    bullets: [
      ["Built and maintained backend services and RESTful APIs.", "Xây dựng và bảo trì các dịch vụ backend và RESTful API."],
      ["Designed API logic to support frontend features and third-party integrations.", "Thiết kế logic API phục vụ tính năng frontend và tích hợp bên thứ ba."],
      ["Worked with cloud infrastructure to deploy and operate backend services.", "Làm việc với hạ tầng cloud để triển khai và vận hành dịch vụ backend."],
      ["Integrated external services such as SMS and communication APIs.", "Tích hợp dịch vụ bên ngoài như SMS và các API liên lạc."],
    ] as Pair[],
  },
};
export type ExpKey = keyof typeof EXP;

/** What this page itself is built with, and what each piece does on it. */
export const TOOLS: { name: string; kind: Pair; what: Pair; href: string }[] = [
  { name: "React", kind: ["Interface", "Giao diện"], what: ["Every section, the palette and explore mode are React components.", "Mọi phần của trang, bảng lệnh và chế độ khám phá đều là component React."], href: "https://react.dev/" },
  { name: "TypeScript", kind: ["Language", "Ngôn ngữ"], what: ["All of the code, typed, so the 3D scene and the page agree on their shared state.", "Toàn bộ mã nguồn, có kiểu, để cảnh 3D và trang thống nhất về trạng thái dùng chung."], href: "https://www.typescriptlang.org/" },
  { name: "Vite", kind: ["Build", "Đóng gói"], what: ["Dev server and the production build: one small, static site.", "Máy chủ khi phát triển và bản dựng cuối: một trang tĩnh gọn nhẹ."], href: "https://vite.dev/" },
  { name: "three.js", kind: ["3D", "3D"], what: ["The five glass layers, the packets, the sparks and explore mode.", "Năm tấm kính, các hạt rơi, vòng tia sáng và chế độ khám phá."], href: "https://threejs.org/" },
  { name: "GLSL", kind: ["Shader", "Shader"], what: ["The aurora behind the page, one small shader drawn at low resolution.", "Lớp cực quang phía sau trang, một shader nhỏ vẽ ở độ phân giải thấp."], href: "https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)" },
  { name: "Canvas 2D", kind: ["Drawing", "Vẽ"], what: ["The art on every slab, the cursor trail and the matrix rain, drawn in code.", "Họa tiết trên từng tấm kính, vệt đuôi con trỏ và mưa ký tự, đều vẽ bằng code."], href: "https://developer.mozilla.org/docs/Web/API/Canvas_API" },
  { name: "Web Audio", kind: ["Sound", "Âm thanh"], what: ["Every click, note and Morse tone is synthesised live. No audio files.", "Mọi tiếng bấm, nốt nhạc và tiếng Morse đều tổng hợp trực tiếp, không có file âm thanh."], href: "https://developer.mozilla.org/docs/Web/API/Web_Audio_API" },
  { name: "CSS", kind: ["Motion", "Chuyển động"], what: ["Scroll-driven animation, the edge light on cards, the light and dark themes.", "Chuyển động theo cuộn trang, tia sáng chạy quanh viền thẻ, giao diện sáng và tối."], href: "https://developer.mozilla.org/docs/Web/CSS/CSS_scroll-driven_animations" },
];

export const MARQUEE = ["Vue.js", "Nuxt.js", "Ant Design Vue", "Ruby", "Ruby on Rails", "RESTful API", "AWS", "Twilio", "Database Design", "System Thinking", "GitHub", "SVN"];

export const LINKS: { name: string; handle: string; href: string; icon: string }[] = [
  { name: "GitHub", handle: "@utnautiub", href: "https://github.com/utnautiub", icon: "/icons/github.png" },
  { name: "LinkedIn", handle: "@buituantu", href: "https://linkedin.com/in/buituantu", icon: "/icons/linkedin.png" },
  { name: "X", handle: "@utnautiub", href: "https://x.com/utnautiub", icon: "/icons/x.png" },
  { name: "Facebook", handle: "BUlTUANTU", href: "https://www.facebook.com/BUlTUANTU/", icon: "/icons/facebook.png" },
  { name: "Zalo", handle: "Bùi Tuấn Tú", href: "https://zalo.me/84339102003", icon: "/icons/zalo.png" },
];

/** Stored the same way as on buituantu.com: base64, decoded only when the visitor asks for it. */
export const MAIL_B64 = "dXRuYXV0aXViQGdtYWlsLmNvbQ==";

/** Rotating roles in the hero, from the "flip sentences" on the existing buituantu.com. */
export const ROLES: Record<"en" | "vi", string[]> = {
  en: ["Software Engineer", "Design Engineer", "Open Source Contributor"],
  vi: ["Kỹ sư phần mềm", "Design Engineer", "Open Source Contributor"],
};

/** Headline words. 1 marks the gradient words, "\n" forces a line break. */
export type Part = [word: string, grad: 0 | 1];
export const HEADLINE: Record<"en" | "vi", Part[]> = {
  en: [["Creating", 0], ["with", 0], ["code.", 0], ["Small", 1], ["details", 1], ["matter.", 0]],
  vi: [["Sáng", 0], ["tạo", 0], ["bằng", 0], ["code.", 0], ["Chi", 1], ["tiết", 1], ["nhỏ", 1], ["tạo", 0], ["nên", 0], ["khác", 0], ["biệt.", 0]],
};
export const SIGNOFF: Record<"en" | "vi", Part[]> = {
  en: [["Signal's", 0], ["clear.", 0], ["\n", 0], ["Get", 1], ["in", 1], ["touch.", 1]],
  vi: [["Tín", 0], ["hiệu", 0], ["đã", 0], ["rõ.", 0], ["\n", 0], ["Liên", 1], ["lạc", 1], ["nhé.", 1]],
};
