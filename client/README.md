# Eclecia ’26 — client

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Bun.
For the concept and design decisions see [../DESIGN.md](../DESIGN.md).

## Run

```bash
bun install
bun run dev          # http://localhost:3000
bun run build && bun run start
bun run lint
```

## File map

```
app/
├─ layout.tsx              fonts, metadata, root layout
├─ page.tsx                landing: frame, layers, scroll hooks, panel placement
├─ events/, our-tale/      sub-routes
├─ register/, schedule/    sub-routes
├─ sponsors/, team/        sub-routes
components/
├─ common/                 Header, Footer, GoldButton, PageFade, TransitionLink, ComingSoon
├─ home/                   Hero, Stats, Dates, Dusk, Finale sections + Overlay
└─ sponsors/               SponsorsView client component
constants/
├─ assets.ts               Cloudinary & fallback public asset registry
├─ scene.config.ts         ★ the only file you normally edit: layouts, text, timings
└─ navigation.ts           NAV_ITEMS, SOCIAL_LINKS, SPONSORSHIP_HEADS
lib/
├─ cloudinary.ts           Cloudinary asset URL builder & transform helper
└─ lqip.ts                 Low-Quality Image Placeholder (LQIP)
utils/
└─ track.ts                pose sampler (poseAt), easing helpers, sectionOpacity
styles/
└─ globals.css             tokens (gold, parchment), text-panel shadow, keyframes, theme
public/assets/             local static WebP/PNG assets
scripts/
├─ optimize-assets.mjs     PNG → WebP pipeline (sharp)
└─ upload-cloudinary.mjs   Batch uploader to sync public assets with Cloudinary
```

## Scene engine in one paragraph

Everything is authored in a 1512 × 864 frame that is cover-scaled to the viewport. `scene.config.ts` defines **sections**; each section is a resting layout giving every asset a centre (`x, y`), rendered width (`w`) and optional `rotate / opacity / flipX / flipY`. Sections have a `hold` window on the scroll track (0..1). `poseAt(asset, p, mobile)` returns the pose at progress `p`: the section’s pose inside a hold, an eased blend between neighbouring sections otherwise. `page.tsx` turns a pose into `translate(...) scale(...) rotate(...) scale(sx, sy)` on a plain `<img>`. Text panels are the same idea with `fadeIn/fadeOut` windows and an “emerge from the moon” slide.

## Config reference (`scene.config.ts`)

| Key | Meaning |
|---|---|
| `frame` | Authoring frame size. Don’t change. |
| `scrollVh` | Pinned track length in viewport heights. Lower = less scrolling. |
| `scrollSmoothing` | Fraction of remaining distance covered per frame (0 snap, ~0.1 floaty). |
| `orbitArcPx` | How far the moon bows off the straight line while travelling. |
| `layout.<section>` | `hold: [a, b]`, `arrive: "up" \| "down" \| "none"`, then one `Pose` per asset. |
| `Pose` | `{ x, y, w, rotate?, opacity?, flipX?, flipY? }` in frame px / degrees. |
| `mobileQuery` | Media query that switches to mobile mode. |
| `layoutMobile.<section>` | Partial per-asset overrides used in mobile mode. |
| `text.<name>` | `fadeIn`, `fadeOut`, `rect {x, y, w}` (frame px; x = left, y = centre), `align`, optional `scrim`, `z`. |
| `textMobile.<name>` | `{x, y, w}` as **viewport fractions** for mobile mode. |
| `textEmergeScale` | Panel scale at the start of its slide-out. |
| `textScrim` | Default halo `{ opacity, bleedPx }`. |
| `header.fadeIn` | When the header appears on the landing. |
| `sponsorsSpinDegPerPx` | Eclipse rotation per scrolled px on `/sponsors`. |

Sections in order: `hero → stats → events → dusk → finale`. Assets: `bg, rays, moon, minisun, suncover, mainart, bottom, veena, hand, bannerL, bannerR`.

Rules of thumb:
- Keep two consecutive keys identical to “hold” an asset; make them differ to move it.
- Park an asset off-frame (e.g. `y: 1400`) instead of `opacity: 0` so it slides in/out.
- Mobile visible band is roughly frame x ∈ [556, 956]; keep phone poses near `x: 756`.
- A flip that differs between two sections animates as a card flip during travel.

## Assets

- Add/replace a source PNG in `assets-src/`, add a line to `scripts/optimize-assets.mjs` (`[src, out, maxWidth, quality]`), run `node scripts/optimize-assets.mjs`.
- Reference the WebP from `LAYERS` in `page.tsx` (natural rect = the Figma rect for scene art, `0,0,w,h` for ornaments) and give every section a pose for the new `AssetId`.
- A layer can carry `mobile: { src, width, height }` to swap artwork in mobile mode (used by `mainart`).
- Paint order is the `z` on each layer: bg 10 · ornaments 12 · text panels 15 · rays 20 · moon 30 · minisun 40 · suncover 50 · mainart 60 · bottom 70. Hero wordmark uses `z: 65` to sit above the art.

## Adding a section

1. Add a block to `layout` with a `hold` window between its neighbours and a pose for **every** asset (copy the previous section and change what moves).
2. Add mobile overrides to `layoutMobile` if the desktop poses fall outside the phone band.
3. If it has text: add `text.<name>` + `textMobile.<name>`, a component in `sections.tsx`, and render it in `page.tsx` (`sectionOpacity`, `emergeFor`, `rectFor`).

## Known limitations / TODO

- Landscape phones get the desktop layout.
- `/register` and `/events` are placeholders; the brochure button expects `public/eclecia-26-brochure.pdf`.
- Dates are intentionally absent until the reveal.
- The in-app preview pane used during development throttles `requestAnimationFrame`; judge motion in a real browser.
