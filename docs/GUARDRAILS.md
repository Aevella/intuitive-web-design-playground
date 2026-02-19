# Design Parameter Playground — Guardrails

## Why this exists
Keep playground output trustworthy and maintainable: values should be copyable, behavior should be predictable, and future edits should stay consistent.

## Reference baseline (fixed)
- Desktop reference viewport: **1440 x 900** at **100% zoom**
- Mobile reference viewport: **390 x 844** at **100% zoom**
- Font baseline: **IBM Plex Mono**
- Background baseline: current global background color (`BgContext.bg`)

## Value truth rule
- Playground numeric values map to real CSS values **1:1**.
- Visual feeling may still differ across container size/background/context.
- Copy output must include reference comment header (viewport + background + note).

## Parameter semantics rule
- Labels must declare semantics where ambiguity exists.
- `padding-x` means: **per-side value, applied to left and right simultaneously**.
- Do not silently change semantics of existing sliders.

## Layout rule
- Only categories explicitly requested can diverge in layout mode.
- Current policy:
  - `static`, `notify`: split preview/controls layout
  - `interactive`, `alive`: vertical layout
- Any extension of split layout to other categories requires explicit approval.

## Interaction rule
- Preserve existing behavior by default.
- Additive interactions (e.g. tap lock) must not break desktop hover behavior.
- For behavior changes, prefer opt-in or explicit user request.

## Maintenance rule (for Corveil)
Before shipping UI changes:
1. Verify no duplicated logic was introduced in multiple components.
2. Keep shared behavior in core components/utilities whenever possible.
3. Run build (`npm run build`) and ensure deploy is healthy.
4. Keep this file updated if rules or reference baselines change.
