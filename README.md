# Arnav Chachra: portfolio

Personal portfolio for Arnav Chachra, built with Next.js (App Router), React, strict TypeScript and Tailwind CSS, and hosted on Vercel.

- **Local setup on Windows (PowerShell):** [`docs/LOCAL-SETUP.md`](docs/LOCAL-SETUP.md)
- **Publishing it permanently (GitHub + Vercel, custom domain, rollbacks):** [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

---

## What's in the site

| Route                                             | What it is                                                                                                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                               | Hero with an interactive dataflow graph, About + toolkit, Experience, Projects (filterable gallery, architecture explorer, live GitHub list), Contact    |
| `/projects/[slug]`                                | One shareable case study per project: overview, problem, approach, interactive architecture, team vs personal scope, challenges, evaluation, screenshots |
| `/quick-view`                                     | Recruiter summary on one screen: education, experience, core skills, featured projects, contact. Prints cleanly.                                         |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | SEO and social sharing, all generated from the same data                                                                                                 |
| any unknown URL                                   | Custom 404                                                                                                                                               |

**Interactive features**

- **Command palette:** `Ctrl+K` / `Cmd+K` (or the `⌘K` button). Navigate sections, search projects by name or technology, open GitHub and LinkedIn, copy the email, toggle theme, toggle animated effects. Full keyboard support, ARIA combobox pattern, `Esc` closes and focus returns to where it was.
- **Architecture explorer:** pick a project, click a component (or use the arrow keys) to see what it does _in that project_ and what it sends and receives.
- **Project filters:** by Software engineering, Data analytics, AI and Full-stack, with counts and a screen-reader announcement.
- **Live GitHub repositories:** fetched on the server from the official GitHub REST API and cached for an hour. If GitHub is down or rate-limited, a plain profile link is shown and the page still works.
- **Dark and light themes:** dark is the default. The choice is remembered, and there is no flash of the wrong theme on load.
- **Copy-email button:** announces success, or the address itself if copying fails.

**Visual effects**

Everything is progressive enhancement: the content is all there without JavaScript or with effects off.

_The effects switch._ The ⚡ button in the header (or "Toggle animated effects" in the palette) turns every animation on or off. It starts from the operating system's "reduce motion" setting, so visitors who asked their computer for less motion get a calm page, and anyone can override it. The resolved choice lives on `<html data-motion="full|reduce">` (set before first paint by `src/lib/motion-script.ts`), CSS keys off that attribute, and components use `useReduceMotion()` from `src/lib/motion-pref.ts`. The server always renders the calm version and effects switch on right after hydration, so there are no hydration mismatches.

With effects on:

- **Particle constellation:** a canvas field of drifting points behind the hero that links up and lights in brass around the cursor (pauses off screen and in background tabs).
- **Cursor-lit grid and glow:** the hero and contact grids light up under the cursor, with two slow aurora orbs behind.
- **Hero scroll-out:** the intro shrinks, blurs and drifts away as you scroll past it (CSS scroll timeline).
- **Velocity marquee:** a ribbon of the toolkit's skills that speeds up, reverses and skews with your scroll speed.
- **Scroll-lit statement:** in About, a large statement lights up word by word as it scrolls through.
- **Projects reel:** on desktop the projects section pins and the projects slide past horizontally as you scroll, with giant outlined numbers. The filterable gallery below stays the accessible, keyboard-friendly version.
- **Custom cursor:** a trailing brass ring that grows over anything clickable and shows "View" over project cards. The normal cursor stays visible.
- **3D tilt with glare** on the project cards and the York Region card, **magnetic** hero buttons, **text scramble** on section titles, **inertial smooth scrolling** (Lenis), name reveal, counting facts, the graph auto-tour, card spotlights, scroll-driven reveals and a faint film grain.

- **Page morphs:** clicking a project makes its title and visual morph into the case-study page (React `<ViewTransition>`), and pages slide forward or back depending on direction. Browsers without the View Transitions API just navigate normally.
- **Case studies:** a huge title, a full-width visual with an outlined project number, a sticky section rail that tracks where you are, and a full-width "next case study" panel that floods brass on hover.
- **Contact:** a magnetic, spinning "send an email" badge.

Touch devices get the scroll effects but skip the cursor, tilt, magnetic and reel pieces.

No contact form on purpose. A form that pretends to send would be dishonest, and a real one needs an email provider and spam protection. `mailto:` plus copy-to-clipboard is reliable and free.

## Architecture

```
src/
  app/                      Routes (App Router)
    layout.tsx              Root layout, metadata, fonts, theme bootstrap
    page.tsx                Home page (composes sections)
    projects/[slug]/        Case study page + per-project OG image
    quick-view/             Recruiter summary
    not-found.tsx           404
    sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
    globals.css             Design tokens (colour, type, radii, spacing) + base styles
  components/
    home/                   Hero, About, Experience, Projects, Contact, system graph, GitHub list
    projects/               Gallery, code-drawn previews, architecture explorer
    command/                Command palette + provider (keyboard shortcut, context)
    layout/                 Header (desktop + mobile nav), footer, providers
    effects/                Particle field, cursor, marquee, reel helpers, tilt, magnetic, smooth scroll
    ui/                     Small reusable pieces: ButtonLink, Tag, ThemeToggle, MotionToggle, CopyEmailButton
    icons/                  GitHub and LinkedIn marks
  config/site.ts            Name, links, email, availability, sections               ← edit me
  data/                     projects.ts, experience.ts, skills.ts                    ← edit me
  types/content.ts          Types for all content
  lib/                      Pure logic: filtering, command search, GitHub client, SEO schemas, theme
  hooks/                    useActiveSection, useCopyToClipboard
tests/
  unit/                     Logic and content-integrity tests
  components/               Interaction tests (palette, filters, nav, explorer, copy, theme)
```

**Key decisions**

- **Content is data.** Every project, role and skill is a typed object in `src/data`. The gallery, case-study pages, sitemap, command palette, architecture explorer and structured data are all generated from it, so adding a project is a data change, not a component change.
- **Server first.** Pages are server components and are prerendered at build time. Only interactive pieces (header, palette, gallery, explorer, hero graph, copy button, theme toggle) ship client JavaScript.
- **Honest placeholders.** Missing facts (`pending: true`), screenshots (`src: null`) and links (`url: null`) render as clearly marked "To be added" placeholders instead of invented content. A test fails if a non-https link or a percentage-style model result sneaks into MarketLens.
- **Cache Components.** `cacheComponents` is on. The GitHub fetch uses `"use cache"` with `cacheLife("hours")` on success and `cacheLife("minutes")` on failure, so outages are not retried on every request.
- **Accessibility.** Semantic landmarks, skip link, visible focus rings, `aria-current` on the active section, roving tab index in the explorer, live regions for filters and copy feedback, 44px touch targets, and a motion switch that defaults to the OS reduce-motion setting and drives both CSS and Motion (`MotionConfig`).
- **Security.** No secrets in client code (`GITHUB_TOKEN` is server-only and optional). External links use `rel="noopener noreferrer"`. Security headers (HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are set in `next.config.ts`. No phone number or street address appears anywhere, including structured data.

**Design system**

Tokens live in `src/app/globals.css` and are exposed to Tailwind as semantic names (`bg-surface`, `text-muted`, `border-line`, `text-accent`...). Components never use raw hex values.

- Palette: warm near-black (`#161513`), warm off-white text (`#eee8df`), muted greys, one restrained brass accent (`#c8a26b`) and a slate secondary for "connected" states. The light theme mirrors every token.
- Type: Geist Sans and Geist Mono via `next/font` (self-hosted, no layout shift). One display size, then a 1.25-ish scale.
- Radii: `--radius-control` (6px) for controls, `--radius-panel` (10px) for panels. No pills.
- Contrast: measured ratios are listed at the top of `globals.css`, and axe checks pass (see QA below).

## Scripts

| Command             | Does                                                |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Development server on http://localhost:3000         |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` with strict mode                     |
| `npm test`          | Vitest + Testing Library (55 tests)                 |
| `npm run build`     | Production build                                    |
| `npm start`         | Serve the production build                          |
| `npm run format`    | Prettier (with Tailwind class sorting)              |
| `npm run check`     | lint + typecheck + test + build in one go           |

## Maintaining the site

Everything personal is in **four files**. You should not need to touch components.

### Contact details, links, availability: `src/config/site.ts`

Change `email`, `links.github`, `links.linkedin`, `availability.label` and so on. When you have accepted an offer, set `availability.open` to `false` and the hero badge disappears.

### Experience and education: `src/data/experience.ts`

Dates use `"YYYY-MM"`. Booster Juice and The Social Bar have `start: null` / `end: null` because the dates weren't provided. Add them (e.g. `start: "2022-05"`, `end: "2024-08"`) and they will show automatically. Set `end: null` with a start date to show "Present".

### Projects: `src/data/projects.ts`

**Fill in a placeholder:** find the item with `pending: true`, replace the text with the real detail and delete `pending: true`.

**Add a repository or demo link:**

```ts
repository: { url: "https://github.com/chachraarnav/marketlens" },
demo: { url: "https://marketlens.streamlit.app" },
```

**Add a demo recording** (the biggest upgrade you can make). Record 10–15 seconds of the project in use, export it as MP4 (H.264, 1600px wide, no audio, ideally under 5 MB), put it in `public/projects/`, then add to the project:

```ts
video: {
  src: "/projects/marketlens-demo.mp4",
  poster: "/projects/marketlens-poster.jpg", // optional still frame
  label: "MarketLens dashboard comparing ETF volatility",
},
```

It replaces the drawn schematic everywhere (gallery, reel, case study). It autoplays muted on a loop while effects are on and on screen; with effects off it waits for the visitor to press play.

**Add a screenshot:** put the image in `public/projects/` (e.g. `public/projects/marketlens-dashboard.png`), then:

```ts
screenshots: [
  { src: "/projects/marketlens-dashboard.png", alt: "MarketLens dashboard comparing ETF volatility", caption: "Dashboard overview", width: 1600, height: 1000 },
],
```

`width` and `height` should be the image's real pixel size. Next.js resizes and converts it to AVIF/WebP automatically. For EMAK, use anonymized data only.

**Add a whole project:** copy an existing object in the `projects` array, give it a new unique `slug` (lowercase, hyphens) and fill it in. The new case-study URL, gallery card, sitemap entry, palette command and architecture tab appear automatically. `npm test` will catch broken architecture edges, unknown categories or bad links.

### Skills: `src/data/skills.ts`

Each skill can point to the projects (`projects: ["marketlens"]`) or roles (`experience: ["york-region"]`) that demonstrate it. `coreSkills` is the short list on the recruiter quick view.

### No resume on the site

There's deliberately no resume download, because the resume is tailored per application. Send it directly with each application; the site links to email, GitHub and LinkedIn instead.

## Quality assurance (what was actually run)

On the build environment (Linux, Node 22) before handoff:

- `npm run lint`: no errors or warnings
- `npm run typecheck`: no errors
- `npm test`: 55 tests passing across 6 files
- `npm run build`: successful, all pages prerendered
- Every route returned the expected HTTP status in the production server (`/`, `/quick-view`, all four case studies, `/robots.txt`, `/sitemap.xml`, OG image, favicon; unknown URLs → 404)
- Playwright at 1440px, 820px and 375px, in both themes: no horizontal page overflow, no text smaller than 11px
- axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practices) on every page, in both themes and at all three widths, once with effects off and once with effects on (measured at rest): no violations. The marquee and the projects reel are excluded as decorative duplicates of content that is checked
- Headless Chromium with effects on: no console errors or hydration warnings, Lenis active, every effect screenshotted and reviewed

**Not yet measured:** Lighthouse scores (run them on the deployed URL with Chrome DevTools → Lighthouse), real devices and screen readers, and the live GitHub list (the build sandbox couldn't reach api.github.com, so only the fallback path was exercised).
