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

## Fresh machine setup

Everything needed to run this project on a new Windows machine.

> **Path rule:** the build/verify scripts hard-code `D:\projects\cheapino\...`, so the project
> must live at `D:\projects\cheapino` — anywhere else and every script fails to find its files.

### Prerequisites

| Need | Where (official) |
|---|---|
| Windows 10/11 | — |
| Git for Windows | https://git-scm.com/download/win |
| Python 3.12 on PATH as `python` (stdlib only — no pip installs) | https://www.python.org/downloads/windows/ |
| QMK MSYS — *firmware builds only* | https://msys.qmk.fm/ |

Check: `python --version` and `git --version`.

### Run the site locally

No build step. Open `index.html` directly, or serve the folder:

```powershell
python -m http.server 8000
# then open http://localhost:8000
```

### Layout workflow (the 90% case — no firmware toolchain)

Edit `script\build_sticky.py`, never the `.vil` by hand. Then rebuild and verify:

```powershell
python "D:/projects/cheapino/script/build_sticky.py"
python "D:/projects/cheapino/script/validate_vil.py"   "D:/projects/cheapino/layouts/sticky-key/cheapino-vial-sticky.vil"
python "D:/projects/cheapino/script/check_identical.py" "D:/projects/cheapino/layouts/sticky-key/cheapino-vial-sticky.vil"
python "D:/projects/cheapino/script/scenario_sim.py"
```

Expected: `scenario_sim.py` → `CHECKS: 67/67`; `validate_vil.py` → `PASS` (two warnings are
normal: thumb `MO` instead of `TD`, and no volume encoder).

### Load the layout onto the keyboard

Open https://vial.rocks (or the Vial desktop app: https://get.vial.today/) and load
`layouts\sticky-key\cheapino-vial-sticky.vil`.

### Rebuild the firmware (optional)

```powershell
git clone -b cheapinov2 https://github.com/tompi/vial-qmk D:\projects\vial-qmk
qmk compile -kb cheapino -km vial      # -> cheapino_vial.uf2
```

Flash: hold **BOOT**, plug in USB, drag `cheapino_vial.uf2` onto the `RPI-RP2` drive
(`qmk flash` auto-detection fails on current Windows).

### Footguns

- **Never hand-edit a `.vil`** — `build_sticky.py` overwrites it on the next run. Edit the script.
- **Repo path is load-bearing** — must be `D:\projects\cheapino`.
- **The left half is mirrored in the matrix** — cols 6→10 run `T R E W Q`; use `rev()` in
  `build_sticky.py`.

## License

MIT