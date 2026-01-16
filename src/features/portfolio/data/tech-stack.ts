import {
  Aws,
  CapCut,
  Claude,
  Cloudflare,
  Cursor,
  Figma,
  Gemini,
  Github,
  Grok,
  HuggingFace,
  MetaAI,
  N8n,
  NotebookLM,
  Notion,
  Ollama,
  OpenAI,
  Perplexity,
  Vercel,
} from "@lobehub/icons";

import type { TechStack } from "../types/tech-stack";

export const TECH_STACK: TechStack[] = [
  // Cloud & Infrastructure
  {
    key: "aws",
    title: "AWS",
    href: "https://aws.amazon.com/",
    categories: ["Cloud", "AWS"],
    theme: false,
    iconComponent: Aws.Color,
  },
  {
    key: "cloudflare",
    title: "Cloudflare",
    href: "https://cloudflare.com/",
    categories: ["Cloud", "CDN"],
    theme: false,
    iconComponent: Cloudflare.Color,
  },

  // Automation
  {
    key: "n8n",
    title: "n8n",
    href: "https://n8n.io/",
    categories: ["Tools", "Automation"],
    theme: false,
    iconComponent: N8n.Color,
  },

  // Development & Deployment
  {
    key: "github",
    title: "GitHub",
    href: "https://github.com/",
    categories: ["Tools", "Version Control"],
    theme: false,
    iconComponent: Github,
  },
  {
    key: "vercel",
    title: "Vercel",
    href: "https://vercel.com/",
    categories: ["Tools", "Deployment"],
    theme: false,
    iconComponent: Vercel,
  },

  // Design & Productivity
  {
    key: "figma",
    title: "Figma",
    href: "https://figma.com/",
    categories: ["Tools", "Design"],
    theme: false,
    iconComponent: Figma.Color,
  },
  {
    key: "notion",
    title: "Notion",
    href: "https://notion.com/",
    categories: ["Tools", "Productivity"],
    theme: false,
    iconComponent: Notion,
  },

  // AI Tools
  {
    key: "chatgpt",
    title: "ChatGPT",
    href: "https://chatgpt.com/",
    categories: ["Tools", "AI"],
    theme: true,
    iconComponent: OpenAI,
  },
  {
    key: "claude",
    title: "Claude",
    href: "https://www.anthropic.com/",
    categories: ["Tools", "AI"],
    theme: false,
    iconComponent: Claude.Color,
  },
  {
    key: "gemini",
    title: "Gemini",
    href: "https://gemini.google.com/",
    categories: ["Tools", "AI"],
    theme: false,
    iconComponent: Gemini.Color,
  },
  {
    key: "grok",
    title: "Grok",
    href: "https://grok.com/",
    categories: ["Tools", "AI"],
    theme: true,
    iconComponent: Grok,
  },
  {
    key: "notebooklm",
    title: "NotebookLM",
    href: "https://notebooklm.com/",
    categories: ["Tools", "AI"],
    theme: false,
    iconComponent: NotebookLM,
  },
  {
    key: "cursor",
    title: "Cursor",
    href: "https://cursor.sh/",
    categories: ["Tools", "AI"],
    theme: false,
    iconComponent: Cursor,
  },
  // Content Creation
  {
    key: "capcut",
    title: "CapCut",
    href: "https://capcut.com/",
    categories: ["Tools", "Video Editing"],
    theme: false,
    iconComponent: CapCut,
  },
];
