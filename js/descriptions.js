/* cheapino-cheatsheet — keycode descriptions in plain language.
   Pure data + pure functions (no DOM) so it can be unit-tested in node. */

var LAYER_COLORS = ["#8b95a8", "#eab308", "#a855f7", "#22d3ee", "#3b82f6", "#ef4444"];

var CAT_COLORS = {
  type: "#94a3b8", sym: "#34d399", nav: "#38bdf8", edit: "#fb923c",
  win: "#f472b6", mouse: "#22d3ee", media: "#e879f9", mod: "#fbbf24",
  sys: "#a3a3a3", layer: "#eab308", none: "#55555e"
};

var CAT_LABELS = {
  type: "typing", sym: "numbers & symbols", nav: "navigation",
  edit: "editing & shortcuts", win: "windows & apps", mouse: "mouse",
  media: "media & lights", mod: "modifier", sys: "system",
  layer: "layer switch", none: "pass-through"
};

var KC_INFO = {};
function _ki(code, title, detail, cat) { KC_INFO[code] = { t: title, d: detail, c: cat }; }

/* ── letters, digits, symbols ─────────────────────────────── */
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function(L) {
  _ki("KC_" + L, "Letter " + L, "Types " + L.toLowerCase() + " (hold Shift for a capital).", "type");
});
"1234567890".split("").forEach(function(D) {
  _ki("KC_" + D, "Digit " + D, "Types " + D + ".", "sym");
});

var BASE_SYMBOLS = {
  KC_MINUS: ["-", "minus"], KC_EQUAL: ["=", "equals"], KC_LBRACKET: ["[", "left bracket"],
  KC_RBRACKET: ["]", "right bracket"], KC_BSLASH: ["\\", "backslash"], KC_SCOLON: [";", "semicolon"],
  KC_QUOTE: ["'", "quote"], KC_GRAVE: ["`", "backtick"], KC_COMMA: [",", "comma"],
  KC_DOT: [".", "period"], KC_SLASH: ["/", "slash"], KC_KP_MINUS: ["-", "numpad minus"],
  KC_KP_PLUS: ["+", "numpad plus"]
};
Object.keys(BASE_SYMBOLS).forEach(function(code) {
  var s = BASE_SYMBOLS[code];
  _ki(code, s[0], "Types " + s[1] + " (" + s[0] + ").", "sym");
});

/* LSFT(base) -> [symbol, spoken base name] */
var SHIFTED = {
  KC_0: [")", "zero"], KC_1: ["!", "one"], KC_2: ["@", "two"], KC_3: ["#", "three"],
  KC_4: ["$", "four"], KC_5: ["%", "five"], KC_6: ["^", "six"], KC_7: ["&", "seven"],
  KC_8: ["*", "eight"], KC_9: ["(", "nine"], KC_MINUS: ["_", "minus"], KC_EQUAL: ["+", "equals"],
  KC_LBRACKET: ["{", "left bracket"], KC_RBRACKET: ["}", "right bracket"], KC_BSLASH: ["|", "backslash"],
  KC_SCOLON: [":", "semicolon"], KC_QUOTE: ["\"", "quote"], KC_COMMA: ["<", "comma"],
  KC_DOT: [">", "period"], KC_SLASH: ["?", "slash"], KC_GRAVE: ["~", "backtick"]
};

/* ── named keys ───────────────────────────────────────────── */
_ki("KC_SPACE", "Space", "Adds a space.", "sym");
_ki("KC_ENTER", "Enter", "Confirms / starts a new line.", "sys");
_ki("KC_BSPACE", "Backspace", "Deletes the character behind the cursor.", "sys");
_ki("KC_TAB", "Tab", "Indents, or jumps to the next field / link.", "nav");
_ki("KC_ESCAPE", "Escape", "Cancels, closes menus and dialogs, exits fullscreen.", "sys");
_ki("KC_DELETE", "Delete", "Deletes the character ahead of the cursor.", "sys");
_ki("KC_INS", "Insert", "Toggles insert/overwrite mode.", "sys");
_ki("KC_INSERT", "Insert", "Toggles insert/overwrite mode.", "sys");
_ki("KC_LSHIFT", "Shift", "Hold for capitals and symbols.", "mod");
_ki("KC_RSHIFT", "Shift", "Hold for capitals and symbols.", "mod");
_ki("KC_LCTRL", "Ctrl", "Hold for shortcuts (Ctrl+C, Ctrl+F5, …).", "mod");
_ki("KC_RCTRL", "Ctrl", "Hold for shortcuts (Ctrl+C, Ctrl+F5, …).", "mod");
_ki("KC_LALT", "Alt", "Hold for shortcuts (Alt+Tab, …).", "mod");
_ki("KC_RALT", "Alt", "Hold for shortcuts (Alt+Tab, …).", "mod");
_ki("KC_CAPS", "Caps Lock", "Toggles Caps Lock.", "sys");
_ki("KC_HOME", "Home", "Jump to the start of the line.", "nav");
_ki("KC_END", "End", "Jump to the end of the line.", "nav");
_ki("KC_PGUP", "Page Up", "Scroll one screen up.", "nav");
_ki("KC_PGDOWN", "Page Down", "Scroll one screen down.", "nav");
_ki("KC_LEFT", "Left arrow", "Move the cursor left.", "nav");
_ki("KC_RIGHT", "Right arrow", "Move the cursor right.", "nav");
_ki("KC_UP", "Up arrow", "Move the cursor up.", "nav");
_ki("KC_DOWN", "Down arrow", "Move the cursor down.", "nav");
_ki("KC_MPLY", "Play / Pause", "Plays or pauses media.", "media");
_ki("KC_MUTE", "Mute", "Mutes the system audio.", "media");
_ki("KC_VOLU", "Volume up", "Turns the volume up.", "media");
_ki("KC_VOLD", "Volume down", "Turns the volume down.", "media");
_ki("KC_MNXT", "Next track", "Skips to the next media track.", "media");
_ki("KC_MPRV", "Previous track", "Goes back to the previous track.", "media");
_ki("KC_PSCREEN", "Print Screen", "Copies a screenshot of the screen to the clipboard.", "sys");
_ki("KC_WH_U", "Scroll up", "Scrolls up (mouse wheel).", "mouse");
_ki("KC_WH_D", "Scroll down", "Scrolls down (mouse wheel).", "mouse");
_ki("KC_WH_L", "Scroll left", "Scrolls left (horizontal wheel).", "mouse");
_ki("KC_WH_R", "Scroll right", "Scrolls right (horizontal wheel).", "mouse");
_ki("KC_MS_U", "Mouse up", "Moves the pointer up.", "mouse");
_ki("KC_MS_D", "Mouse down", "Moves the pointer down.", "mouse");
_ki("KC_MS_L", "Mouse left", "Moves the pointer left.", "mouse");
_ki("KC_MS_R", "Mouse right", "Moves the pointer right.", "mouse");
_ki("KC_BTN1", "Left click", "Clicks the left mouse button.", "mouse");
_ki("KC_BTN2", "Right click", "Clicks the right mouse button.", "mouse");
_ki("KC_BTN3", "Middle click", "Clicks the middle mouse button.", "mouse");
_ki("RGB_MOD", "Next lighting effect", "Cycles the RGB underglow to the next effect.", "media");
_ki("RGB_RMOD", "Previous lighting effect", "Cycles the RGB underglow to the previous effect.", "media");

"F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12".split(" ").forEach(function(F) {
  _ki("KC_" + F, F, "The " + F + " function key.", "sys");
});

/* ── editing & app shortcuts ──────────────────────────────── */
_ki("LCTL(KC_C)", "Copy", "Ctrl+C — copies the selection to the clipboard.", "edit");
_ki("LCTL(KC_V)", "Paste", "Ctrl+V — pastes the clipboard at the cursor.", "edit");
_ki("LCTL(KC_X)", "Cut", "Ctrl+X — cuts the selection to the clipboard.", "edit");
_ki("LCTL(KC_Z)", "Undo", "Ctrl+Z — undoes the last edit.", "edit");
_ki("LCTL(KC_Y)", "Redo", "Ctrl+Y — redoes the undone edit.", "edit");
_ki("LCTL(KC_A)", "Select all", "Ctrl+A — selects everything.", "edit");
_ki("LCTL(KC_S)", "Save", "Ctrl+S — saves the current file.", "edit");
_ki("LCTL(KC_H)", "Find & replace", "Ctrl+H — opens find & replace.", "edit");
_ki("LCTL(KC_D)", "Select next match", "Ctrl+D — VS Code: add the next match to the selection · Browser: bookmark.", "edit");
_ki("LCTL(KC_L)", "Focus address bar", "Ctrl+L — browser: focus the address bar · Excel: filter.", "edit");
_ki("LCTL(KC_N)", "New window", "Ctrl+N — opens a new window or document.", "edit");
_ki("LCTL(KC_T)", "New tab", "Ctrl+T — opens a new browser tab.", "edit");
_ki("LCTL(KC_W)", "Close tab", "Ctrl+W — closes the current tab or window.", "edit");
_ki("LCTL(KC_TAB)", "Next tab", "Ctrl+Tab — switches to the next tab.", "edit");
_ki("C_S(KC_TAB)", "Previous tab", "Ctrl+Shift+Tab — switches to the previous tab.", "edit");
_ki("C_S(KC_T)", "Reopen closed tab", "Ctrl+Shift+T — reopens the last closed tab.", "edit");
_ki("C_S(KC_P)", "Command palette", "Ctrl+Shift+P — VS Code: open the command palette.", "edit");
_ki("C_S(KC_E)", "Explorer panel", "Ctrl+Shift+E — VS Code: toggle the Explorer panel.", "edit");
_ki("LCTL(KC_BSPACE)", "Delete previous word", "Ctrl+Backspace — deletes the word before the cursor.", "edit");
_ki("LCTL(KC_LEFT)", "Word left", "Ctrl+Left — jumps one word to the left.", "edit");
_ki("LCTL(KC_RIGHT)", "Word right", "Ctrl+Right — jumps one word to the right.", "edit");
_ki("LCTL(KC_PGUP)", "Previous tab", "Ctrl+PgUp — previous tab (browser) or sheet (Excel).", "edit");
_ki("LCTL(KC_PGDOWN)", "Next tab", "Ctrl+PgDn — next tab (browser) or sheet (Excel).", "edit");
_ki("LCTL(KC_F5)", "Run without debugging", "Ctrl+F5 — VS Code: run · Browser: hard refresh.", "edit");
_ki("LALT(KC_LEFT)", "Back", "Alt+Left — go back (browser / explorer).", "win");
_ki("LALT(KC_RIGHT)", "Forward", "Alt+Right — go forward (browser / explorer).", "win");
_ki("LALT(KC_F4)", "Close program", "Alt+F4 — closes the active window.", "win");
_ki("LALT(KC_TAB)", "Switch windows", "Alt+Tab — cycles through open windows and apps.", "win");

/* ── Windows shortcuts ────────────────────────────────────── */
_ki("LGUI(KC_TAB)", "Task View", "Win+Tab — window overview / virtual desktops.", "win");
_ki("LGUI(KC_LEFT)", "Snap window left", "Win+Left — snaps the window to the left half.", "win");
_ki("LGUI(KC_RIGHT)", "Snap window right", "Win+Right — snaps the window to the right half.", "win");
_ki("LGUI(KC_UP)", "Maximise window", "Win+Up — maximises the window.", "win");
_ki("LGUI(KC_DOWN)", "Minimise window", "Win+Down — minimises / restores the window.", "win");
_ki("LGUI(KC_D)", "Show desktop", "Win+D — shows or hides the desktop.", "win");
_ki("LGUI(KC_E)", "File Explorer", "Win+E — opens File Explorer.", "win");
_ki("LGUI(KC_P)", "Display mode", "Win+P — choose how displays are used (project / extend).", "win");
_ki("LGUI(KC_Z)", "Snap layouts", "Win+Z — opens the Snap Layouts picker (Windows 11).", "win");
_ki("LGUI(KC_PSCREEN)", "Screenshot to file", "Win+PrtSc — saves a screenshot to Pictures\\Screenshots.", "win");
_ki("SGUI(KC_S)", "Screenshot snip", "Win+Shift+S — snip a region with the Snipping Tool.", "win");
_ki("SGUI(KC_LEFT)", "Move to left monitor", "Win+Shift+Left — moves the window to the other monitor (left).", "win");
_ki("SGUI(KC_RIGHT)", "Move to right monitor", "Win+Shift+Right — moves the window to the other monitor (right).", "win");
_ki("SGUI(KC_UP)", "Stretch to top", "Win+Shift+Up — stretches the window to the top edge.", "win");
_ki("SGUI(KC_DOWN)", "Restore window", "Win+Shift+Down — restores a stretched window.", "win");
_ki("LCG(KC_LEFT)", "Previous desktop", "Ctrl+Win+Left — switches to the previous virtual desktop.", "win");
_ki("LCG(KC_RIGHT)", "Next desktop", "Ctrl+Win+Right — switches to the next virtual desktop.", "win");
_ki("LCG(KC_D)", "New desktop", "Ctrl+Win+D — creates a new virtual desktop.", "win");
_ki("LCG(KC_F4)", "Close desktop", "Ctrl+Win+F4 — closes the current virtual desktop.", "win");

/* ── describeKC: keycode -> {t: title, d: detail, c: category, chip?} ── */
var _MOD_PREFIX = [
  ["C_S(", "Ctrl+Shift"], ["LCG(", "Ctrl+Win"], ["SGUI(", "Win+Shift"], ["LCA(", "Ctrl+Alt"],
  ["LCTL(", "Ctrl"], ["RCTL(", "Ctrl"], ["LSFT(", "Shift"], ["RSFT(", "Shift"],
  ["LALT(", "Alt"], ["RALT(", "Alt"], ["LGUI(", "Win"], ["RGUI(", "Win"]
];

var _OSM_MODS = {
  LSFT: "Shift", RSFT: "Shift", LCTL: "Ctrl", RCTL: "Ctrl",
  LALT: "Alt", RALT: "Alt", LGUI: "Win", RGUI: "Win"
};
var _OSM_HINTS = {
  Ctrl: "Tap it, then F5 to get Ctrl+F5.", Alt: "Tap it, then Tab to get Alt+Tab.",
  Shift: "Tap it, then a letter to capitalise it, or End to select to the line end.",
  Win: "Tap it, then a shortcut letter (e.g. D for the desktop)."
};

function _layerName(ctx, idx) {
  var names = (ctx && (ctx.layerFull || ctx.layerNames)) || [];
  return names[idx] || ("Layer " + idx);
}

function describeKC(code, ctx) {
  if (!code || code === "KC_NO") return null;
  if (code === "KC_TRNS") {
    return { t: "Pass-through", d: "No change on this layer — the key from the layer below is used.", c: "none" };
  }
  var m = code.match(/^(MO|TG|TO|TT)\((\d+)\)$/);
  if (m) {
    var idx = parseInt(m[2], 10);
    var name = _layerName(ctx, idx);
    var chip = { idx: idx, name: name };
    if (m[1] === "MO") return { t: name, d: "Hold — active only while this key is down. Release to return.", c: "layer", chip: chip };
    if (m[1] === "TG") {
      var extra = "";
      if (ctx && ctx.subLayerClear && ctx.subLayerClear.indexOf(idx) !== -1) {
        extra = " Clears automatically when NAV is released.";
      }
      return { t: name, d: "Tap to toggle this layer on/off." + extra, c: "layer", chip: chip };
    }
    if (m[1] === "TO") return { t: name, d: "Jumps straight to this layer.", c: "layer", chip: chip };
    return { t: name, d: "Tap to toggle, or hold to use it momentarily.", c: "layer", chip: chip };
  }
  m = code.match(/^TD\((\d+)\)$/);
  if (m) {
    var e = ctx && ctx.tapDance ? ctx.tapDance[parseInt(m[1], 10)] : null;
    if (e) {
      var hold = describeKC(e[1], ctx);
      var tap = describeKC(e[0], ctx);
      var bits = [];
      if (hold) bits.push("Hold — " + hold.t + (hold.d ? ": " + hold.d : ""));
      if (tap) bits.push("Tap — " + tap.t);
      return {
        t: (hold ? hold.t : "?") + " / " + (tap ? tap.t : "?"),
        d: bits.join("   ·   "), c: "layer",
        chip: hold && hold.chip ? hold.chip : (tap && tap.chip ? tap.chip : null)
      };
    }
  }
  if (KC_INFO[code]) {
    var k = KC_INFO[code];
    return { t: k.t, d: k.d, c: k.c };
  }
  m = code.match(/^OSM\(MOD_(LSFT|RSFT|LCTL|RCTL|LALT|RALT|LGUI|RGUI)\)$/);
  if (m) {
    var mod = _OSM_MODS[m[1]];
    return { t: "Sticky " + mod, d: "One-shot modifier — applies only to the next key you press. " + (_OSM_HINTS[mod] || ""), c: "mod" };
  }
  if (code.indexOf("LSFT(") === 0 && code.charAt(code.length - 1) === ")") {
    var inner = code.slice(5, -1);
    if (SHIFTED[inner]) {
      return { t: SHIFTED[inner][0], d: "Shift+" + SHIFTED[inner][1] + " types " + SHIFTED[inner][0] + ".", c: "sym" };
    }
    var baseL = describeKC(inner, ctx);
    if (baseL) return { t: "Shift + " + baseL.t, d: "Shifted " + baseL.t + ".", c: "sym" };
  }
  for (var i = 0; i < _MOD_PREFIX.length; i++) {
    var p = _MOD_PREFIX[i][0];
    if (code.indexOf(p) === 0 && code.charAt(code.length - 1) === ")") {
      var base = describeKC(code.slice(p.length, -1), ctx);
      var label = _MOD_PREFIX[i][1];
      return {
        t: label + " + " + (base ? base.t : code.slice(p.length, -1)),
        d: label + "+" + (base ? (base.d || base.t) : code),
        c: base ? base.c : "sys"
      };
    }
  }
  return { t: code.replace(/^KC_/, ""), d: "Mapped keycode — no description written yet.", c: "sys" };
}