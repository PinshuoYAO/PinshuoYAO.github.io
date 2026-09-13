/* prefs.js — reader preferences (language, theme) for the React app.
   Provides window.useTweaks(defaults) → [values, set], the same contract the
   app used from tweaks-panel.jsx, minus the design-tool panel that file also
   carried. Preferences are mirrored into localStorage under the same key the
   blog pages (posts/post.js) and the collection page read, so a choice made on
   one page follows the reader to the others. Plain JS: no compile step. */
(function () {
  var STORE_KEY = 'yps-hp-prefs';
  var VISITOR_KEYS = ['lang', 'theme'];
  var ALLOWED = { lang: ['en', 'zh', 'ja'], theme: ['light', 'dark'] };

  function readStoredPrefs() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw) || {};
      var out = {};
      VISITOR_KEYS.forEach(function (k) {
        if (ALLOWED[k].indexOf(parsed[k]) !== -1) out[k] = parsed[k];
      });
      return out;
    } catch (e) { return {}; }
  }
  function writeStoredPrefs(values) {
    try {
      var out = {};
      VISITOR_KEYS.forEach(function (k) { if (values[k]) out[k] = values[k]; });
      window.localStorage.setItem(STORE_KEY, JSON.stringify(out));
    } catch (e) { /* private mode: the choice just does not persist */ }
  }
  // Follow the operating system on a first visit; a stored choice always wins.
  function systemTheme() {
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    catch (e) { return null; }
  }

  function useTweaks(defaults) {
    var state = React.useState(function () {
      var stored = readStoredPrefs();
      var base = Object.assign({}, defaults);
      if (!stored.theme) { var sys = systemTheme(); if (sys) base.theme = sys; }
      return Object.assign(base, stored);
    });
    var values = state[0], setValues = state[1];
    // set('lang', 'zh') or set({ lang: 'zh', theme: 'dark' })
    var set = React.useCallback(function (keyOrEdits, val) {
      var edits = {};
      if (keyOrEdits && typeof keyOrEdits === 'object') edits = keyOrEdits;
      else if (typeof keyOrEdits === 'string') edits[keyOrEdits] = val;
      setValues(function (prev) {
        var next = Object.assign({}, prev, edits);
        if (VISITOR_KEYS.some(function (k) { return k in edits; })) writeStoredPrefs(next);
        return next;
      });
    }, []);
    return [values, set];
  }

  window.useTweaks = useTweaks;
  window.readStoredPrefs = readStoredPrefs;
})();
