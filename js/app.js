/* cheapino-cheatsheet — App Logic */
const APP = { basePath:'', keyboards:[], currentKeyboard:null, currentProfile:null, currentLayer:0, vilData:null, metaMap:{} };
const KC_MAP = {
  'KC_A':'A','KC_B':'B','KC_C':'C','KC_D':'D','KC_E':'E','KC_F':'F',
  'KC_G':'G','KC_H':'H','KC_I':'I','KC_J':'J','KC_K':'K','KC_L':'L',
  'KC_M':'M','KC_N':'N','KC_O':'O','KC_P':'P','KC_Q':'Q','KC_R':'R',
  'KC_S':'S','KC_T':'T','KC_U':'U','KC_V':'V','KC_W':'W','KC_X':'X',
  'KC_Y':'Y','KC_Z':'Z',
  'KC_1':'1','KC_2':'2','KC_3':'3','KC_4':'4','KC_5':'5',
  'KC_6':'6','KC_7':'7','KC_8':'8','KC_9':'9','KC_0':'0',
  'KC_SPACE':'⎵','KC_ENTER':'⮠','KC_BSPACE':'⌫','KC_TAB':'⇥',
  'KC_ESCAPE':'Esc','KC_DELETE':'⌦','KC_INSERT':'Ins',
  'KC_LSHIFT':'⇧','KC_RSHIFT':'⇧','KC_LCTRL':'^','KC_RCTRL':'^',
  'KC_LALT':'Alt','KC_RALT':'Alt','KC_LGUI':'◆','KC_RGUI':'◆',
  'KC_MINUS':'-','KC_EQUAL':'=','KC_LBRACKET':'[','KC_RBRACKET':']',
  'KC_BSLASH':'\\','KC_SCOLON':';',"KC_QUOTE":"'",'KC_GRAVE':'`',
  'KC_COMMA':',','KC_DOT':'.','KC_SLASH':'/',
  'KC_LEFT':'←','KC_RIGHT':'→','KC_UP':'↑','KC_DOWN':'↓',
  'KC_HOME':'↖','KC_END':'↘','KC_PGUP':'⇞','KC_PGDOWN':'⇟',
  'KC_PSCREEN':'PrtSc','KC_SCROLLLOCK':'ScrLk','KC_PAUSE':'Pause',
  'KC_MENU':'Menu','KC_MUTE':'Mute','KC_VOLU':'Vol+','KC_VOLD':'Vol-',
  'KC_MNXT':'Next','KC_MPRV':'Prev','KC_MPLY':'⏯',
  'KC_BTN1':'ClkL','KC_BTN2':'ClkR','KC_BTN3':'ClkM',
  'KC_MS_L':'◀','KC_MS_R':'▶','KC_MS_U':'▲','KC_MS_D':'▼',
  'KC_WH_U':'⇡','KC_WH_D':'⇣','KC_WH_L':'⇠','KC_WH_R':'⇢',
  'KC_TRNS':'⎘','KC_NO':'',
  'KC_F1':'F1','KC_F2':'F2','KC_F3':'F3','KC_F4':'F4','KC_F5':'F5',
  'KC_F6':'F6','KC_F7':'F7','KC_F8':'F8','KC_F9':'F9','KC_F10':'F10',
  'KC_F11':'F11','KC_F12':'F12',
};
const MOD_PREFIX = {
  'LCTL(':'^','LSFT(':'⇧','LALT(':'Alt','LGUI(':'◆',
  'RCTL(':'^','RSFT(':'⇧','RALT(':'Alt','RGUI(':'◆',
  'C_S(':'^⇧','LCG(':'^◆','SGUI(':'⇧◆','LCA(':'^Alt',
};
function decodeKC(code) {
  if (!code || code === 'KC_NO') return { label:'', kc:'', cls:'empty' };
  let m = code.match(/^TD\((\d+)\)$/);
  if (m) return { label:'TD'+m[1], kc:code, cls:'layer' };
  m = code.match(/^MO\((\d+)\)$/);
  if (m) return { label:'MO'+m[1], kc:code, cls:'layer' };
  m = code.match(/^TG\((\d+)\)$/);
  if (m) return { label:'TG'+m[1], kc:code, cls:'layer' };
  m = code.match(/^TO\((\d+)\)$/);
  if (m) return { label:'TO'+m[1], kc:code, cls:'layer' };
  m = code.match(/^TT\((\d+)\)$/);
  if (m) return { label:'TT'+m[1], kc:code, cls:'layer' };
  for (const [p, ml] of Object.entries(MOD_PREFIX)) {
    if (code.startsWith(p) && code.endsWith(')')) {
      const inner = code.slice(p.length,-1);
      const dec = decodeKC(inner);
      if (dec.label) return { label:ml+dec.label, kc:code, cls:'mod' };
    }
  }
  if (code.startsWith('LSFT(') && code.endsWith(')')) {
    const inner = code.slice(5,-1);
    const dec = decodeKC(inner);
    if (dec.label) return { label:'⇧'+dec.label, kc:code, cls:'mod' };
  }
  if (KC_MAP[code] !== undefined) {
    const label = KC_MAP[code];
    return { label, kc:code, cls: code==='KC_TRNS'?'transparent':/^[A-Z]$/.test(label)?'alpha':'' };
  }
  return { label:code.replace(/^KC_/,'').slice(0,6), kc:code, cls:'' };
}

function getLayerNames() {
  const n = (APP.vilData && APP.vilData.layout) ? APP.vilData.layout.length : 6;
  const meta = APP.metaMap[APP.currentKeyboard];
  let profile = null;
  if (meta) profile = meta.profiles.find(p => p.file === APP.currentProfile);
  if (profile && profile.layers_named) return profile.layers_named.slice(0,n);
  if (meta && meta.layers_named) return meta.layers_named.slice(0,n);
  const defs = ['BASE','MOUSE','WIN','NUMBERS','NAV/EDIT','FN5','FN6','FN7'];
  return defs.slice(0,n);
}

function initNav() {
  const links = document.querySelectorAll('.nav .mi a');
  const panels = document.querySelectorAll('.panel');
  function showPanel(id) {
    links.forEach(l => l.classList.toggle('active', l.dataset.panel === id));
    panels.forEach(p => p.classList.toggle('active', p.id === id));
    if (id === 'keymap' && APP.vilData) renderKeymap();
  }
  links.forEach(a => {
    a.addEventListener('click', e => { e.preventDefault();
      window.location.hash = a.dataset.panel;
      showPanel(a.dataset.panel);
    });
  });
  function onHash() { showPanel(window.location.hash.replace('#','') || 'keymap'); }
  window.addEventListener('hashchange', onHash);
  onHash();
}

async function loadKeyboards() {
  try {
    const resp = await fetch(APP.basePath + 'keyboards/cheapino-v2/meta.json');
    const meta = await resp.json();
    APP.metaMap['cheapino-v2'] = meta;
    APP.keyboards = ['cheapino-v2'];
    APP.currentKeyboard = 'cheapino-v2';
    APP.currentProfile = meta.profiles[0]?.file || null;
    return meta;
  } catch (e) { console.warn(e); return null; }
}

async function loadProfile(kb, file) {
  try {
    const resp = await fetch(APP.basePath + 'keyboards/' + kb + '/' + file);
    const data = await resp.json();
    APP.vilData = data;
    APP.currentProfile = file;
    APP.currentLayer = 0;
    renderKeymap();
    updateLayerTabs();
  } catch (e) {
    console.warn(e);
    const el = document.getElementById('keymap-visual');
    if (el) el.innerHTML = '<div class="empty-state"><p>Could not load: ' + file + '</p></div>';
  }
}

function renderKeymap() {
  const el = document.getElementById('keymap-visual');
  if (!el || !APP.vilData) return;
  const li = APP.currentLayer;
  const ld = APP.vilData.layout[li];
  if (!ld) { el.innerHTML = '<div class="empty-state"><p>No data for layer '+li+'</p></div>'; return; }
  const left = ld.map(r => r.slice(0,6));
  const right = ld.map(r => r.slice(6,12));
  function half(rows) {
    return rows.map(row => {
      if (row.every(k => !k || k===-1 || k==='KC_NO')) return '';
      return '<div class="row">' + row.map((code,c) => {
        if (code===-1||code==='KC_NO'||code===undefined||code===null) return '<div class="key empty"></div>';
        const dec = decodeKC(code);
        let cls = 'key';
        if (dec.cls) cls += ' '+dec.cls;
        if (!dec.label) cls += ' empty';
        if (c===5) cls += ' thumb';
        return '<div class="'+cls+'" title="'+(dec.kc||code)+'"><span class="label">'+(dec.label||'')+'</span></div>';
      }).join('') + '</div>';
    }).filter(Boolean).join('');
  }
  el.innerHTML = '<div class="keyboard-wrap"><div class="half left">'+half(left)+'</div><div class="half right">'+half(right)+'</div></div>';
}
function updateLayerTabs() {
  const el = document.getElementById('layer-tabs');
  if (!el || !APP.vilData) return;
  const n = APP.vilData.layout ? APP.vilData.layout.length : 0;
  if (n===0) return;
  const names = getLayerNames();
  if (APP.currentLayer >= n) APP.currentLayer = 0;
  el.innerHTML = names.slice(0,n).map((nm,i) =>
    '<button class="layer-tab'+(i===APP.currentLayer?' active':'')+'" data-layer="'+i+'">'+nm+'</button>'
  ).join('');
  el.querySelectorAll('.layer-tab').forEach(btn => {
    btn.addEventListener('click', function() {
      APP.currentLayer = parseInt(this.dataset.layer);
      updateLayerTabs();
      renderKeymap();
    });
  });
}

function renderConfigs() {
  const el = document.getElementById('configs-list');
  if (!el) return;
  const meta = APP.metaMap[APP.currentKeyboard];
  if (!meta) return;
  el.innerHTML = '<div class="profile-grid">' +
    meta.profiles.map(p =>
      '<div class="profile-card'+(p.file===APP.currentProfile?' active':'')+'" data-profile="'+p.file+'">'+
        '<h3>'+p.name+'</h3><div class="desc">'+p.desc+'</div><span class="badge">'+p.file+'</span></div>'
    ).join('') + '</div>';
  el.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', function() {
      const f = this.dataset.profile;
      if (f !== APP.currentProfile) {
        loadProfile(APP.currentKeyboard, f);
        renderConfigs();
        window.location.hash = 'keymap';
      }
function renderDocs() {
  const el = document.getElementById('docs-content');
  if (!el) return;
  el.innerHTML =
'<div class="sec"><h2>Two-Key Layer System</h2>'+
'<p>The entire layer system is controlled by the two left thumb keys.</p>'+
'<h3>Tap-Dance Mechanism</h3>'+
'<p>Press <b>under 175ms</b> → <span class="tag tg">TG(n)</span> toggle. Press again → returns to BASE. Press <b>over 175ms</b> → <span class="tag mo">MO(n)</span> hold.</p>'+
'<table><tr><th>Thumb</th><th>Action</th><th>Effect</th></tr>'+
'<tr><td rowspan=2>THUMB 1</td><td><span class="tag tg">TG(1)</span> tap</td><td><b>Toggle MOUSE</b> layer on/off</td></tr>'+
'<tr><td><span class="tag mo">MO(3)</span> hold</td><td><b>Momentary NUMBERS</b></td></tr>'+
'<tr><td rowspan=2>THUMB 2</td><td><span class="tag tg">TG(2)</span> tap</td><td><b>Toggle WIN</b> layer on/off</td></tr>'+
'<tr><td><span class="tag mo">MO(4)</span> hold</td><td><b>Momentary NAV</b></td></tr></table></div>'+
'<div class="sec"><h2>Navigation Map</h2>'+
'<div class="flow"><div><b>BASE</b><br>layer 0</div><div class="arr">TG(1)<br>↕</div><div><b>MOUSE</b><br>layer 1</div><div class="arr">TG(2)<br>↕</div><div><b>WIN</b><br>layer 2</div></div>'+
'<table><tr><th>From</th><th>Tap</th><th>Result</th></tr>'+
'<tr><td>BASE</td><td>THUMB 1</td><td><span class="tag tg">TG(1)</span> → MOUSE ON</td></tr>'+
'<tr><td>BASE</td><td>THUMB 2</td><td><span class="tag tg">TG(2)</span> → WIN ON</td></tr>'+
'<tr><td>MOUSE</td><td>THUMB 1</td><td><span class="tag to">TO(0)</span> → back to BASE</td></tr>'+
'<tr><td>WIN</td><td>THUMB 2</td><td><span class="tag to">TO(0)</span> → back to BASE</td></tr>'+
'<tr><td>MOUSE</td><td>THUMB 2</td><td><span class="tag to">TO(2)</span> → swap to WIN</td></tr>'+
'<tr><td>WIN</td><td>THUMB 1</td><td><span class="tag to">TO(1)</span> → swap to MOUSE</td></tr>'+
'<tr><td>Any</td><td>HOLD THUMB 1</td><td><span class="tag mo">MO(3)</span> → NUMBERS</td></tr>'+
'<tr><td>Any</td><td>HOLD THUMB 2</td><td><span class="tag mo">MO(4)</span> → NAV</td></tr></table></div>'+
'<div class="sec"><h2>Layer Reference</h2>'+
'<table><tr><th>#</th><th>Name</th><th>Access</th><th>Content</th></tr>'+
'<tr><td>0</td><td><b>BASE</b></td><td>default</td><td>QWERTY alphas, Enter/Shift/Space/Bksp</td></tr>'+
'<tr><td>1</td><td><b>MOUSE/BROWSER</b></td><td>THUMB 1 tap</td><td>Mouse, scroll, clicks; browser nav, tabs</td></tr>'+
'<tr><td>2</td><td><b>WINDOWS</b></td><td>THUMB 2 tap</td><td>Window snap, desktop switch, Alt+Tab</td></tr>'+
'<tr><td>3</td><td><b>NUMBERS</b></td><td>HOLD THUMB 1</td><td>Number row, symbols, F-keys</td></tr>'+
'<tr><td>4</td><td><b>NAV/EDIT</b></td><td>HOLD THUMB 2</td><td>Arrows, word jump, cut/copy/paste</td></tr></table></div>'+
'<div class="sec"><h2>Toggle vs Momentary</h2>'+
'<ul><li><b><span class="tag tg">TG(n)</span></b> — tap to enter, stay after release.</li>'+
'<li><b><span class="tag mo">MO(n)</span></b> — hold to temporarily activate layer.</li>'+
'<li><b><span class="tag to">TO(n)</span></b> — toggle directly to layer n.</li></ul></div>'+
'<div class="sec"><h2>Flashing Firmware</h2>'+
'<p>Put Cheapino into bootloader mode (press reset). A drive named <b>RPI-RP2</b> appears. Drag the <code>.uf2</code> file onto it.</p>'+
'<ul><li><b>cheapino_vial-STOCK.uf2</b> — Stock VIAL firmware</li><li><b>cheapino_vial-PATCHED.uf2</b> — Patched VIAL firmware</li></ul></div>'+
'<div class="sec"><h2>Loading a Layout (.vil)</h2>'+
'<p>Open <a href="https://vial.rocks" target="_blank" style="color:var(--bl)">VIAL configurator</a>, connect keyboard, <b>File → Load Saved Layout</b>, select <code>.vil</code>.</p></div>';
}

async function init() {
  APP.basePath = '';
  initNav();
  const meta = await loadKeyboards();
  if (!meta) {
    const el = document.getElementById('keymap-visual');
    if (el) el.innerHTML = '<div class="empty-state"><p>Could not load keyboard data.</p></div>';
    return;
  }
  await loadProfile(APP.currentKeyboard, meta.profiles[0].file);
  renderConfigs();
  renderFiles();
  renderDocs();
}

document.addEventListener('DOMContentLoaded', init);
    });
  });
}

function renderFiles() {
  const el = document.getElementById('files-tree');
  if (!el) return;
  const meta = APP.metaMap[APP.currentKeyboard];
  if (!meta) return;
  const kb = APP.currentKeyboard;
  const base = APP.basePath + 'keyboards/' + kb + '/';
  const profs = meta.profiles.map(p => '<div class="tree-item file"><span class="icon">⌨</span><a href="'+base+p.file+'" target="_blank">'+p.file+'</a></div>').join('');
  const fws = (meta.firmware||[]).map(f => '<div class="tree-item file"><span class="icon">⚡</span><a href="'+base+'firmware/'+f.file+'" target="_blank">'+f.file+'</a></div>').join('');
  el.innerHTML = '<div class="file-tree">'+
    '<div class="tree-item"><span class="folder open" onclick="this.classList.toggle(\'open\')">keyboards/</span></div>'+
    '<div class="indent"><div class="tree-item"><span class="folder open" onclick="this.classList.toggle(\'open\')">'+kb+'/</span></div>'+
    '<div class="indent"><div class="tree-item file"><span class="icon">📄</span><a href="'+base+'meta.json" target="_blank">meta.json</a></div>'+profs+
    '<div class="tree-item"><span class="folder" onclick="this.classList.toggle(\'open\')">firmware/</span></div>'+
    '<div class="indent">'+fws+'</div></div></div></div>';
}