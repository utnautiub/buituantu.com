import type { User } from "@/features/portfolio/types/user";

export const USER = {
  firstName: "Tú",
  lastName: "Bùi Tuấn",
  displayName: "Bùi Tuấn Tú",
  username: "buituantu",
  gender: "male",
  pronouns: "he/him",
  bio: "Creating with code. Small details matter.",
  flipSentences: [
    "Creating with code. Small details matter.",
    "Design Engineer",
    "Open Source Contributor",
  ],
  address: "Thai Nguyen, Viet Nam",
  phoneNumber: "Kzg0MzM5MTAyMDAz", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: "dXRuYXV0aXViQGdtYWlsLmNvbQ==", // base64 encoded
  website: "https://buituantu.com",
  jobTitle: "Software Engineer",
  jobs: [
    {
      title: "Unemployed",
      company: "Tesla",
      website: "https://buituantu.com",
    },
  ],
  //   about: `
  // Hello, World! I am Chánh Đại — a Design Engineer passionate about creating high-performance, user-centric software solutions with intuitive and engaging designs.

  // With 5+ years of experience, I specialize in building high-quality web and mobile applications using Next.js, React, TypeScript, and modern front-end technologies. Beyond work, I love exploring new technologies and turning ideas into reality through personal projects.

  // One of my key projects, [ZaDark](https://zadark.com), launched in 2022, enhances the Zalo experience on PC and Web, surpassing 80k+ downloads on [SourceForge](https://sourceforge.net/projects/zadark) and reaching 20k+ active users on the [Chrome Web Store](https://chromewebstore.google.com/detail/llfhpkkeljlgnjgkholeppfnepmjppob) (as of Sep 2025).

  // I'm also the creator of [React Wheel Picker](https://react-wheel-picker.chanhdai.com) — iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support. It has earned 4k+ weekly downloads on [npm](https://www.npmjs.com/package/@ncdai/react-wheel-picker) and was selected for [▲Vercel OSS Program](https://vercel.com/blog/summer-2025-oss-program#react-wheel-picker) summer 2025 cohort.

  // Let's connect and collaborate!
  //   `,
  about: `No about yet.
`,
  avatar: "/assets/images/avatar.jpg",
  ogImage: "/assets/images/og-image.png",
  namePronunciationUrl: "/assets/audio/name-pronunciation.mp3",
  timeZone: "Asia/Ho_Chi_Minh",
  keywords: [
    "btt",
    "buituantu",
    "bui tuan tu",
    "utnautiub",
    "bui.tuan.tu",
    "iambtt",
  ],
  dateCreated: "2026-01-14", // YYYY-MM-DD
} satisfies User;
