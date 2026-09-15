# Eclecia ’26 

Website for **Eclecia**, the annual cultural fest of Heritage Institute of Technology, Kolkata.
A scroll-driven, single-scene landing page built around a black-and-gold eclipse and Indian art forms, plus sponsorship and placeholder pages.

- **Design rationale and decisions:** [DESIGN.md](DESIGN.md)
- **Developer docs (config reference, asset pipeline, how-tos):** [client/README.md](client/README.md)

## Repository layout

```
eclecia_v2/
├─ README.md            ← you are here
├─ DESIGN.md            ← concept, choreography, what we tried and dropped
└─ client/              ← Next.js 16 app (App Router, Tailwind v4, Bun)
   ├─ app/              ← pages, scene engine, config
   ├─ public/assets/opt ← optimised WebP assets served to users
   ├─ assets-src/       ← original PNG/SVG sources (not served)
   └─ scripts/          ← asset optimisation
```

## Quick start

```bash
cd client
bun install
bun run dev        # http://localhost:3000
```

Other scripts: `bun run build`, `bun run start`, `bun run lint`, `node scripts/optimize-assets.mjs`.

## Routes

| Route | What |
|---|---|
| `/` | Landing: pinned scroll scene → hero, stats, events, dusk, finale |
| `/sponsors` | Sponsorship page: gratitude wall, partner CTA, sponsorship heads, About HITK |
| `/events` | Coming-soon placeholder |
| `/register` | Coming-soon placeholder |

## Status

- Desktop and mobile/portrait layouts done.
- Dates deliberately not shown anywhere yet (pre-reveal).
- Registration and full event listings are placeholders until content lands.
- Brochure button on `/sponsors` expects `client/public/eclecia-26-brochure.pdf`.
