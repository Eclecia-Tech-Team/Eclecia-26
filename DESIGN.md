# Eclecia ’26 — Design notes

This is the record of what we were going for, how the scene works, and why some things were kept or dropped. Read this before changing the choreography.

## 1. Concept

**One scene, one eclipse, one scroll.** The Figma hero (dancer, masked figure, musician, lotus, a black sun with a gold corona) is treated as a stage set. Scrolling doesn’t move the page; it advances a story told by the same set of layers:

1. **Hero** — the poster as painted. Wordmark bottom-centre: “Heritage Institute of Technology, Kolkata · presents · ECLECIA”.
2. **Stats** — foreground art clears, the eclipse glides to the left edge and grows; fest copy and four numbers appear on the right.
3. **Events** — eclipse arcs over to the right edge; event categories on the left.
4. **Dusk** — eclipse comes to centre and shrinks; two mirrored mask-and-sitar banners frame it. A breath before the end.
5. **Finale** — a hill-and-road landscape rises from below while the eclipse sinks behind it: a setting eclipse. One closing line above.

Theme words we kept coming back to: **black, gold, Indian art forms, eclipse, theatre curtain.** Copy is about performance and culture, not space. The moon is called “the eclipse” in copy, never “moon”.

## 2. Visual language

- **Palette:** near-black `#050507`, gold `#d9a441`, parchment `#ece4d2`. Gold is for emphasis (italic second line of a title, numbers, ornaments). Body text is parchment at 70–75 %.
- **Type:** Cormorant Garamond for display (semibold roman + italic gold), Geist Sans for the one “sober” line (HITK presenter line), Geist Mono for eyebrows and labels in uppercase with wide tracking.
- **Ornaments** (all from the art set, WebP):
  - lotus divider under every title (replaces a generic rule + glyph),
  - veena with lotus ribbons anchoring the stats corner,
  - mudra hand with bells peeking into the events corner,
  - vertical mask-and-sitar banner, mirrored, framing the dusk beat.
- **Legibility:** every text panel has a soft radial dark halo behind it plus a faint text shadow. The halo is a six-stop gradient that reaches zero at the element edge (an earlier two-stop version showed a visible ring). Per-panel override exists; the events panel runs with no halo because the sky there is already dark.

## 3. How the scene works (mental model)

- **The frame.** Everything is authored in the Figma frame, 1512 × 864. The frame is cover-scaled to the viewport (fills width and height, crops the long axis) and centred. All coordinates in config are frame px.
- **Sections and poses.** Each section is a *resting layout*: for every asset, where its centre sits (`x, y`), how wide it renders (`w`), plus optional `rotate`, `opacity`, `flipX/flipY`. Sections have a `hold` window on the scroll track; between two holds every asset eases from one pose to the next. There is no separate “animation” layer, transitions are derived from the resting layouts.
- **Orbit arcs.** The moon and its rays bow off the straight line when travelling (`arrive: up | down | none` per section). Hero→stats bows down, stats→events bows up.
- **Text emergence.** Text panels sit *under* the moon layers and start at the moon’s current centre, scaled down; as the moon travels they slide out to their rect. The moon physically uncovers the text.
- **Inertia.** Scroll progress eases toward the scrollbar each frame (`scrollSmoothing`), so wheel ticks glide instead of stepping. The loop sleeps when settled.
- **Header.** Shared across pages; on the landing it fades in as the hero art clears.

## 4. Mobile / portrait

Portrait viewports (or ≤ 820 px) switch to a second layout:

- The frame is still cover-scaled, so only the middle ~400 frame px are visible. Mobile poses keep the moon at `x ≈ 756`, top-centre, smaller.
- Text panels leave the frame and live in a viewport layer, positioned by viewport fractions, with compact typography (2-col stats, single-line events).
- A portrait re-composition of the hero art (`mainart-mobile`) replaces the landscape one; it’s nudged down to open a sky band where a smaller eclipse sits.
- Ornaments and the sun-cover are parked off-frame on phones.
- Landscape phones are not specially handled (they get the desktop layout, cramped).

## 5. Things we tried and dropped

- **3D moon (three.js).** Built a full GLB pipeline: black-and-gold material, normal and emissive maps, scroll-driven camera zoom and rotation. It looked good but felt heavier and “spacey”, and a WebGL context bug caused flashes. Removed entirely; the PNG eclipse with a rotating top layer gives the same read at zero cost.
- **Zoom-to-black transition.** Early version zoomed the eclipse until it filled the screen and the page went black. Replaced by the travelling-moon story: sections get a landmark instead of a blackout.
- **“Middle” frame PNGs** (a decorative frame that zoomed out / slid up as a section background). Looked flat next to the moving eclipse. Dropped.
- **Sponsors as the landing’s tail.** A sponsors page that scrolled up over the settled scene, and later a four-column footer on the landing. Both diluted the ending. The landing now ends on the finale; sponsorship lives on `/sponsors` with a one-line footer.
- **Dates in copy.** Removed everywhere until the reveal.

## 6. Performance choices

- All art is WebP re-encoded from the PNG sources (roughly 60 MB → under 5 MB served). Sources live in `assets-src/`, never in `public/`.
- Layers are plain `<img>` with `translate3d`/`will-change`; one React state update per animation frame; immutable cache headers on `/assets/opt`.
- No WebGL, no runtime image processing.

## 7. Content rules

- Real numbers come from the ’26 sponsorship brochure. Landing shows Days / Events / Colleges / Footfall; `/sponsors` shows the *other* numbers (social reach, students involved, cities, previous attendance) so nothing repeats.
- Event categories and names match the brochure.
- Sponsorship heads, emails and phones are in one place (`client/app/Footer.tsx`).
- Anything marked `TODO(content)` is a placeholder.

## 8. Tuning cheatsheet

Everything lives in `client/app/scene.config.ts`:

| Want to… | Edit |
|---|---|
| Move/resize an asset in a section | `layout.<section>.<asset>` (`x, y, w, rotate, opacity, flipX, flipY`) |
| Change how long a section holds | `layout.<section>.hold` |
| Change the moon’s arc into a section | `layout.<section>.arrive` |
| Change total scroll length | `scrollVh` |
| Make scrolling snappier/floatier | `scrollSmoothing` |
| Move a text panel | `text.<name>.rect` (desktop) / `textMobile.<name>` (phones) |
| Change when text appears | `text.<name>.fadeIn / fadeOut` |
| Darken/lighten a panel’s halo | `textScrim` or `text.<name>.scrim` |
| Mobile-specific poses | `layoutMobile.<section>` |
| Sponsors-page eclipse spin | `sponsorsSpinDegPerPx` |
