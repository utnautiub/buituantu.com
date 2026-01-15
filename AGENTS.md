# AI Agent Guidelines for buituantu.com

> **📖 For AI Agents**: This document provides comprehensive context about the buituantu.com codebase. Read this file first to understand project structure, coding standards, and best practices before making any changes.

## How to Use This Guide (for AI Agents)

**Before responding to any user request**:
1. ✅ Read relevant sections of this guide based on the task
2. ✅ Follow the MUST/SHOULD/NEVER guidelines strictly
3. ✅ Reference the project structure when navigating files
4. ✅ Check "Auto-generated Files" section - NEVER edit those files
5. ✅ Use the commands in "Development Guidelines" for builds/tests

**Key Sections by Task Type**:
- 🎨 UI/Component work → Read "Web Interface Guidelines"
- 📝 Content updates → Read "Working with Content" + "User Portfolio"
- 🔧 New components → Read "Component Registry System" + "Component Development"
- ⚙️ Configuration → Read "Environment & Configuration"
- 📦 Dependencies → Read "Registry Dependencies"

---

## Project Overview

**buituantu.com** is a minimal, pixel-perfect dev portfolio, component registry, and blog built with modern web technologies. It serves as:

- Personal portfolio for Bùi Tuấn Tú (@utnautiub)
- Component registry using shadcn/ui system
- Blog with MDX content
- Showcase for custom React components

**Original Template**: Forked from [chanhdai.com](https://github.com/ncdai/chanhdai.com) by Nguyen Chanh Dai (@ncdai)

### Key Features

- **Clean & modern design** - Minimalist interface with attention to detail
- **Light/Dark themes** - Seamless theme switching with system preference support
- **vCard integration** - Downloadable contact card
- **SEO optimized** - JSON-LD schema, sitemap, robots.txt
- **AI-ready** - Supports /llms.txt for AI agent accessibility
- **Spam-protected email** - Encoded contact information
- **PWA support** - Installable as Progressive Web App
- **Blog system** - MDX/Markdown support with syntax highlighting, dynamic OG images, RSS feed
- **Component registry** - Reusable components distributed via shadcn CLI

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + custom components
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Content**: MDX for blog posts
- **Deployment**: Vercel

## Project Structure

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/             # Main app routes
│   ├── (llms)/            # LLM-related routes
│   ├── og/                # Open Graph image generation
│   └── rss/               # RSS feed generation
├── components/            # Shared UI components
├── registry/              # Component registry source
├── __registry__/          # Auto-generated registry files (⚠️ DO NOT EDIT)
├── features/              # Feature-based modules
│   ├── blog/              # Blog functionality
│   └── portfolio/         # User portfolio data
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
└── styles/                # Global styles
public/
└── assets/                # Static assets (images, audio, etc.)
    ├── images/            # All image assets
    │   ├── tech-stack-icons/  # Tech stack SVG icons
    │   ├── link-icons/        # Social link icons
    │   ├── companies/         # Company/issuer logos
    │   └── project-logos/     # Project logos
    ├── audio/             # Audio files
    └── brand/             # Brand assets (logos, marks)
```

> **⚠️ Important**: The `packages/` folder (if exists) contains optional CLI tools for npm publishing. It can be safely removed if not publishing components to npm.

### Important Files

- `src/config/site.ts` - Site configuration and navigation
- `src/config/registry.ts` - Registry configuration
- `src/features/portfolio/data/user.ts` - User portfolio data
- `src/registry/index.ts` - Registry entry point
- `components.json` - shadcn/ui configuration

## Component Registry System

The project features a custom component registry built on top of shadcn/ui:

### Registry Structure

- **Components** (`src/registry/registry-components.ts`) - UI components
- **Hooks** (`src/registry/registry-hook.ts`) - Custom React hooks
- **Blocks** (`src/registry/registry-blocks.ts`) - Pre-built blocks and sections
- **Examples** (`src/registry/registry-examples.ts`) - Component demos
- **Lib** (`src/registry/registry-lib.ts`) - Utility functions

### Registry Types

- `registry:component` - Reusable UI components
- `registry:hook` - Custom React hooks
- `registry:block` - Pre-built blocks and sections
- `registry:example` - Component examples/demos
- `registry:lib` - Utility libraries

### Available Components

1. **theme-switcher** - Theme switching component
2. **flip-sentences** - Text animation component
3. **apple-hello-effect** - Apple-style writing effect
4. **wheel-picker** - iOS-like wheel picker
5. **work-experience** - Work experience display
6. **shimmering-text** - Shimmering text animation
7. **slide-to-unlock** - iOS-style slide to unlock component
8. **scroll-fade-effect** - Adds fade effect to content as you scroll
9. **github-stars** - GitHub repository stars display component
10. **testimonials-marquee** - Testimonials marquee component
11. **use-controllable-state** - State management hook
12. **use-sound** - Sound effects hook
13. **utils** - Utility functions

> **Note**: All components are compatible with [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) and [React 19](https://react.dev/blog/2024/12/05/react-19).

### Registry Build Process

```bash
# Build registry internally
pnpm registry:internal:build

# Build shadcn registry
pnpm registry:build
```

Auto-generated files (DO NOT EDIT):

- `src/__registry__/index.tsx`
- `src/__registry__/registry.autogenerated.json`
- `public/r/*.json`

## Development Guidelines

### Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev  # Runs on port 1408

# Build for production
pnpm build
```

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js configuration
- **Prettier**: Code formatting
- **File naming**: kebab-case for files, PascalCase for components

### Coding Guidelines

When writing code for this project, follow these principles:

**TypeScript & Documentation**

- Write type-safe TypeScript code with explicit types when necessary
- Add comments only when they clarify complex logic, function purpose, or non-obvious behavior
- Avoid obvious comments that merely restate the code
- Use descriptive variable and function names that make the code self-documenting
- Keep comments concise and focused on the "why" rather than the "what"

**Code Style**

- No emojis in code, comments, or commit messages
- Write clean, readable code that minimizes the need for extensive documentation
- Prefer self-explanatory code over commented code
- Use JSDoc for public APIs and exported functions when the signature alone isn't clear

**Best Practices**

- Follow SOLID principles and clean code practices
- Keep functions small and focused on a single responsibility
- Use meaningful names that reveal intent
- Write code that is easy to understand at first glance
- Avoid over-commenting; let the code speak for itself

### Component Development

1. Create component in `src/registry/[component-name]/`
2. Add to appropriate registry file (`registry-components.ts`, etc.)
3. Create examples in `src/registry/examples/`
4. Run registry build commands
5. Update documentation

## Web Interface Guidelines

Concise rules for building accessible, fast, delightful UIs. Use MUST/SHOULD/NEVER to guide decisions.

### Interactions

- Keyboard
  - MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
  - MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
  - MUST: Manage focus (trap, move, and return) per APG patterns
- Targets & input
  - MUST: Hit target ≥24px (mobile ≥44px). If visual <24px, expand hit area
  - MUST: Mobile `<input>` font-size ≥16px or set:
    ```html
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
    />
    ```
  - NEVER: Disable browser zoom
  - MUST: `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design
- Inputs & forms (behavior)
  - MUST: Hydration-safe inputs (no lost focus/value)
  - NEVER: Block paste in `<input>/<textarea>`
  - MUST: Loading buttons show spinner and keep original label
  - MUST: Enter submits focused text input. In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
  - MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
  - MUST: Don’t block typing; accept free text and validate after
  - MUST: Allow submitting incomplete forms to surface validation
  - MUST: Errors inline next to fields; on submit, focus first error
  - MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
  - SHOULD: Disable spellcheck for emails/codes/usernames
  - SHOULD: Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
  - MUST: Warn on unsaved changes before navigation
  - MUST: Compatible with password managers & 2FA; allow pasting one-time codes
  - MUST: Trim values to handle text expansion trailing spaces
  - MUST: No dead zones on checkboxes/radios; label+control share one generous hit target
- State & navigation
  - MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels). Prefer libs like [nuqs](https://nuqs.dev)
  - MUST: Back/Forward restores scroll
  - MUST: Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)
- Feedback
  - SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
  - MUST: Confirm destructive actions or provide Undo window
  - MUST: Use polite `aria-live` for toasts/inline validation
  - SHOULD: Ellipsis (`…`) for options that open follow-ups (eg, "Rename…") and loading states (eg, "Loading…", "Saving…", "Generating…")
- Touch/drag/scroll
  - MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
  - MUST: Delay first tooltip in a group; subsequent peers no delay
  - MUST: Intentional `overscroll-behavior: contain` in modals/drawers
  - MUST: During drag, disable text selection and set `inert` on dragged element/containers
  - MUST: No “dead-looking” interactive zones—if it looks clickable, it is
- Autofocus
  - SHOULD: Autofocus on desktop when there’s a single primary input; rarely on mobile (to avoid layout shift)

### Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant)
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations are interruptible and input-driven (avoid autoplay)
- MUST: Correct `transform-origin` (motion starts where it “physically” should)

### Layout

- SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (use env(safe-area-inset-\*))
- MUST: Avoid unwanted scrollbars; fix overflows

### Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (“ ”); avoid widows/orphans
- MUST: Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Don’t ship the schema—visuals may omit labels but accessible names still exist
- MUST: Use the ellipsis character `…` (not '...')
- MUST: `scroll-margin-top` on headings for anchored links; include a “Skip to content” link; hierarchical `<h1–h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers/currency
- MUST: Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- SHOULD: Right-clicking the nav logo surfaces brand assets
- MUST: Use non-breaking spaces to glue terms: `10\u00A0MB`, `⌘\u00A0+\u00A0K`, `Vercel\u00A0SDK`

### Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
- MUST: Mutations (`POST/PATCH/DELETE`) target <500 ms
- SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- MUST: Virtualize large lists (eg, `virtua`)
- MUST: Preload only above-the-fold images; lazy-load the rest
- MUST: Prevent CLS from images (explicit dimensions or reserved space)

### Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover/:active/:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid gradient banding (use masks when needed)

## Working with Content

### Blog Posts

- Location: `src/features/blog/content/`
- Format: MDX files
- Supports: Custom components, code blocks, metadata

### User Portfolio

**Portfolio Data Files** (`src/features/portfolio/data/`):

> **🎯 For AI**: These files contain user's personal information. Always ask before modifying unless explicitly requested.

- `user.ts` - Core personal information, bio, contact details, job history
- `experiences.ts` - Detailed work experience (company information)
- `education.ts` - Educational background, degrees, institutions
- `projects.ts` - Portfolio projects with descriptions, links, skills, logos
- `tech-stack.ts` - Technology stack, programming languages, tools, frameworks (37+ items)
- `awards.ts` - Competition awards, prizes, academic achievements, certificates
- `certifications.ts` - Professional certifications, course completions, credentials
- `social-links.ts` - Social media profiles, professional networks, contact links
- `testimonials.ts` - Professional recommendations, endorsements from colleagues and clients

**Important Data Formats**:
- Contact info (email/phone) may be base64 encoded for spam protection
- All external image URLs have been migrated to local `/assets/` folder
- Tech stack icons support both single theme and dual theme (light/dark variants)

## Environment & Configuration

### Environment Variables

See `.env.example` for required variables:

**Core Application**:

- `APP_URL` - Application base URL (e.g., `https://acme.com`)

**Registry Configuration**:

- `REGISTRY_NAMESPACE` - Namespace identifier for shadcn CLI (e.g., `@acme`)
- `REGISTRY_NAMESPACE_URL` - URL pattern for component resolution (e.g., `https://acme.com/r/{name}.json`)

**External Services**:

- `GITHUB_API_TOKEN` - GitHub Personal Access Token for API calls ([Get token](https://github.com/settings/tokens))
- `NEXT_PUBLIC_DMCA_URL` - DMCA Protection badge URL ([DMCA ProtectionPro](https://www.dmca.com/ProtectionPro.aspx))

**Analytics & Tracking**:

- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project API key for analytics ([Get key](https://posthog.com))
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog API host URL (e.g., `https://ph.acme.com`)
- `NEXT_PUBLIC_POSTHOG_UI_HOST` - PostHog UI host URL (e.g., `https://us.i.posthog.com`)

### Analytics Events

The project uses PostHog for analytics tracking. Events are defined in `src/lib/events.ts` and tracked via `trackEvent()` function.

**Tracked Events**:

- `copy_npm_command` - User copies npm/pnpm/yarn/bun install command
  - Properties: `code` (command text)
- `copy_code_block` - User copies code block from blog/docs
  - Properties: `code` (code content)
- `play_name_pronunciation` - User plays name pronunciation audio
- `open_command_menu` - User opens command menu
  - Properties: `method` ("click" | "keyboard"), `key` (keyboard shortcut used)
- `command_menu_search` - User searches in command menu (debounced 500ms)
  - Properties: `query` (search text), `query_length` (query length)
- `command_menu_action` - User performs action in command menu
  - Navigation: Properties `action: "navigate"`, `href`, `open_in_new_tab`
  - Copy: Properties `action: "copy"`, `text` (copied content)
  - Theme: Properties `action: "change_theme"`, `theme` ("light" | "dark" | "system")
- `blog_search` - User searches blog posts (debounced 500ms)
  - Properties: `query` (search text), `query_length` (query length)

**Implementation Details**:

- Events use Zod schema validation for type safety
- PostHog initialized in `src/instrumentation-client.ts` (production only)
- Consent management via `@c15t/nextjs` package
- Cookieless mode enabled until user consent

### Site Configuration

- Navigation: `MAIN_NAV` in `src/config/site.ts`
- Theme colors: `META_THEME_COLORS`
- GitHub repo: `SOURCE_CODE_GITHUB_REPO`

## Common Tasks (AI Agent Quick Reference)

### Task 1: Adding a New Component

**Steps**:
1. Create component directory: `src/registry/[name]/`
2. Implement component with proper TypeScript types
3. Add to `src/registry/registry-components.ts`
4. Create example in `src/registry/examples/`
5. Build registry: `pnpm registry:build`

**AI Checklist**:
- ✅ Use TypeScript with explicit types
- ✅ Follow naming convention: kebab-case for files, PascalCase for components
- ✅ Support both light/dark themes if visual component
- ✅ Add proper ARIA labels for accessibility
- ✅ Test keyboard navigation

### Task 2: Updating User Portfolio Data

**Files to Edit** (`src/features/portfolio/data/`):
- `user.ts` - Name, bio, avatar, contact
- `experiences.ts` - Work experience
- `education.ts` - Educational background
- `projects.ts` - Portfolio projects
- `tech-stack.ts` - Technologies (37+ items)
- `social-links.ts` - Social profiles

**AI Guidelines**:
- 🔒 Email/phone should be base64 encoded: use https://t.io.vn/base64-string-converter
- 🖼️ Images use local paths: `/assets/images/[category]/[filename]`
- 📝 Markdown supported in description fields
- 🏷️ Keep skill tags consistent across entries

### Task 3: Managing Assets (Images, Icons, Logos)

**Current Asset Structure**:
```
public/assets/
├── images/
│   ├── avatar.webp                    # User avatar
│   ├── og-image.png                   # SEO/social preview
│   ├── tech-stack-icons/*.svg         # 37 tech icons
│   ├── link-icons/*.webp             # Social media icons
│   ├── companies/*.{svg,webp}         # Company logos
│   └── project-logos/*.{svg,webp}    # Project logos
├── audio/
│   └── chanhdai.mp3                   # Name pronunciation
└── brand/
    └── *.svg                          # Brand assets (reference)
```

**AI Guidelines**:
- ✅ All images stored locally (no external CDN)
- ✅ Use `/assets/images/` prefix for all image paths
- ✅ Tech stack icons support theme variants: `[name]-light.svg` / `[name]-dark.svg`
- ✅ Optimize images before adding (use WebP for photos, SVG for logos)
- ⚠️ DON'T use external URLs (assets.chanhdai.com was migrated)

### Task 4: Adding/Editing Blog Posts

**Steps**:
1. Create MDX file: `src/features/blog/content/[slug].mdx`
2. Add frontmatter metadata
3. Use custom components for enhanced content
4. Images should be in `public/assets/images/blog/`

**Frontmatter Template**:
```yaml
---
title: "Your Blog Title"
description: "Brief description for SEO"
date: "2026-01-15"
published: true
image: "/assets/images/blog/your-image.webp"
---
```

**AI Guidelines**:
- ✅ Use custom MDX components from `src/components/mdx.tsx`
- ✅ Add OG image for social sharing
- ✅ Follow Web Interface Guidelines for content structure
- ✅ Use proper heading hierarchy (h2 → h3 → h4)

### Task 5: Styling & Theming

**Guidelines**:
- Use Tailwind CSS v4 syntax
- Follow zinc-based color scheme
- Support both light/dark modes
- Use CSS variables for theme colors
- Test with `prefers-reduced-motion`

**Theme Toggle**:
- Hotkey: Press `D` (supports Vietnamese `Đ`)
- Component: `src/components/theme-toggle.tsx`

**AI Reminders**:
- 🎨 Use semantic color tokens: `bg-background`, `text-foreground`
- 🌗 Test both themes before submitting
- ♿ Maintain WCAG AA contrast ratios minimum

## Important Notes

### Registry Dependencies

- Components may depend on external packages

### Auto-generated Files

**NEVER EDIT** these files directly:

- `src/__registry__/index.tsx`
- `src/__registry__/registry.autogenerated.json`
- Files in `public/r/`

### Performance Considerations

- Components use React.lazy() for code splitting
- Images optimized with Next.js Image component
- MDX content is statically generated

### Personal Information & Assets

> **🎯 For AI**: This project has been customized for Bùi Tuấn Tú. Original template by @ncdai.

**Current Owner Information**:
- Name: Bùi Tuấn Tú
- Username: @utnautiub
- Email: utnautiub@gmail.com
- GitHub: https://github.com/utnautiub
- Website: https://buituantu.com

**Key Areas Already Updated**:
- ✅ `package.json` - Package name, author, repository
- ✅ `src/config/site.ts` - Site URL, GitHub repo, UTM params
- ✅ All portfolio data files in `src/features/portfolio/data/`
- ✅ Image URLs migrated from external CDN to local `/public/assets/`

**Assets Management**:
- All images stored locally in `public/assets/` (88+ files)
- Tech stack icons: 37 SVG files (single + dual theme variants)
- Use PowerShell script `download-assets.ps1` to download reference assets
- Images should be replaced with user's own content (avatar, screenshots, logos)

**Important Notes**:
- Contact info (email/phone) is base64 encoded for spam protection
- Registry namespace uses `@ncdai` for component compatibility with original template
- Blog posts should be replaced with user's own content

## Deployment

### Vercel Deployment

- Automatic deployment from GitHub
- Environment variables configured in Vercel dashboard
- Build command: `pnpm build`
- Output directory: `.next`

### Build Commands

```bash
pnpm build          # Production build
pnpm start          # Start production server
pnpm preview        # Build and preview locally
```

## AI Agent Quick Commands Reference

### Development Commands
```bash
pnpm dev              # Start dev server (port 1408)
pnpm build            # Production build
pnpm preview          # Build + preview locally
pnpm lint             # Run ESLint
pnpm lint:fix         # Auto-fix lint issues
pnpm check-types      # TypeScript type checking
pnpm format:write     # Format code with Prettier
```

### Registry Commands
```bash
pnpm registry:build                # Build complete registry
pnpm registry:internal:build       # Build internal registry only
```

### Asset Management Commands
```bash
.\download-assets.ps1              # Download reference assets (PowerShell)
```

## AI Agent Troubleshooting Guide

### Issue: "Module not found" or Import Errors
**Solution**: 
1. Check if file exists at the path
2. Verify import path uses correct alias (`@/` for `src/`)
3. Check `tsconfig.json` for path mappings

### Issue: Registry Build Fails
**Solution**:
1. Verify component structure matches registry schema
2. Check `src/registry/registry-*.ts` files for syntax errors
3. Don't edit files in `src/__registry__/` or `public/r/`
4. Run `pnpm registry:internal:build` first to see specific errors

### Issue: Images Not Loading
**Solution**:
1. Verify path starts with `/assets/images/`
2. Check file exists in `public/assets/images/`
3. For tech stack: ensure icon exists for the `key` value
4. For dual theme icons: check both `-light.svg` and `-dark.svg` exist

### Issue: Theme Toggle Not Working
**Solution**:
1. Check `useTheme()` hook is imported from `next-themes`
2. Verify component is wrapped in `ThemeProvider`
3. Test both `KeyD` detection for Vietnamese keyboard

### Issue: Build Errors Related to Sharp/Images
**Solution**:
1. Ensure `sharp` is installed: `pnpm install sharp`
2. Check Next.js Image component has required props (width, height, alt)
3. For remote images: add domain to `next.config.ts` remotePatterns

## Code Quality Checklist (AI Self-Review)

Before submitting any code changes, verify:

- [ ] TypeScript types are explicit and correct
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Code is formatted (`pnpm format:write`)
- [ ] Type checking passes (`pnpm check-types`)
- [ ] Comments explain "why", not "what"
- [ ] Accessibility: ARIA labels, keyboard navigation, focus management
- [ ] Responsive: Works on mobile, tablet, desktop
- [ ] Theme support: Tested in both light and dark modes
- [ ] Performance: No unnecessary re-renders, images optimized
- [ ] No console.log() statements left in code
- [ ] Assets use local paths (no external CDN URLs)
- [ ] Registry auto-generated files were NOT manually edited

## Contributing

### Code Quality

- Run `pnpm lint` before committing
- Use `pnpm format:write` for code formatting
- Check types with `pnpm check-types`
- Follow Web Interface Guidelines strictly

### Testing Registry Components

- Test components in isolation
- Verify registry build process: `pnpm registry:build`
- Test installation via shadcn CLI: `npx shadcn add @ncdai/[component]`
- Check component works in both themes

---

## About This Project

**buituantu.com** is a personal portfolio website forked from [chanhdai.com](https://github.com/ncdai/chanhdai.com).

- **Owner**: Bùi Tuấn Tú (@utnautiub)
- **Original Author**: Nguyen Chanh Dai (@ncdai)
- **License**: MIT
- **Tech Stack**: Next.js 16, Tailwind CSS v4, TypeScript, shadcn/ui

**For AI Agents**: This document is maintained to help AI assistants work effectively with this codebase. If you find any information outdated or missing, please note it in your response to the user.
