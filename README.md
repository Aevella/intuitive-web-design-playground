# Nudge — Design Parameter Playground

A tactile UI parameter playground for testing **real, copyable CSS** across four categories:

- Static
- Interactive
- Alive
- Notify

Core interaction: click an element card, adjust sliders, then copy CSS from the card footer.

## Why this exists

Nudge is not a component gallery. It is a perception trainer for micro-interaction quality: spacing, timing, motion, glow, density, and environmental texture.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Project map

- `src/components/core` — shared cards/slider/copy behavior
- `src/components/elements` — category element modules
- `src/context` — background + luminance context
- `src/data/registry.js` — element registry
- `src/utils` — color/utility helpers
- `public/sw.js` + `manifest.webmanifest` — PWA shell

## Guardrails

Single source of truth: `GUARDRAILS.md`

## Notes for reviewers

- Exported CSS is intended to be 1:1 usable.
- Visual feel still depends on viewport/background/context (documented in guardrails).
