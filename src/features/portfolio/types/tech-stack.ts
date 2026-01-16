import type { ComponentType, SVGProps } from "react";

/**
 * A technology item displayed in the Tech Stack section.
 *
 * Icon resolution priority:
 * 1. If `iconComponent` is provided, use React component from @lobehub/icons
 * 2. Otherwise, fallback to SVG file resolution:
 *    - Default: /public/tech-stack-icons/[key].svg
 *    - Themed (when `theme === true`):
 *      - Dark:  /public/tech-stack-icons/[key]-dark.svg
 *      - Light: /public/tech-stack-icons/[key]-light.svg
 */
export type TechStack = {
  /** Unique identifier used to resolve icon files. */
  key: string;
  /** Display name of the technology. */
  title: string;
  /** Official website URL. */
  href: string;
  /** Category tags used for grouping/filtering. */
  categories: string[];
  /** If true, use theme-specific icons for dark/light mode. */
  theme?: boolean;
  /** React component from @lobehub/icons (optional, prioritized over SVG). */
  iconComponent?: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};
