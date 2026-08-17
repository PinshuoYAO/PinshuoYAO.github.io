/* Shared behaviour for every page under posts/: language toggle, theme
   toggle, Tokyo clock. Self-mounting, like post-export.js, so a new post
   needs the script tag and nothing else. Preferences are shared with the
   main site through the same localStorage key. */

(function () {
  var STORE_KEY = 'yps-hp-prefs';
  function readPrefs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function writePrefs(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  var prefs = readPrefs();

  function applyLang(lang) {
    if (['en', 'zh', 'ja'].indexOf(lang) === -1) lang = 'en';
    document.body.setAttribute('data-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja' : 'en';
    document.querySelectorAll('[data-post-lang]').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-post-lang') === lang);
    });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-set-lang') === lang);
    });
    var t = document.querySelector('[data-post-lang].on .post-title');
    if (t) document.title = t.textContent + ' · YAO Pinshuo';
  }

  function applyTheme(theme) {
    if (theme !== 'dark') theme = 'light';
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    var b = document.getElementById('themeBtn');
    if (b) b.textContent = theme === 'dark' ? '\u2600\uFE0E' : '\u263E\uFE0E';
  }

  applyLang(prefs.lang || 'en');
  // follow the OS on a first visit; a stored choice always wins
  var systemDark = false;
  try { systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) {}
  applyTheme(prefs.theme || (systemDark ? 'dark' : 'light'));

  document.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-set-lang');
      prefs = readPrefs(); prefs.lang = lang; writePrefs(prefs);
      applyLang(lang);
    });
  });
  document.getElementById('themeBtn').addEventListener('click', function () {
    prefs = readPrefs();
    prefs.theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    writePrefs(prefs);
    applyTheme(prefs.theme);
  });

  /* A looping screen recording next to running text is a lot of motion.
     Respect the OS setting: hand the reader the controls instead. */
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    if (reduced) {
      v.autoplay = false; v.loop = false; v.controls = true; v.pause();
      return;
    }
    /* If the browser refuses muted autoplay, the poster frame is left sitting
       there looking like a static image with no way to start it. Give it
       controls instead, rather than a dead-looking element. */
    setTimeout(function () {
      if (v.paused) v.controls = true;
    }, 1200);
  });

  var clock = document.getElementById('clock');
  function tick() {
    var d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    function p(n) { return String(n).padStart(2, '0'); }
    clock.textContent = 'TYO ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  tick(); setInterval(tick, 1000);
})();
