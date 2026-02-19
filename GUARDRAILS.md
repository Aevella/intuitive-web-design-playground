# Nudge Project Guardrails

## 1) Parameter Trust Model
- Playground values are **real CSS values** and should be copyable 1:1.
- Visual feeling may shift with container size, background complexity, and device pixel density.

## 2) Reference Environment (must be stated when sharing/exporting)
- Desktop reference viewport: **1440 x 900** at **100% zoom**
- Mobile reference viewport: **390 x 844** at **100% zoom**
- Current background color must be included in exported note

## 3) Parameter Semantics (must stay consistent)
- `padding-x`: **per-side value** (applies to left and right simultaneously)
- `padding-y`: **per-side value** (applies to top and bottom simultaneously)
- Do not silently reinterpret slider semantics across components.

## 4) Layout Rule
- Only `static` and `notify` can use split preview/control layout when requested.
- `interactive` and `alive` remain vertical unless explicitly changed by product decision.

## 5) Change Discipline
- Before visual refactor, preserve behavior and copy/export correctness.
- Any change touching shared core (`ElementCard`, `ParamSlider`, `CopyBadge`) requires:
  1) local build pass
  2) quick visual check for at least one element in each category
  3) update this guardrail file if rules changed
