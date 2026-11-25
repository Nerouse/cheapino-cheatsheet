# cheapino-cheatsheet

Interactive reference for the Cheapino v2 keymap — a web app that renders any Vial `.vil` profile
layer by layer, explains every key in plain language on hover, and tells the design story.

Built with vanilla HTML, CSS and JavaScript. No frameworks, no build step.

## Pages

- **Keymap** — visual keyboard per layer, hover any key for a branching callout explaining what it does
- **Guide** — data-driven legend: layers, triggers, colours, sticky chains and a per-layer key table
- **Story** — how the layout evolved: five generations, the philosophy, and how the whole system works
- **Files** — browser for profiles and firmware
- **Repo** — GitHub link

## Keyboard Profiles

| File | Description |
|---|---|
| `cheapino-vial-sticky.vil` | **Final layout** — hold-to-peek layers, one-shot modifiers, MOUSE + F-KEYS sub-layers, 3-mode knob (loaded by default) |
| `cheapino-vial-combo.vil` | Superseded — tap latches a layer, hold is momentary (tap-dance) |
| `cheapino-vial-layout.vil` | Superseded — pure momentary layers on three thumb keys |
| `cheapino-vial-stock.vil` | Baseline — stock Vial config, also the build template |

Source of truth for these files: `D:\projects\cheapino\layouts\` (one folder per design family,
with the build and validation scripts in `D:\projects\cheapino\script\`).

## License

MIT