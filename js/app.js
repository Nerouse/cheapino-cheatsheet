/* cheapino-cheatsheet - App Logic (Multi-Keyboard) */

var APP = { basePath:"", keyboards:[], keyboardMeta:{}, currentKeyboardId:null, currentKeyboardName:"", currentProfile:null, toggledLayer:0, holdLayer:null, vilData:null, metaMap:{} };

function effLayer() { return APP.holdLayer === null ? APP.toggledLayer : APP.holdLayer; }

function layerAction(code) {
  if (!code || typeof code !== "string") return null;
  var m = code.match(/^MO\((\d+)\)$/); if (m) return { hold: parseInt(m[1], 10) };
  m = code.match(/^TT\((\d+)\)$/);     if (m) return { hold: parseInt(m[1], 10) };
  m = code.match(/^TG\((\d+)\)$/);     if (m) return { toggle: parseInt(m[1], 10) };
  m = code.match(/^TO\((\d+)\)$/);     if (m) return { toggle: parseInt(m[1], 10) };
  m = code.match(/^TD\((\d+)\)$/);
  if (m) {
    var td = APP.vilData && APP.vilData.tap_dance;
    var e = td && td[parseInt(m[1], 10)];
    if (!e) return null;
    var tap = layerAction(e[0]);
    var hold = layerAction(e[1]);
    var out = {};
    if (hold && hold.hold !== undefined) out.hold = hold.hold;
    else if (hold && hold.toggle !== undefined) out.hold = hold.toggle;
    if (tap && tap.toggle !== undefined) out.toggle = tap.toggle;
    else if (tap && tap.hold !== undefined) out.toggle = tap.hold;
    return (out.hold !== undefined || out.toggle !== undefined) ? out : null;
  }
  return null;
}

function layerIsUsed(i) {
  var L = APP.vilData && APP.vilData.layout && APP.vilData.layout[i];
  if (!L) return false;
  for (var r = 0; r < L.length; r++) {
    for (var c = 0; c < L[r].length; c++) {
      var v = L[r][c];
      if (v !== -1 && v !== "KC_NO" && v !== "KC_TRNS" && v !== undefined && v !== null) return true;
    }
  }
  return false;
}

var KC_MAP = {
  "KC_A":"A","KC_B":"B","KC_C":"C","KC_D":"D","KC_E":"E","KC_F":"F","KC_G":"G",
  "KC_H":"H","KC_I":"I","KC_J":"J","KC_K":"K","KC_L":"L","KC_M":"M","KC_N":"N",
  "KC_O":"O","KC_P":"P","KC_Q":"Q","KC_R":"R","KC_S":"S","KC_T":"T","KC_U":"U",
  "KC_V":"V","KC_W":"W","KC_X":"X","KC_Y":"Y","KC_Z":"Z",
  "KC_1":"1","KC_2":"2","KC_3":"3","KC_4":"4","KC_5":"5",
  "KC_6":"6","KC_7":"7","KC_8":"8","KC_9":"9","KC_0":"0",
  "KC_SPACE":"spc","KC_ENTER":"\u21B5","KC_BSPACE":"\u232B","KC_TAB":"\u21E5",
  "KC_ESCAPE":"Esc","KC_DELETE":"\u2326","KC_INSERT":"Ins",
  "KC_LSHIFT":"\u21E7","KC_RSHIFT":"\u21E7","KC_LCTRL":"^","KC_RCTRL":"^",
  "KC_LALT":"Alt","KC_RALT":"Alt","KC_LGUI":"\u25C6","KC_RGUI":"\u25C6",
  "KC_MINUS":"-","KC_EQUAL":"=","KC_LBRACKET":"[","KC_RBRACKET":"]",
  "KC_BSLASH":"\\","KC_SCOLON":";","KC_QUOTE":"'","KC_GRAVE":"",
  "KC_COMMA":",","KC_DOT":".","KC_SLASH":"/",
  "KC_LEFT":"\u2190","KC_RIGHT":"\u2192","KC_UP":"\u2191","KC_DOWN":"\u2193",
  "KC_HOME":"\u2196","KC_END":"\u2198","KC_PGUP":"\u21DE","KC_PGDOWN":"\u21DF",
  "KC_PSCREEN":"PrtSc","KC_VOLU":"Vol+","KC_VOLD":"Vol-",
  "KC_MNXT":"Next","KC_MPRV":"Prev","KC_MPLY":"\u23EF",
  "KC_BTN1":"ClkL","KC_BTN2":"ClkR","KC_BTN3":"ClkM",
  "KC_MS_L":"\u25C0","KC_MS_R":"\u25B6","KC_MS_U":"\u25B2","KC_MS_D":"\u25BC",
  "KC_WH_U":"\u21E1","KC_WH_D":"\u21E3","KC_WH_L":"\u21E0","KC_WH_R":"\u21E2",
  "KC_TRNS":"\u2398","KC_NO":"","KC_MUTE":"Mute","KC_MENU":"Menu",
  "KC_F1":"F1","KC_F2":"F2","KC_F3":"F3","KC_F4":"F4",
  "KC_F5":"F5","KC_F6":"F6","KC_F7":"F7","KC_F8":"F8",
  "KC_F9":"F9","KC_F10":"F10","KC_F11":"F11","KC_F12":"F12"
};


var MOD_PREFIX = {
  "LCTL(":"^","LSFT(":"\u21E7","LALT(":"Alt","LGUI(":"\u25C6",
  "RCTL(":"^","RSFT(":"\u21E7","RALT(":"Alt","RGUI(":"\u25C6",
  "C_S(":"^\u21E7","LCG(":"^\u25C6","SGUI(":"\u21E7\u25C6","LCA(":"^Alt"
};

function decodeKC(code) {
  if (!code || code === "KC_NO") return { label:"", kc:"", cls:"empty" };
  var m = code.match(/^TD\((\d+)\)$/);
  if (m) return { label:"TD"+m[1], kc:code, cls:"layer" };
  m = code.match(/^MO\((\d+)\)$/);
  if (m) return { label:"MO"+m[1], kc:code, cls:"layer" };
  m = code.match(/^TG\((\d+)\)$/);
  if (m) return { label:"TG"+m[1], kc:code, cls:"layer" };
  m = code.match(/^TO\((\d+)\)$/);
  if (m) return { label:"TO"+m[1], kc:code, cls:"layer" };
  m = code.match(/^TT\((\d+)\)$/);
  if (m) return { label:"TT"+m[1], kc:code, cls:"layer" };
  var keys = Object.keys(MOD_PREFIX);
  for (var i = 0; i < keys.length; i++) {
    var pk = keys[i], ml = MOD_PREFIX[pk];
    if (code.startsWith(pk) && code.endsWith(")")) {
      var inner = code.slice(pk.length,-1);
      var dec = decodeKC(inner);
      if (dec.label) return { label:ml+dec.label, kc:code, cls:"mod" };
    }
  }
  if (code.startsWith("LSFT(") && code.endsWith(")")) {
    var inner = code.slice(5,-1);
    var dec = decodeKC(inner);
    if (dec.label) return { label:"\u21E7"+dec.label, kc:code, cls:"mod" };
  }
  if (KC_MAP[code] !== undefined) {
    var label = KC_MAP[code];
    return { label:label, kc:code, cls:code==="KC_TRNS"?"transparent":/^[A-Z]$/.test(label)?"alpha":"" };
  }
  return { label:code.replace(/^KC_/,"").slice(0,6), kc:code, cls:"" };
}

/* ── descriptions & colours ──────────────────────────────── */
function layerColor(i) {
  return (typeof LAYER_COLORS !== "undefined" && LAYER_COLORS[i]) ? LAYER_COLORS[i] : "#8b95a8";
}
function catColor(c) {
  return (typeof CAT_COLORS !== "undefined" && CAT_COLORS[c]) ? CAT_COLORS[c] : "#8b95a8";
}
function esc(s) {
  return String(s === undefined || s === null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function currentProfileMeta() {
  var meta = APP.metaMap[APP.currentKeyboardId];
  if (!meta || !meta.profiles) return null;
  for (var i = 0; i < meta.profiles.length; i++) if (meta.profiles[i].file === APP.currentProfile) return meta.profiles[i];
  return null;
}
function descCtx() {
  var p = currentProfileMeta();
  return {
    layerNames: getLayerNames(),
    layerFull: (p && p.layers_full) || null,
    tapDance: (APP.vilData && APP.vilData.tap_dance) || [],
    subLayerClear: (p && p.subLayerClear) || null
  };
}
function describe(code) {
  if (typeof describeKC !== "function") return null;
  return describeKC(code, descCtx());
}

function getLayerNames() {
  var n = (APP.vilData && APP.vilData.layout) ? APP.vilData.layout.length : 6;
  var meta = APP.metaMap[APP.currentKeyboardId];
  var profile = null;
  var names = null;
  if (meta) profile = meta.profiles.find(function(p) { return p.file === APP.currentProfile; });
  if (profile && profile.layers_named) names = profile.layers_named;
  else if (meta && meta.layers_named) names = meta.layers_named;
  if (!names) names = ["BASE","LAYER 1","LAYER 2","LAYER 3","LAYER 4","LAYER 5","LAYER 6","LAYER 7"];
  var out = names.slice(0, n);
  while (out.length < n) out.push("LAYER " + out.length);
  return out;
}

/* Keyboard loading */
async function loadKeyboards() {
  try {
    var r = await fetch(APP.basePath + "keyboards/keyboards.json");
    var data = await r.json();
    APP.keyboards = data.keyboards;
    if (!APP.keyboards || APP.keyboards.length === 0) return null;
    var sel = document.getElementById("keyboard-select");
    if (sel) {
      sel.innerHTML = APP.keyboards.map(function(kb) {
        return '<option value="' + kb.id + '">' + kb.name + "</option>";
      }).join("");
    }
    await switchToKeyboard(APP.keyboards[0].id);
    return data;
  } catch (e) { console.warn(e); return null; }
}

async function switchToKeyboard(kb) {
  try {
    var r = await fetch(APP.basePath + "keyboards/" + kb + "/meta.json");
    var m = await r.json();
    APP.metaMap[kb] = m;
    APP.currentKeyboardId = kb;
    var sel = document.getElementById("keyboard-select");
    if (sel) sel.value = kb;
    var sel2 = document.getElementById("profile-select");
    if (sel2) {
      sel2.innerHTML = m.profiles.map(function(p) {
        return '<option value="' + p.file + '">' + p.name + "</option>";
      }).join("");
    }
    var fp = m.profiles[0] ? m.profiles[0].file : null;
    if (fp) await loadProfile(kb, fp);
    return m;
  } catch (e) { console.warn(e); return null; }
}

async function loadProfile(kb, file) {
  try {
    var r = await fetch(APP.basePath + "keyboards/" + kb + "/" + file);
    var data = await r.json();
    APP.vilData = data;
    APP.currentProfile = file;
    APP.toggledLayer = 0;
    APP.holdLayer = null;
    APP.pressed = null;
    var sel = document.getElementById("profile-select");
    if (sel) sel.value = file;
    renderKeymap();
    updateLayerTabs();
  } catch (e) {
    console.warn(e);
    var el = document.getElementById("keymap-visual");
    if (el) el.innerHTML = '<div class="empty-state"><p>Could not load: ' + file + '</p></div>';
  }
}

function kcAt(pos) {
  if (!pos || !APP.vilData) return null;
  var ld = APP.vilData.layout[effLayer()];
  if (!ld) return null;
  var row = ld[pos[0]];
  if (!row) return null;
  var v = row[pos[1]];
  return v === undefined ? null : v;
}

function keyHTML(pos) {
  var c = kcAt(pos);
  if (c === null || c === -1 || c === "KC_NO") return '<div class="key empty"></div>';
  var dc = decodeKC(c);
  var info = describe(c);
  var cat = info ? info.c : "";
  var cl = "key";
  if (dc.cls) cl += " " + dc.cls;
  if (!dc.label) cl += " empty";
  var act = layerAction(c);
  var attr = "";
  if (act) { cl += " clickable"; attr = " data-act='" + JSON.stringify(act) + "'"; }
  return '<div class="' + cl + '"' + attr + ' data-kc="' + esc(c) + '" data-cat="' + esc(cat || "") + '" style="--hc:' + catColor(cat) + '" title="' + esc(dc.kc || c) + '"><span class="label">' + (dc.label || "") + '</span></div>';
}

function sideHTML(side, mirror) {
  if (!side) return "";
  var stagger = mirror ? [-5, -2, 0, 3, 5] : [5, 3, 0, -2, -5];
  var h = '<div class="kb-half ' + (mirror ? "right" : "left") + '">';
  h += '<div class="kb-cols">';
  var cols = side.rows[0].length;
  for (var c = 0; c < cols; c++) {
    h += '<div class="kb-col" style="margin-top:' + stagger[c] + 'px">';
    for (var r = 0; r < side.rows.length; r++) h += keyHTML(side.rows[r][c]);
    h += "</div>";
  }
  h += "</div>";
  if (side.thumbs && side.thumbs.length) {
    var ts = mirror ? [12, 6, 0] : [0, 6, 12];
    h += '<div class="kb-thumbs">';
    for (var t = 0; t < side.thumbs.length; t++) {
      h += '<div class="kb-thumb" style="margin-top:' + ts[t] + 'px">' + keyHTML(side.thumbs[t]) + "</div>";
    }
    h += "</div>";
  }
  h += "</div>";
  return h;
}

function turnLabel(code) {
  if (!code || code === "KC_NO" || code === "KC_TRNS") return "\u2014";
  var dc = decodeKC(code);
  return dc.label || code;
}

function encoderHTML() {
  var meta = APP.metaMap[APP.currentKeyboardId];
  var enc = meta && meta.encoder;
  var h = '<div class="enc-island">';
  h += '<div class="enc-title">Encoder</div>';
  var row = APP.vilData && APP.vilData.encoder_layout && APP.vilData.encoder_layout[effLayer()];
  var turns = row && row[0];
  if (turns) {
    h += '<div class="enc-turn"><span class="enc-dir">&#8635;</span><span class="enc-val">' + turnLabel(turns[0]) + '</span></div>';
    h += '<div class="enc-turn"><span class="enc-dir">&#8634;</span><span class="enc-val">' + turnLabel(turns[1]) + '</span></div>';
  } else {
    h += '<div class="enc-turn"><span class="enc-val enc-none">&mdash;</span></div>';
  }
  if (enc && enc.key) h += '<div class="enc-click">' + keyHTML(enc.key) + '</div>';
  h += "</div>";
  return h;
}

/* ── hover branch diagram ────────────────────────────────── */
var CALLOUT = { host: null, svg: null, line: null, card: null };

function ensureCallout() {
  var host = document.querySelector(".keymap-area");
  if (!host) return;
  var oldCard = host.querySelector(".kb-callout");
  var oldSvg = host.querySelector(".kb-leader");
  if (oldCard) oldCard.remove();
  if (oldSvg) oldSvg.remove();
  CALLOUT.host = host;
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "kb-leader");
  var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  line.setAttribute("class", "kb-leader-line");
  svg.appendChild(line);
  host.appendChild(svg);
  var card = document.createElement("div");
  card.className = "kb-callout";
  host.appendChild(card);
  CALLOUT.svg = svg;
  CALLOUT.line = line;
  CALLOUT.card = card;
}

function hideCallout() {
  if (!CALLOUT.card) return;
  CALLOUT.card.classList.remove("on");
  if (CALLOUT.line) CALLOUT.line.setAttribute("points", "");
}

function showCallout(anchor, html) {
  if (!CALLOUT.card || !anchor || !CALLOUT.host) return;
  var host = CALLOUT.host;
  var card = CALLOUT.card;
  var vis = document.getElementById("keymap-visual");
  if (!vis) return;
  var hr = host.getBoundingClientRect();
  var vr = vis.getBoundingClientRect();
  var ar = anchor.getBoundingClientRect();
  card.innerHTML = html;
  card.classList.add("on");
  var cw = card.offsetWidth;
  var ch = card.offsetHeight;
  var cx = hr.width / 2;
  var cardTop = Math.max(vr.bottom - hr.top + 26, 0);
  if (cardTop + ch > hr.height - 6) cardTop = hr.height - ch - 6;
  card.style.left = Math.round(cx - cw / 2) + "px";
  card.style.top = Math.round(cardTop) + "px";
  var lc = layerColor(effLayer());
  CALLOUT.line.style.stroke = lc;
  card.style.setProperty("--layer", lc);
  var x1 = ar.left - hr.left + ar.width / 2;
  var y1 = ar.top - hr.top + ar.height;
  var x2 = cx;
  var y2 = cardTop + 2;
  var midY = y2 - 22;
  if (midY < y1 + 6) midY = (y1 + y2) / 2;
  CALLOUT.line.setAttribute("points", x1 + "," + y1 + " " + x1 + "," + midY + " " + x2 + "," + midY + " " + x2 + "," + y2);
}

function calloutForKey(el) {
  var code = el.getAttribute("data-kc");
  if (!code) return;
  var info = describe(code);
  if (!info) return;
  var h = '<div class="co-code">' + esc(code) + "</div>";
  h += '<div class="co-title"><span class="co-dot" style="background:' + catColor(info.c) + '"></span>' + esc(info.t) + "</div>";
  if (info.d) h += '<div class="co-detail">' + esc(info.d) + "</div>";
  if (info.chip) {
    h += '<div class="co-chip" style="color:' + layerColor(info.chip.idx) + ';border-color:' + layerColor(info.chip.idx) + '">&#8594; ' + esc(info.chip.name) + "</div>";
  }
  h += '<div class="co-cat">' + esc((typeof CAT_LABELS !== "undefined" && CAT_LABELS[info.c]) || info.c || "") + "</div>";
  showCallout(el, h);
}

function calloutForEncoder(el) {
  if (!APP.vilData) return;
  var row = APP.vilData.encoder_layout && APP.vilData.encoder_layout[effLayer()];
  var turns = row && row[0];
  var names = getLayerNames();
  var h = '<div class="co-code">ENCODER</div>';
  h += '<div class="co-title"><span class="co-dot" style="background:' + layerColor(effLayer()) + '"></span>Knob — ' + esc(names[effLayer()] || "") + "</div>";
  if (turns && (turns[0] !== "KC_TRNS" || turns[1] !== "KC_TRNS")) {
    var a = describe(turns[0]);
    var b = describe(turns[1]);
    h += '<div class="co-detail">&#8635; ' + esc(a ? a.t : turns[0]) + " &nbsp;&middot;&nbsp; &#8634; " + esc(b ? b.t : turns[1]) + "</div>";
  } else {
    h += '<div class="co-detail">No encoder action on this layer.</div>';
  }
  var meta = APP.metaMap[APP.currentKeyboardId];
  var ek = meta && meta.encoder && meta.encoder.key;
  if (ek && APP.vilData.layout && APP.vilData.layout[effLayer()]) {
    var lay = APP.vilData.layout[effLayer()];
    var kc = lay[ek[0]] && lay[ek[0]][ek[1]];
    if (kc && kc !== "KC_NO" && kc !== "KC_TRNS") {
      var ki = describe(kc);
      if (ki) h += '<div class="co-detail">Press: ' + esc(ki.t) + " — " + esc(ki.d) + "</div>";
    }
  }
  showCallout(el, h);
}

function attachKeyHandlers(root) {
  var keys = root.querySelectorAll(".key[data-kc]");
  for (var i = 0; i < keys.length; i++) {
    (function(el) {
      el.addEventListener("mouseenter", function() { calloutForKey(el); });
      el.addEventListener("mouseleave", hideCallout);
      var act;
      try { act = JSON.parse(el.getAttribute("data-act") || "null"); } catch (e) { act = null; }
      if (!act) return;
      el.addEventListener("mousedown", function(e) {
        e.preventDefault();
        APP.pressed = { act: act, t: Date.now() };
        if (act.hold !== undefined) { APP.holdLayer = act.hold; refresh(); }
      });
    })(keys[i]);
  }
  var island = root.querySelector(".enc-island");
  if (island) {
    island.addEventListener("mouseenter", function() { calloutForEncoder(island); });
    island.addEventListener("mouseleave", hideCallout);
  }
}

function releaseKeys() {
  var p = APP.pressed;
  APP.pressed = null;
  if (!p) return;
  if ((Date.now() - p.t) < 175 && p.act.toggle !== undefined) APP.toggledLayer = p.act.toggle;
  if (APP.holdLayer !== null) APP.holdLayer = null;
  refresh();
}

function refresh() { renderKeymap(); updateLayerTabs(); }

function renderKeymap() {
  var el = document.getElementById("keymap-visual");
  if (!el || !APP.vilData) return;
  var meta = APP.metaMap[APP.currentKeyboardId];
  var layout = meta && meta.layout;
  if (!layout) {
    el.innerHTML = '<div class="empty-state"><p>No physical layout defined for this keyboard.</p></div>';
    return;
  }
  el.innerHTML = '<div class="kb-wrap">' + sideHTML(layout.left, false) + encoderHTML() + sideHTML(layout.right, true) + "</div>";
  attachKeyHandlers(el);
  document.body.style.setProperty("--layer", layerColor(effLayer()));
  ensureCallout();
}

function updateLayerTabs() {
  var el = document.getElementById("layer-tabs");
  if (!el || !APP.vilData) return;
  var n = APP.vilData.layout.length;
  if (n === 0) return;
  var names = getLayerNames();
  var active = effLayer();
  var html = "";
  for (var i = 0; i < n; i++) {
    if (!layerIsUsed(i)) continue;
    html += '<button class="layer-tab' + (i === active ? " active" : "") + '" data-layer="' + i + '" style="--lc:' + layerColor(i) + '">' + names[i] + "</button>";
  }
  el.innerHTML = html;
  var tabs = el.querySelectorAll(".layer-tab");
  for (var t = 0; t < tabs.length; t++) {
    (function(btn) {
      btn.addEventListener("click", function() {
        APP.toggledLayer = parseInt(this.dataset.layer, 10);
        APP.holdLayer = null;
        refresh();
      });
    })(tabs[t]);
  }
}

function openDrawer(title, contentHtml, wide) {
  document.getElementById("drawer-title").textContent = title;
  document.getElementById("drawer-body").innerHTML = contentHtml;
  document.getElementById("drawer").classList.toggle("wide", !!wide);
  document.getElementById("drawer").classList.add("open");
  document.getElementById("drawer-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("drawer-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function renderFilesContent() {
  var m = APP.metaMap[APP.currentKeyboardId];
  if (!m) return "<p class=\"empty-state\">No files.</p>";
  var k = APP.currentKeyboardId;
  var b = APP.basePath + "keyboards/" + k + "/";
  var ps = "";
  for (var i = 0; i < m.profiles.length; i++) {
    var pr = m.profiles[i];
    ps += "<div class=\"tree-item file\"><a href=\"" + b + pr.file + "\" target=\"_blank\">" + pr.file + "</a></div>";
  }
  var fw = "";
  if (m.firmware) {
    for (var j = 0; j < m.firmware.length; j++) {
      var f = m.firmware[j];
      fw += "<div class=\"tree-item file\"><a href=\"" + b + "firmware/" + f.file + "\" target=\"_blank\">" + f.file + "</a></div>";
    }
  }
  var h = "<div class=\"file-tree\">";
  h += "<div class=\"tree-item\"><span class=\"folder open\" onclick=\"this.classList.toggle(\\'open\\')\">keyboards/</span></div>";
  h += "<div class=\"indent\"><div class=\"tree-item\"><span class=\"folder open\" onclick=\"this.classList.toggle(\\'open\\')\">" + k + "/</span></div>";
  h += "<div class=\"indent\"><div class=\"tree-item file\"><a href=\"" + b + "meta.json\" target=\"_blank\">meta.json</a></div>" + ps;
  h += "<div class=\"tree-item\"><span class=\"folder\" onclick=\"this.classList.toggle(\\'open\\')\">firmware/</span></div>";
  h += "<div class=\"indent\">" + fw + "</div></div></div></div>";
  return h;
}

function shortcutRow(code) {
  var info = describe(code) || { t: code, d: "", c: "sys" };
  var dc = decodeKC(code);
  var dot = '<span class="g-dot" style="background:' + catColor(info.c) + '"></span>';
  var detail = info.d ? '<span class="g-detail">' + esc(info.d) + "</span>" : "";
  return '<tr><td class="g-key">' + esc(dc.label || code) + "</td><td>" + dot + esc(info.t) + detail + "</td></tr>";
}

function layerTable(idx) {
  var meta = APP.metaMap[APP.currentKeyboardId];
  var L = meta && meta.layout;
  var lay = APP.vilData && APP.vilData.layout && APP.vilData.layout[idx];
  if (!L || !lay) return "";
  var codes = [];
  ["left", "right"].forEach(function(sd) {
    L[sd].rows.forEach(function(row) { row.forEach(function(p) { codes.push(lay[p[0]][p[1]]); }); });
    L[sd].thumbs.forEach(function(p) { codes.push(lay[p[0]][p[1]]); });
  });
  var typeKeys = [];
  var trns = 0;
  var rows = "";
  codes.forEach(function(code) {
    if (code === -1 || code === "KC_NO" || code === undefined) return;
    if (code === "KC_TRNS") { trns++; return; }
    if (/^KC_[A-Z]$/.test(code)) { typeKeys.push(decodeKC(code).label); return; }
    rows += shortcutRow(code);
  });
  if (typeKeys.length) {
    rows = '<tr><td class="g-key">' + typeKeys.join(" ") + '</td><td><span class="g-dot" style="background:' + catColor("type") + '"></span>Typing<span class="g-detail">Letters type as printed on the keycaps.</span></td></tr>' + rows;
  }
  if (trns) rows += '<tr><td class="g-key">&mdash;</td><td><span class="g-dot" style="background:' + catColor("none") + '"></span>' + trns + ' keys pass through<span class="g-detail">Those keys keep behaving as on the layer below.</span></td></tr>';
  var er = APP.vilData.encoder_layout && APP.vilData.encoder_layout[idx];
  var turns = er && er[0];
  if (turns) {
    var ta = describe(turns[0]);
    var tb = describe(turns[1]);
    if ((turns[0] !== "KC_TRNS" && ta) || (turns[1] !== "KC_TRNS" && tb)) {
      rows += '<tr><td class="g-key">Knob</td><td><span class="g-dot" style="background:' + catColor("mouse") + '"></span>Turn &#8635; ' + esc(ta ? ta.t : turns[0]) + " &middot; &#8634; " + esc(tb ? tb.t : turns[1]) + "</td></tr>";
    }
  }
  var ek = meta.encoder && meta.encoder.key;
  if (ek) {
    var kc = lay[ek[0]] && lay[ek[0]][ek[1]];
    if (kc && kc !== "KC_NO" && kc !== "KC_TRNS") rows += shortcutRow(kc);
  }
  return '<table class="g-table"><tr><th>Key</th><th>What it does</th></tr>' + rows + "</table>";
}

function renderGuideContent() {
  var meta = APP.metaMap[APP.currentKeyboardId];
  if (!meta || !APP.vilData) return '<p class="empty-state">No profile loaded.</p>';
  var p = currentProfileMeta() || {};
  var names = getLayerNames();
  var full = p.layers_full || names;
  var trig = p.layers_trigger || [];
  var purpose = p.layers_purpose || [];
  var n = APP.vilData.layout.length;
  var h = "";
  h += '<div class="sec"><h2>How the layers work</h2><ul>';
  h += "<li><b>Hold</b> — while a layer thumb key is down, every key sends that layer's action. Let go and you are back on BASE.</li>";
  h += "<li><b>Toggle</b> — tap to switch a layer on, tap again to switch it off.</li>";
  h += "<li><b>Sticky modifier</b> — tap it, then tap the next key: it applies to that one key only (Ctrl then F5 = Ctrl+F5).</li>";
  if (p.subLayerClear && p.subLayerClear.length) h += "<li><b>Sub-layers</b> — MOUSE and F-KEYS toggle from NAV; the firmware clears them the moment you release NAV, so nothing stays latched by accident.</li>";
  h += '</ul><p class="g-hint">Hover any key on the keyboard to see a branch with its full explanation.</p></div>';
  h += '<div class="sec"><h2>Layers at a glance</h2><table class="g-table"><tr><th></th><th>Layer</th><th>Trigger</th><th>What it is for</th></tr>';
  for (var i = 0; i < n; i++) {
    if (!layerIsUsed(i)) continue;
    h += '<tr><td><span class="g-dot big" style="background:' + layerColor(i) + '"></span></td>';
    h += '<td class="g-key">' + esc(full[i] || names[i]) + "</td>";
    h += "<td>" + esc(trig[i] || "—") + "</td>";
    h += "<td>" + esc(purpose[i] || "") + "</td></tr>";
  }
  h += "</table></div>";
  h += '<div class="sec"><h2>Colour legend</h2><div class="g-legend">';
  var order = ["type", "sym", "nav", "edit", "win", "mouse", "media", "mod", "sys", "none"];
  for (var c = 0; c < order.length; c++) {
    var lbl = (typeof CAT_LABELS !== "undefined" && CAT_LABELS[order[c]]) || order[c];
    h += '<div class="g-leg"><span class="g-dot" style="background:' + catColor(order[c]) + '"></span>' + esc(lbl) + "</div>";
  }
  h += "</div><p>Layer colours match the underglow LEDs on the board; the dots mark what kind of action a key performs.</p></div>";
if (p.chains && p.chains.length) {
    h += '<div class="sec"><h2>Sticky chains worth memorising</h2><table class="g-table"><tr><th>Goal</th><th>On NAV</th></tr>';
    for (var ch = 0; ch < p.chains.length; ch++) h += "<tr><td>" + esc(p.chains[ch][0]) + '</td><td class="g-key">' + esc(p.chains[ch][1]) + "</td></tr>";
    h += "</table></div>";
  }
  h += '<div class="sec"><h2>Every key, layer by layer</h2><p>Everything that does something, in physical order. Keys marked as pass-through behave exactly as on the layer below.</p></div>';
  for (var l = 0; l < n; l++) {
    if (!layerIsUsed(l)) continue;
    h += '<div class="sec g-layer"><h2><span class="g-dot big" style="background:' + layerColor(l) + '"></span>' + esc(full[l] || names[l]) + "</h2>" + layerTable(l) + "</div>";
  }
  h += '<div class="sec"><h2>Flashing the firmware</h2>';
  h += "<p>Put the Cheapino into bootloader mode (hold BOOT, tap reset). A drive named <b>RPI-RP2</b> appears. Drag the <b>.uf2</b> onto it.</p>";
  h += "<ul><li><b>cheapino_vial-PATCHED.uf2</b> — layer LEDs + sub-layer auto-clear (use this one)</li><li><b>cheapino_vial-STOCK.uf2</b> — stock VIAL firmware</li></ul></div>";
  h += '<div class="sec"><h2>Loading a layout (.vil)</h2><p>Open <a href="https://vial.rocks" target="_blank" rel="noopener">VIAL</a>, connect the keyboard, <b>File &rarr; Load Saved Layout</b>, pick the <code>.vil</code> from the Files drawer.</p></div>';
  h += '<div class="sec"><h2>The story</h2><p>How this layout came to be — the dead ends, the philosophy and the numbers: <a href="story.html">read the full story</a>.</p></div>';
  return h;
}

async function init() {
  APP.basePath = "";
  var d = await loadKeyboards();
  if (!d) {
    var el = document.getElementById("keymap-visual");
    if (el) el.innerHTML = "<div class=\"empty-state\"><p>Could not load keyboard data.</p></div>";
    return;
  }
  document.getElementById("keyboard-select").addEventListener("change", function() {
    switchToKeyboard(this.value);
  });
  document.getElementById("profile-select").addEventListener("change", function() {
    if (this.value !== APP.currentProfile) {
      loadProfile(APP.currentKeyboardId, this.value);
    }
  });
  document.getElementById("btn-files").addEventListener("click", function() { openDrawer("Files", renderFilesContent()); });
  document.getElementById("btn-docs").addEventListener("click", function() { openDrawer("Guide", renderGuideContent(), true); });
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function(e) { if (e.key === "Escape") { closeDrawer(); hideCallout(); } });
  document.addEventListener("mouseup", releaseKeys);
  window.addEventListener("blur", releaseKeys);
}

document.addEventListener("DOMContentLoaded", init);
