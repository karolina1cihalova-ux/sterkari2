@AGENTS.md

# Stěrkaři (sterkari.cz)

Czech-only marketing site for stucco (stěrka) workshops: people learn to do stucco walls themselves, get tools and materials, then do it at home.

## Stack
- Astro 7 (static) + Tailwind CSS v4 via `@tailwindcss/vite` + React 19 via `@astrojs/react` (use React components as islands only where interactivity needs it, e.g. `<Comp client:load />`; plain Astro components otherwise). Brand tokens live in `src/styles/global.css` (`@theme static`).
- Font: DM Sans, self-hosted via `@fontsource-variable/dm-sans` (no Google Fonts requests: GDPR).
- Content/data: `src/data/sterky.ts` (structures, shades, rooms, nav).
- Inspirace installations: one Markdown file each in `src/content/inspirace/` (schema in `src/content.config.ts`), rendered as cards on the homepage and as detail pages at `/inspirace/<file-name>/`. File names ASCII only. Photos via `cover:` / `gallery:`; without a cover a generated texture is shown. `sample: true` shows a "placeholder" notice. `room`, `structure`, `shade` are optional: without a room the card shows only under "Vše"; without structure+shade the detail page skips the "Použitá stěrka" card (for techniques outside the six stuccos, e.g. Rozpraskaná stěna, Imitace plechu).
- Notifications: Sonner, one `<Toaster />` in `src/components/Notifications.tsx` (mounted once in Layout). From Astro scripts show one with `window.dispatchEvent(new CustomEvent('toast', { detail: { message, description, type } }))`.
- Restart the dev server after adding a new content collection, config file or npm dependency (use `--force` if a React island fails to hydrate).
- On Windows, run npm/npx as `npm.cmd` / `npx.cmd` (PowerShell script execution is disabled).

## Design rules (agreed with the owner)
- Follow the existing look of https://sterkaristerky.vercel.app/: DM Sans, ink `#1A1A1A`, terracotta `#C45C26`, paper `#F7F4EF` alternating with white, 10px radius.
- Buttons: 8px corners (`rounded-lg`), also filter pills, Stěrky tabs and the burger. Hover = "polished plaster": 2px lift + warm shadow, slight warm tint, one soft sheen sweep, arrow (`Arrow.astro`) nudges; same curve (`--ease-hover`) in and out; `.btn::after` keeps the whole button hoverable while lifted. No black↔white swaps. "Chci na workshop" (header + hero) and the hero's "Jak to funguje" are `btn-dark`.
- Header: logo `STĚRKAŘI.` always left, `CHCI NA WORKSHOP` always right, equal gaps around the menu; menu switches to the hamburger only when it no longer fits (measured in `Header.astro`).
- Layout: left-aligned, no centred sections. Each section has its own head pattern (hero: headline left, buttons right from 1140px, Inspirace heading + filters on one row, Jak to funguje split head aligned to the step grid, FAQ sticky heading column). FAQ and Rezervace (both paper) share one 1 : 2 grid; keep them aligned.
- Motion follows Emil Kowalski's design-engineering rules (`emil-design-eng` skill): custom ease-out curves, UI animations < 300ms, `scale(0.97)` on press, hover only on hover devices, respect `prefers-reduced-motion`.
- Czech typography: no single-letter word (a, i, k, o, s, u, v, z) at a line end — use `&nbsp;` in markup or `cz()` from `src/data/sterky.ts`. Prices `2 490 Kč`, dates `13. 3. 2027`.
- Stěrky section: after the six stuccos come extra tabs for every Inspirace entry with a cover and no `structure` (real photo in the preview, no shade picker/attributes, link to its page; "Chci tuhle stěrku" sends the name + photo to the booking chip).
- Shadows: warm brown only (tokens in `global.css`): `shadow-card` for white/paper panels and small cards, `shadow-float` for pictures and the booking form; Inspirace cards go card → float on hover; header gets a soft shadow once scrolled.
- Textures are generated SVG placeholders until real photos exist; mark examples as "ukázka"/"ilustrační".
