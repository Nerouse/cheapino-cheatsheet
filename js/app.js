/* cheapino-cheatsheet - App Logic */

var APP = { basePath:"", keyboards:[], currentKeyboard:null, currentProfile:null, currentLayer:0, vilData:null, metaMap:{} };

var KC_MAP = {
  KC_A:"A",KC_B:"B",KC_C:"C",KC_D:"D",KC_E:"E",KC_F:"F",KC_G:"G",
  KC_H:"H",KC_I:"I",KC_J:"J",KC_K:"K",KC_L:"L",KC_M:"M",KC_N:"N",
  KC_O:"O",KC_P:"P",KC_Q:"Q",KC_R:"R",KC_S:"S",KC_T:"T",KC_U:"U",
  KC_V:"V",KC_W:"W",KC_X:"X",KC_Y:"Y",KC_Z:"Z",
  KC_1:"1",KC_2:"2",KC_3:"3",KC_4:"4",KC_5:"5",
  KC_6:"6",KC_7:"7",KC_8:"8",KC_9:"9",KC_0:"0",
  KC_SPACE:"\u2425",KC_ENTER:"\u29E8",KC_BSPACE:"\u232B",KC_TAB:"\u21E5",
  KC_ESCAPE:"Esc",KC_DELETE:"\u2326",KC_INSERT:"Ins",
  KC_LSHIFT:"\u21E7",KC_RSHIFT:"\u21E7",KC_LCTRL:"^",KC_RCTRL:"^",
  KC_LALT:"Alt",KC_RALT:"Alt",KC_LGUI:"\u25C6",KC_RGUI:"\u25C6",
  KC_MINUS:"-",KC_EQUAL:"=",KC_LBRACKET:"[",KC_RBRACKET:"]",
  KC_BSLASH:"\\",KC_SCOLON:";",KC_QUOTE:"'",KC_GRAVE:"",
  KC_COMMA:",",KC_DOT:".",KC_SLASH:"/",
  KC_LEFT:"\u2190",KC_RIGHT:"\u2192",KC_UP:"\u2191",KC_DOWN:"\u2193",
  KC_HOME:"\u2196",KC_END:"\u2198",KC_PGUP:"\u21DE",KC_PGDOWN:"\u21DF",
  KC_PSCREEN:"PrtSc",KC_VOLU:"Vol+",KC_VOLD:"Vol-",
  KC_MNXT:"Next",KC_MPRV:"Prev",KC_MPLY:"\u23EF",
  KC_BTN1:"ClkL",KC_BTN2:"ClkR",KC_BTN3:"ClkM",
  KC_MS_L:"\u25C0",KC_MS_R:"\u25B6",KC_MS_U:"\u25B2",KC_MS_D:"\u25BC",
  KC_WH_U:"\u21E1",KC_WH_D:"\u21E3",KC_WH_L:"\u21E0",KC_WH_R:"\u21E2",
  KC_TRNS:"\u2398",KC_NO:"",KC_MUTE:"Mute",KC_MENU:"Menu",
  KC_F1:"F1",KC_F2:"F2",KC_F3:"F3",KC_F4:"F4",
  KC_F5:"F5",KC_F6:"F6",KC_F7:"F7",KC_F8:"F8",
  KC_F9:"F9",KC_F10:"F10",KC_F11:"F11",KC_F12:"F12",
};

var MOD_PREFIX = {
  "LCTL(":"^","LSFT(":"\u21E7","LALT(":"Alt","LGUI(":"\u25C6",
  "RCTL(":"^","RSFT(":"\u21E7","RALT(":"Alt","RGUI(":"\u25C6",
  "C_S(":"^\u21E7","LCG(":"^\u25C6","SGUI(":"\u21E7\u25C6","LCA(":"^Alt",
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
  for (var [p, ml] of Object.entries(MOD_PREFIX)) {
    if (code.startsWith(p) && code.endsWith(")")) {
      var inner = code.slice(p.length,-1);
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
    return { label: label, kc:code, cls: code==="KC_TRNS"?"transparent":/^[A-Z]$/.test(label)?"alpha":"" };
  }
  return { label:code.replace(/^KC_/,"").slice(0,6), kc:code, cls:"" };
}

function getLayerNames() {
  var n = (APP.vilData && APP.vilData.layout) ? APP.vilData.layout.length : 6;
  var meta = APP.metaMap[APP.currentKeyboard];
  var profile = null;
  if (meta) profile = meta.profiles.find(function(p) { return p.file === APP.currentProfile; });
  if (profile && profile.layers_named) return profile.layers_named.slice(0,n);
  if (meta && meta.layers_named) return meta.layers_named.slice(0,n);
  var defs = ["BASE","MOUSE","WIN","NUMBERS","NAV/EDIT","FN5","FN6","FN7"];
  return defs.slice(0,n);
}

/* Data loading */

async function loadKeyboards() {
  try {
    var resp = await fetch(APP.basePath + "keyboards/cheapino-v2/meta.json");
    var meta = await resp.json();
    APP.metaMap["cheapino-v2"] = meta;
    APP.keyboards = ["cheapino-v2"];
    APP.currentKeyboard = "cheapino-v2";
    APP.currentProfile = meta.profiles[0] ? meta.profiles[0].file : null;
    return meta;
  } catch (e) { console.warn(e); return null; }
}

async function loadProfile(kb, file) {
  try {
    var resp = await fetch(APP.basePath + "keyboards/" + kb + "/" + file);
    var data = await resp.json();
    APP.vilData = data;
    APP.currentProfile = file;
    APP.currentLayer = 0;
    renderKeymap();
    updateLayerTabs();
    updateProfileUI();
  } catch (e) {
    console.warn(e);
    var el = document.getElementById("keymap-visual");
    if (el) el.innerHTML = "<div class=\"empty-state\"><p>Could not load: " + file + "</p></div>";
  }
}
/* Profile dropdown */

function updateProfileUI() {
  var sel = document.getElementById("profile-select");
  var desc = document.getElementById("profile-desc");
  if (!sel || !desc) return;
  var meta = APP.metaMap[APP.currentKeyboard];
  if (!meta) return;
  sel.innerHTML = meta.profiles.map(function(p) {
    return '<option value="'+p.file+'"'+(p.file===APP.currentProfile?" selected":"")+">"+p.name+"</option>";
  }).join("");
  var active = meta.profiles.find(function(p) { return p.file === APP.currentProfile; });
  desc.textContent = active ? active.desc : "";
}

/* Keymap rendering */

function renderKeymap() {
  var el = document.getElementById("keymap-visual");
  if (!el || !APP.vilData) return;
  var li = APP.currentLayer;
  var ld = APP.vilData.layout[li];
  if (!ld) { el.innerHTML = '<div class="empty-state"><p>No data for layer '+li+'</p></div>'; return; }
  var left = ld.map(function(r) { return r.slice(0,6); });
  var right = ld.map(function(r) { return r.slice(6,12); });
  function half(rows) {
    return rows.map(function(row) {
      if (row.every(function(k) { return !k || k===-1 || k==="KC_NO"; })) return "";
      return '<div class="row">' + row.map(function(code,c) {
        if (code===-1||code==="KC_NO"||code===undefined||code===null) return '<div class="key empty"></div>';
        var dec = decodeKC(code);
        var cls = "key";
        if (dec.cls) cls += " "+dec.cls;
        if (!dec.label) cls += " empty";
        if (c===5) cls += " thumb";
        return '<div class="'+cls+'" title="'+(dec.kc||code)+'"><span class="label">'+(dec.label||"")+'</span></div>';
      }).join("") + '</div>';
    }).filter(function(s) { return s; }).join("");
  }
  el.innerHTML = '<div class="keyboard-wrap"><div class="half left">'+half(left)+'</div><div class="half right">'+half(right)+'</div></div>';
}

function updateLayerTabs() {
  var el = document.getElementById("layer-tabs");
  if (!el || !APP.vilData) return;
  var n = APP.vilData.layout.length;
  if (n===0) return;
  var names = getLayerNames();
  if (APP.currentLayer >= n) APP.currentLayer = 0;
  el.innerHTML = names.slice(0,n).map(function(nm,i) {
    return '<button class="layer-tab'+(i===APP.currentLayer?" active":"")+'" data-layer="'+i+'">'+nm+'</button>';
  }).join("");
  el.querySelectorAll(".layer-tab").forEach(function(btn) {
    btn.addEventListener("click", function() {
      APP.currentLayer = parseInt(this.dataset.layer);
      updateLayerTabs();
      renderKeymap();
    });
  });
}

/* Side drawer */

function openDrawer(title, contentHtml) {
  document.getElementById("drawer-title").textContent = title;
  document.getElementById("drawer-body").innerHTML = contentHtml;
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
  var meta = APP.metaMap[APP.currentKeyboard];
  if (!meta) return '<p class="empty-state">No files available.</p>';
  var kb = APP.currentKeyboard;
  var base = APP.basePath + "keyboards/" + kb + "/";
  var profs = meta.profiles.map(function(p) {
    return '<div class="tree-item file"><span class="icon">⌨</span><a href="'+base+p.file+'" target="_blank">'+p.file+'</a></div>';
  }).join("");
  var fws = (meta.firmware||[]).map(function(f) {
    return '<div class="tree-item file"><span class="icon">⚡</span><a href="'+base+'firmware/'+f.file+'" target="_blank">'+f.file+'</a></div>';
  }).join("");
  return '<div class="file-tree">'+
    '<div class="tree-item"><span class="folder open" onclick="this.classList.toggle(\'open\')">keyboards/</span></div>'+
    '<div class="indent"><div class="tree-item"><span class="folder open" onclick="this.classList.toggle(\'open\')">'+kb+'/</span></div>'+
    '<div class="indent"><div class="tree-item file"><span class="icon">📄</span><a href="'+base+'meta.json" target="_blank">meta.json</a></div>'+profs+
    '<div class="tree-item"><span class="folder" onclick="this.classList.toggle(\'open\')">firmware/</span></div>'+
    '<div class="indent">'+fws+'</div></div></div></div>';
}

function renderDocsContent() {
  var s = '<div class="sec"><h2>Two-Key Layer System</h2>';
  s += '<p>The entire layer system is controlled by the two left thumb keys.</p>';
  s += '<table><tr><th>Thumb</th><th>Action</th><th>Effect</th></tr>';
  s += '<tr><td rowspan=2>THUMB 1</td><td><span class="tag tg">TG(1)</span> tap</td><td><b>Toggle MOUSE</b> layer on/off</td></tr>';
  s += '<tr><td><span class="tag mo">MO(3)</span> hold</td><td><b>Momentary NUMBERS</b></td></tr>';
  s += '<tr><td rowspan=2>THUMB 2</td><td><span class="tag tg">TG(2)</span> tap</td><td><b>Toggle WIN</b> layer on/off</td></tr>';
  s += '<tr><td><span class="tag mo">MO(4)</span> hold</td><td><b>Momentary NAV</b></td></tr></table></div>';
  s += '<div class="sec"><h2>Toggle vs Momentary</h2>';
  s += '<ul><li><b><span class="tag tg">TG(n)</span></b> - tap to enter, stay after release.</li>';
  s += '<li><b><span class="tag mo">MO(n)</span></b> - hold to temporarily activate layer.</li>';
  s += '<li><b><span class="tag to">TO(n)</span></b> - toggle directly to layer n.</li></ul></div>';
  s += '<div class="sec"><h2>Flashing Firmware</h2>';
  s += '<p>Put Cheapino into bootloader mode (press reset). A drive named <b>RPI-RP2</b> appears. Drag the <code>.uf2</code> file onto it.</p>';
  s += '<ul><li><b>cheapino_vial-STOCK.uf2</b> - Stock VIAL firmware</li><li><b>cheapino_vial-PATCHED.uf2</b> - Patched VIAL firmware</li></ul></div>';
  s += '<div class="sec"><h2>Loading a Layout (.vil)</h2>';
  s += '<p>Open <a href="https://vial.rocks" target="_blank" style="color:var(--bl)">VIAL configurator</a>, connect keyboard, <b>File → Load Saved Layout</b>, select <code>.vil</code>.</p></div>';
  return s;
}

/* Init */

async function init() {
  APP.basePath = "";
  var meta = await loadKeyboards();
  if (!meta) {
    var el = document.getElementById("keymap-visual");
    if (el) el.innerHTML = '<div class="empty-state"><p>Could not load keyboard data.</p></div>';
    return;
  }
  await loadProfile(APP.currentKeyboard, meta.profiles[0].file);
  updateProfileUI();
  document.getElementById("profile-select").addEventListener("change", function() {
    var file = this.value;
    if (file !== APP.currentProfile) loadProfile(APP.currentKeyboard, file);
  });
  document.getElementById("btn-files").addEventListener("click", function() {
    openDrawer("Files", renderFilesContent());
  });
  document.getElementById("btn-docs").addEventListener("click", function() {
    openDrawer("Documentation", renderDocsContent());
  });
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeDrawer();
  });
}

document.addEventListener("DOMContentLoaded", init);
