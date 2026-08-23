/* =========================================================================
   post-export.js — export a blog post as a PNG carousel, zipped.

   Drop `<script src="../post-export.js" defer></script>` into any post under
   posts/ and an "Export" button appears in .post-nav-actions. Nothing else in
   the post needs to change: the language label follows body[data-lang] through
   a MutationObserver, so the post's own applyLang() stays untouched.

   What it produces: 1200 x 1600 PNGs, one per card, in a .zip. Cards are
   packed greedily and never cut a block in half — a paragraph, figure, table
   or list that does not fit moves whole to the next card.

   Design decisions worth knowing before you change a number:

   - Type is sized for a social feed, not for a document. A 1200px card is
     displayed at roughly 390 CSS px on a phone, so 36px body type reads as
     ~12px in the feed. Web-sized 17px type would land at 5.6px.
   - The export sheet does NOT reuse the post's classes. Cloned blocks get
     their class stripped and a pxp-* class instead, so styles.css and the
     post's own <style> cannot reach them. That is deliberate: html2canvas
     silently drops color-mix(), clamp()/vw resolve against the wrong
     viewport, and specificity fights are not worth debugging in a raster.
   - Light theme always, whatever the visitor has toggled, so the cards match
     the OG share images.
   - Alignment follows the site principle (see the yao-personal-hp skill):
     the card measure is 1072px, which is ~62 Latin characters, below the ~65
     needed to justify without hyphenation, so Latin is ragged-right here.
     CJK justifies at any measure and does.
   ========================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- config */

  var CFG = {
    W: 1200,
    H: 1600,
    PAD_X: 64,
    PAD_TOP: 52,
    PAD_BOTTOM: 46,
    SITE: 'pinshuoyao.github.io',
    QR_SRC: '../assets/qr.png',
    ACCENT: '#16a34a',
    BG: '#fafaf7',
    FG: '#0a0a0a',
    MUTED: '#6b6b6b',
    LINE: 'rgba(10,10,10,0.14)',
    // Slack left at the bottom of a card is spread between its blocks rather
    // than pooled at the foot, but only up to this much per gap — beyond it
    // the card stops reading as typeset and starts reading as broken.
    MAX_EXTRA_GAP: 46,
    /* How far a figure may be shrunk to keep it on the card it started on.
       SOFT applies everywhere and is small enough that neighbouring cards do
       not look like they are at different zoom levels. HARD is only reached
       when the alternative is leaving a card under RESCUE_FILL full, where a
       visibly smaller figure beats half a card of nothing.

       HARD is 0.68 because 0.72 is the deepest shrink actually checked at feed
       size (fig2 on English card 6, viewed at 390px wide): the panel structure
       and the caption still carry the point there. Anything lower is a number
       nobody has looked at. Note that these paper figures stop being readable
       *data* well before this matters — fig1 is already borderline at full
       card width — so the caption has to carry the message either way. If you
       lower this, downscale a rendered card to 390px and look at it. */
    FIG_SCALE_SOFT: 0.85,
    FIG_SCALE_HARD: 0.68,
    RESCUE_FILL: 0.52,
    /* Fitting the post into a chosen number of images grows the page height
       and nothing else. Width, type scale and figure sizes stay exactly as
       they are in the default card, so the pixels-per-em is identical and a
       2-image export is the same typography on a longer canvas. */
    H_MIN: 900,
    H_MAX: 30000,
    H2C_URL: 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js',
    H2C_SRI: 'sha384-ZZ1pncU3bQe8y31yfZdMFdSpttDoPmOZg2wguVK9almUodir1PghgT0eY7Mrty8H'
  };

  var T = {
    en: {
      btn: 'Export', busy: 'Rendering', packing: 'Packing', done: 'Saved',
      fail: 'Export failed',
      cards: function (n) { return n + ' cards'; },
      qrLead: 'Scan to read the full post',
      qrBy: 'YAO Pinshuo · The University of Tokyo',
      menuTitle: 'Export as',
      menuDefault: 'Cards',
      menuCount: function (n) { return n === 1 ? 'One long image' : n + ' long images'; },
      menuNote: 'Same width and type size, taller pages'
    },
    zh: {
      btn: '导出', busy: '渲染中', packing: '打包中', done: '已保存',
      fail: '导出失败',
      cards: function (n) { return n + ' 张卡片'; },
      qrLead: '扫码阅读全文',
      qrBy: '姚品碩 · 东京大学',
      menuTitle: '导出为',
      menuDefault: '卡片',
      menuCount: function (n) { return n + ' 张长图'; },
      menuNote: '宽度与字号不变，只是更长'
    },
    ja: {
      btn: '書き出し', busy: '描画中', packing: '圧縮中', done: '保存しました',
      fail: '書き出しに失敗',
      cards: function (n) { return 'カード ' + n + ' 枚'; },
      qrLead: '全文はこちらから',
      qrBy: '姚品碩 · 東京大学',
      menuTitle: '書き出し形式',
      menuDefault: 'カード',
      menuCount: function (n) { return n === 1 ? '長い画像 1 枚' : '長い画像 ' + n + ' 枚'; },
      menuNote: '幅と文字サイズは同じ、縦だけ長くなる'
    }
  };

  /* Pass `lang` whenever the caller knows it. Falling back to body[data-lang]
     is right for the button label, but wrong inside build(lang): those two
     agree when a visitor clicks Export and disagree the moment anything builds
     a language other than the one on screen. */
  function t(key, lang) {
    lang = lang || document.body.getAttribute('data-lang') || 'en';
    return (T[lang] || T.en)[key];
  }

  /* ------------------------------------------------------------ stylesheet */

  /* Every value here is a plain number or hex. No clamp(), no vw, no
     color-mix(), no custom property that resolves outside .pxp-page. */
  var SHEET = [
    '.pxp-stage{position:fixed;left:-20000px;top:0;width:' + CFG.W + 'px;z-index:-1;}',

    '.pxp-page{',
    '  --accent:' + CFG.ACCENT + ';--fg:' + CFG.FG + ';--bg:' + CFG.BG + ';',
    '  --muted:' + CFG.MUTED + ';--line:' + CFG.LINE + ';--line-soft:' + CFG.LINE + ';',
    '  width:' + CFG.W + 'px;height:var(--pxp-h,' + CFG.H + 'px);box-sizing:border-box;',
    '  padding:' + CFG.PAD_TOP + 'px ' + CFG.PAD_X + 'px ' + CFG.PAD_BOTTOM + 'px;',
    '  background:' + CFG.BG + ';color:' + CFG.FG + ';',
    '  display:flex;flex-direction:column;overflow:hidden;',
    '  font-family:"Source Serif 4",Georgia,"Times New Roman",serif;',
    '  font-size:36px;line-height:1.6;font-weight:400;font-style:normal;',
    '  text-align:left;hyphens:none;-webkit-hyphens:none;',
    '}',

    /* Neutralise anything the site sheets would otherwise reach. :where() has
       zero specificity, so every pxp-* rule below still wins, while plain
       element rules in styles.css lose. Inline semantics (b/i/em/span/sub/sup)
       are deliberately left out so emphasis survives the clone. */
    '.pxp-page :where(p,h1,h2,h3,h4,ul,ol,li,figure,figcaption,table,thead,',
    'tbody,tr,th,td,div,a,blockquote){',
    '  color:inherit;background:transparent;margin:0;padding:0;border:0;',
    '  font:inherit;letter-spacing:normal;text-align:inherit;max-width:none;',
    '  text-transform:none;text-decoration:none;',
    '}',

    /* running head / foot */
    '.pxp-head,.pxp-foot{flex:0 0 auto;display:flex;justify-content:space-between;',
    '  align-items:baseline;gap:24px;font-family:"JetBrains Mono","Courier New",monospace;',
    '  font-size:19px;line-height:1.2;letter-spacing:0.13em;text-transform:uppercase;',
    '  color:' + CFG.MUTED + ';}',
    '.pxp-head{padding-bottom:15px;border-bottom:1px solid ' + CFG.LINE + ';margin-bottom:40px;}',
    '.pxp-foot{padding-top:15px;border-top:1px solid ' + CFG.LINE + ';margin-top:36px;}',
    '.pxp-foot .pxp-no{color:' + CFG.FG + ';letter-spacing:0.16em;}',
    '.pxp-head .pxp-dot{display:inline-block;width:10px;height:10px;border-radius:50%;',
    '  background:' + CFG.ACCENT + ';margin-right:12px;vertical-align:middle;}',

    /* the measured area: everything below packs into this box */
    '.pxp-body{flex:1 1 auto;min-height:0;overflow:hidden;}',
    '.pxp-body > *{margin-top:34px;}',
    '.pxp-body > *:first-child{margin-top:0;}',
    '.pxp-body.pxp-center{display:flex;flex-direction:column;justify-content:center;}',

    /* ---- cover ---- */
    '.pxp-cover .pxp-rule{width:96px;height:3px;background:' + CFG.ACCENT + ';margin-bottom:30px;}',
    '.pxp-cover .pxp-kicker{font-family:"JetBrains Mono","Courier New",monospace;',
    '  font-size:21px;letter-spacing:0.2em;text-transform:uppercase;color:' + CFG.MUTED + ';',
    '  margin-bottom:26px;}',
    '.pxp-cover .pxp-title{font-size:76px;line-height:1.06;font-style:italic;',
    '  letter-spacing:-0.02em;margin-bottom:30px;}',
    '.pxp-cover .pxp-stand{font-size:34px;line-height:1.5;color:' + CFG.MUTED + ';',
    '  margin-bottom:30px;}',
    '.pxp-cover .pxp-meta{font-family:"JetBrains Mono","Courier New",monospace;',
    '  font-size:20px;line-height:1.7;letter-spacing:0.06em;color:' + CFG.MUTED + ';',
    '  padding-top:22px;border-top:1px solid ' + CFG.LINE + ';}',
    '.pxp-cover .pxp-meta span{margin-right:30px;white-space:nowrap;}',

    /* ---- body blocks ---- */
    '.pxp-h2{font-size:54px;line-height:1.16;font-style:italic;letter-spacing:-0.01em;}',
    '.pxp-p{font-size:36px;line-height:1.6;}',
    '.pxp-ul{padding-left:0;list-style:none;}',
    '.pxp-ul li{font-size:36px;line-height:1.56;position:relative;padding-left:38px;',
    '  margin-bottom:20px;}',
    '.pxp-ul li:last-child{margin-bottom:0;}',
    /* The offset is measured from the top of the LINE BOX, not from the text,
       so half the leading is spent before a glyph appears. 0.5em floats the
       dash above the cap height. CJK needs more again: the glyphs sit lower in
       their em box and run at a looser line-height here. Both values were set
       by looking at a rendered card, not derived. */
    '.pxp-ul li::before{content:"";position:absolute;left:6px;top:0.88em;width:16px;',
    '  height:2px;background:' + CFG.ACCENT + ';}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-ul li::before,',
    '.pxp-page[data-pxp-lang="ja"] .pxp-ul li::before{top:1.06em;}',
    '.pxp-pull{border-left:4px solid ' + CFG.ACCENT + ';padding-left:34px;',
    '  font-size:44px;line-height:1.36;}',

    '.pxp-fig{border:1px solid ' + CFG.LINE + ';background:#fff;padding:14px;}',
    '.pxp-fig img{display:block;max-width:100%;max-height:1040px;width:auto;height:auto;',
    '  margin:0 auto;}',
    '.pxp-fig figcaption{font-family:"Neue Haas Grotesk Display Pro","Helvetica Neue",',
    '  Inter,system-ui,sans-serif;font-size:25px;line-height:1.45;color:' + CFG.MUTED + ';',
    '  margin-top:14px;text-align:left;}',
    '.pxp-fig figcaption b{color:' + CFG.FG + ';font-weight:600;}',

    '.pxp-table{overflow:visible;}',
    '.pxp-table table{width:100%;border-collapse:collapse;',
    '  font-family:"JetBrains Mono","Courier New",monospace;font-size:25px;}',
    '.pxp-table th{text-align:left;font-size:19px;letter-spacing:0.1em;',
    '  text-transform:uppercase;color:' + CFG.MUTED + ';font-weight:600;',
    '  padding:0 16px 12px 0;border-bottom:1px solid ' + CFG.LINE + ';}',
    '.pxp-table td{padding:14px 16px 14px 0;border-bottom:1px solid ' + CFG.LINE + ';',
    '  vertical-align:top;}',
    '.pxp-table td:first-child{font-weight:600;white-space:nowrap;}',

    '.pxp-source{border-top:1px solid ' + CFG.LINE + ';padding-top:26px;}',
    '.pxp-source p{font-size:26px;line-height:1.5;color:' + CFG.MUTED + ';margin-bottom:16px;}',
    '.pxp-source p:last-child{margin-bottom:0;}',
    '.pxp-source b{color:' + CFG.FG + ';font-weight:600;}',

    /* ---- inline emphasis. The marker band and the rule are NOT drawn by
            these rules: see flattenEmphasis(). All that is kept here is the
            "never italic, never bold" part of the house style, plus the
            live-DOM appearance for anyone inspecting the stage. ---- */
    '.pxp-page .hl,.pxp-page .ul{font-style:normal;font-weight:inherit;}',
    '.pxp-band{position:absolute;display:block;pointer-events:none;}',
    '.pxp-band-hl{background:rgba(22,163,74,0.32);}',
    '.pxp-band-ul{background:rgba(22,163,74,0.62);}',
    '.pxp-page a{color:' + CFG.FG + ';text-decoration:underline;',
    '  text-decoration-color:rgba(22,163,74,0.55);text-underline-offset:5px;}',
    '.pxp-page b,.pxp-page strong{font-weight:600;}',
    '.pxp-page code{font-family:"JetBrains Mono","Courier New",monospace;font-size:0.86em;',
    '  background:rgba(10,10,10,0.05);padding:2px 8px;border:1px solid ' + CFG.LINE + ';}',
    '.pxp-page i,.pxp-page em{font-style:italic;}',
    '.pxp-page sub,.pxp-page sup{font-size:0.66em;}',

    /* ---- QR card ---- */
    '.pxp-qr{text-align:center;}',
    '.pxp-qr .pxp-rule{width:96px;height:3px;background:' + CFG.ACCENT + ';margin:0 auto 36px;}',
    '.pxp-qr .pxp-lead{font-size:48px;line-height:1.28;margin-bottom:34px;}',
    '.pxp-qr .pxp-ttl{font-size:36px;line-height:1.32;font-style:italic;color:' + CFG.MUTED + ';',
    '  margin-bottom:40px;padding:0 40px;}',
    '.pxp-qr img{width:430px;height:430px;display:block;margin:0 auto 36px;',
    '  border:1px solid ' + CFG.LINE + ';padding:22px;background:#fff;}',
    '.pxp-qr .pxp-url{font-family:"JetBrains Mono","Courier New",monospace;font-size:29px;',
    '  letter-spacing:0.04em;margin-bottom:20px;}',
    '.pxp-qr .pxp-by{font-size:28px;color:' + CFG.MUTED + ';}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-qr .pxp-ttl,',
    '.pxp-page[data-pxp-lang="ja"] .pxp-qr .pxp-ttl{font-style:normal;font-size:33px;}',

    /* ---- Chinese: keeps the serif face the site uses; justified, because
            CJK fills its lines at any measure ---- */
    '.pxp-page[data-pxp-lang="zh"]{font-size:34px;line-height:1.75;}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-p,',
    '.pxp-page[data-pxp-lang="zh"] .pxp-ul li{font-size:34px;line-height:1.75;}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-p,',
    '.pxp-page[data-pxp-lang="zh"] .pxp-stand,',
    '.pxp-page[data-pxp-lang="zh"] .pxp-source p{text-align:justify;',
    '  word-break:normal;line-break:strict;overflow-wrap:anywhere;}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-title{font-size:62px;line-height:1.22;',
    '  font-style:normal;letter-spacing:0.01em;}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-h2{font-size:46px;line-height:1.34;',
    '  font-style:normal;letter-spacing:0.02em;}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-pull{font-size:40px;line-height:1.5;font-style:normal;}',
    '.pxp-page[data-pxp-lang="zh"] .pxp-stand{font-size:32px;line-height:1.7;}',

    /* ---- Japanese: gothic for running text, mincho for headings, never
            italic. One step smaller than Latin at the same apparent size. ---- */
    '.pxp-page[data-pxp-lang="ja"]{font-family:"Noto Sans JP","Hiragino Sans",',
    '  "Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;',
    '  font-size:33px;line-height:1.78;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-p,',
    '.pxp-page[data-pxp-lang="ja"] .pxp-ul li{font-size:33px;line-height:1.78;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-p,',
    '.pxp-page[data-pxp-lang="ja"] .pxp-stand,',
    '.pxp-page[data-pxp-lang="ja"] .pxp-source p{text-align:justify;',
    '  word-break:normal;line-break:strict;overflow-wrap:anywhere;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-title,',
    '.pxp-page[data-pxp-lang="ja"] .pxp-h2,',
    '.pxp-page[data-pxp-lang="ja"] .pxp-qr .pxp-lead{',
    '  font-family:"Noto Serif JP","Yu Mincho",serif;font-style:normal;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-title{font-size:58px;line-height:1.26;',
    '  letter-spacing:0.01em;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-h2{font-size:44px;line-height:1.38;',
    '  letter-spacing:0.02em;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-pull{font-size:38px;line-height:1.55;font-style:normal;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-stand{font-size:31px;line-height:1.75;}',
    '.pxp-page[data-pxp-lang="ja"] .pxp-fig figcaption{font-family:"Noto Sans JP",',
    '  "Hiragino Sans",sans-serif;font-size:24px;}',

    /* ---- progress panel (never rendered into a card) ---- */
    '.pxp-hud{position:fixed;right:22px;bottom:22px;z-index:9999;min-width:250px;',
    '  background:var(--bg,#fafaf7);color:var(--fg,#0a0a0a);',
    '  border:1px solid var(--line-soft,rgba(10,10,10,.16));padding:14px 16px;',
    '  font-family:var(--font-mono,monospace);font-size:11px;letter-spacing:.08em;',
    '  text-transform:uppercase;box-shadow:0 8px 30px rgba(0,0,0,.12);}',
    '.pxp-hud-row{display:flex;justify-content:space-between;gap:14px;margin-bottom:9px;}',
    '.pxp-hud-bar{height:3px;background:var(--line-soft,rgba(10,10,10,.16));}',
    '.pxp-hud-fill{height:100%;width:0;background:var(--accent,#16a34a);transition:width .18s;}',
    '.pxp-btn{padding:5px 11px;font-size:11px;letter-spacing:.06em;',
    '  font-family:var(--font-mono,monospace);text-transform:uppercase;',
    '  border:1px solid var(--line-soft,rgba(10,10,10,.16));background:transparent;',
    '  transition:border-color .2s,color .2s;cursor:pointer;}',
    '.pxp-btn:hover:not(:disabled){border-color:var(--fg,#0a0a0a);color:var(--accent,#16a34a);}',
    '.pxp-btn:disabled{opacity:.55;cursor:default;}',
    '.pxp-menu{position:absolute;top:calc(100% + 8px);right:0;z-index:200;min-width:210px;',
    '  background:var(--bg,#fafaf7);border:1px solid var(--line-soft,rgba(10,10,10,.16));',
    '  box-shadow:0 10px 34px rgba(0,0,0,.14);padding:6px;text-align:left;}',
    '.pxp-menu-t{font-family:var(--font-mono,monospace);font-size:9px;letter-spacing:.14em;',
    '  text-transform:uppercase;color:var(--muted,#6b6b6b);padding:7px 10px 6px;}',
    '.pxp-menu button{display:block;width:100%;text-align:left;padding:8px 10px;',
    '  font-family:var(--font-mono,monospace);font-size:11px;letter-spacing:.04em;',
    '  background:transparent;border:0;cursor:pointer;color:var(--fg,#0a0a0a);',
    '  text-transform:none;}',
    '.pxp-menu button:hover{background:var(--paper,#f1efe8);color:var(--accent,#16a34a);}',
    '.pxp-menu-n{font-size:9px;color:var(--muted,#6b6b6b);padding:4px 10px 8px;',
    '  font-family:var(--font-mono,monospace);line-height:1.5;}',
    '.pxp-btn-wrap{position:relative;display:inline-block;}'
  ].join('\n');

  var sheetInjected = false;
  function injectSheet() {
    if (sheetInjected) return;
    var s = document.createElement('style');
    s.id = 'pxp-sheet';
    s.textContent = SHEET;
    document.head.appendChild(s);
    sheetInjected = true;
  }

  /* --------------------------------------------------------------- helpers */

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  /* The card is read off a phone, not clicked, so it needs the live URL and
     not localhost. og:url is the one place the post already states it. */
  function canonicalUrl() {
    var m = document.querySelector('meta[property="og:url"]');
    var url = m ? m.getAttribute('content') : '';
    if (!url) url = location.origin + location.pathname;
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  function loadScript(url, integrity) {
    return new Promise(function (resolve, reject) {
      if (window.html2canvas) return resolve();
      var s = document.createElement('script');
      s.src = url;
      if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
      s.onload = function () {
        window.html2canvas ? resolve() : reject(new Error('html2canvas did not define itself'));
      };
      s.onerror = function () { reject(new Error('could not load ' + url)); };
      document.head.appendChild(s);
    });
  }

  /* Fonts must be resolved before anything is measured. display=swap means an
     unloaded face measures with fallback metrics, and CJK fallbacks differ
     enough to throw every page break off. */
  function awaitFonts(lang) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var faces = [
      '400 36px "Source Serif 4"', 'italic 76px "Source Serif 4"',
      'italic 54px "Source Serif 4"', '600 36px "Source Serif 4"',
      '400 19px "JetBrains Mono"', '600 25px "JetBrains Mono"',
      '400 25px Inter'
    ];
    if (lang === 'ja') {
      faces.push('400 33px "Noto Sans JP"', '500 33px "Noto Sans JP"',
        '400 58px "Noto Serif JP"', '400 44px "Noto Serif JP"');
    }
    return Promise.all(faces.map(function (f) {
      return document.fonts.load(f).catch(function () {});
    })).then(function () { return document.fonts.ready; });
  }

  /* Pitfall 28b: a lazy image offscreen never loads, so it measures as zero
     height and silently corrupts every page break after it. Flipping the
     attribute to eager is what starts the fetch.

     Do NOT wait on img.decode() here. decode() reports rasterisation
     readiness, and an offscreen image is never rasterised in a headless or
     background-rendered view: the promise stays pending forever and the whole
     export hangs with no error. Measurement only needs intrinsic dimensions,
     which are available the moment `complete` goes true. */
  function awaitImages(root) {
    var imgs = Array.prototype.slice.call(root.querySelectorAll('img'));
    return Promise.all(imgs.map(function (im) {
      im.loading = 'eager';
      if (im.complete && im.naturalWidth > 0) return Promise.resolve();
      return new Promise(function (res) {
        var settled = false;
        function fin() { if (!settled) { settled = true; res(); } }
        im.addEventListener('load', fin, { once: true });
        im.addEventListener('error', fin, { once: true });
        setTimeout(fin, 15000);   // one bad asset must not hang the export
      });
    }));
  }

  /* ----------------------------------------------------- block preparation */

  /* Strip site classes off a cloned block so only the export sheet reaches it,
     but keep the inline emphasis spans, which the sheet re-declares. */
  function sanitise(node) {
    node.removeAttribute('style');
    /* html2canvas cannot rasterise a <video>: the block would come out as an
       empty card, silently. Swap in the poster frame, which every post video
       carries for its own first paint anyway. A video with no poster is
       dropped rather than shipped blank. */
    Array.prototype.slice.call(node.querySelectorAll('video')).forEach(function (v) {
      var poster = v.getAttribute('poster');
      if (poster) {
        var im = document.createElement('img');
        im.src = poster;
        im.alt = v.getAttribute('aria-label') || '';
        v.parentNode.replaceChild(im, v);
      } else {
        console.warn('[post-export] video without a poster, dropped from the cards', v);
        v.parentNode.removeChild(v);
      }
    });
    Array.prototype.forEach.call(node.querySelectorAll('[style]'), function (n) {
      n.removeAttribute('style');
    });
    Array.prototype.forEach.call(node.querySelectorAll('[class]'), function (n) {
      var keep = [];
      if (n.classList.contains('hl')) keep.push('hl');
      if (n.classList.contains('ul')) keep.push('ul');
      if (keep.length) n.className = keep.join(' ');
      else n.removeAttribute('class');
    });
    return node;
  }

  function coverBlock(src) {
    var box = el('div', 'pxp-cover');
    box.appendChild(el('div', 'pxp-rule'));
    var k = src.querySelector('.post-kicker');
    if (k) box.appendChild(el('div', 'pxp-kicker', k.textContent.trim()));
    var ttl = src.querySelector('.post-title');
    if (ttl) {
      var h = el('h1', 'pxp-title');
      h.textContent = ttl.textContent.trim();
      box.appendChild(h);
    }
    var st = src.querySelector('.post-standfirst');
    if (st) {
      var p = sanitise(st.cloneNode(true));
      p.className = 'pxp-stand';
      box.appendChild(p);
    }
    var meta = src.querySelector('.post-meta');
    if (meta) {
      var m = el('div', 'pxp-meta');
      Array.prototype.forEach.call(meta.children, function (c) {
        m.appendChild(el('span', null, c.textContent.trim()));
      });
      box.appendChild(m);
    }
    return box;
  }

  function bodyBlock(node) {
    var tag = node.tagName.toLowerCase();
    var c = sanitise(node.cloneNode(true));
    if (tag === 'h2') { c.className = 'pxp-h2'; return c; }
    if (tag === 'p') { c.className = 'pxp-p'; return c; }
    if (tag === 'ul' || tag === 'ol') { c.className = 'pxp-ul'; return c; }
    if (tag === 'figure') { c.className = 'pxp-fig'; return c; }
    if (node.classList.contains('pull')) { c.className = 'pxp-pull'; return c; }
    if (node.querySelector('table')) { c.className = 'pxp-table'; return c; }
    c.className = 'pxp-p';
    return c;
  }

  function sourceBlock(foot) {
    var c = sanitise(foot.cloneNode(true));
    c.className = 'pxp-source';
    // the "back to the blog" link is navigation, not content
    Array.prototype.slice.call(c.querySelectorAll('a')).forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.indexOf('index.html') !== -1) {
        var p = a.closest('p');
        if (p && p.parentNode) p.parentNode.removeChild(p);
      }
    });
    return c;
  }

  function collectBlocks(langRoot) {
    var blocks = [coverBlock(langRoot)];
    var body = langRoot.querySelector('.post-body');
    if (body) {
      Array.prototype.forEach.call(body.children, function (n) {
        if (!n.textContent.trim() && !n.querySelector('img')) return;
        blocks.push(bodyBlock(n));
      });
    }
    var foot = langRoot.querySelector('.post-foot');
    if (foot) blocks.push(sourceBlock(foot));
    return blocks;
  }

  /* ------------------------------------------------------------ pagination */

  function makePage(stage, lang, headLeft, headRight) {
    var page = el('div', 'pxp-page');
    page.setAttribute('data-pxp-lang', lang);

    var head = el('div', 'pxp-head');
    var hl = el('div');
    hl.appendChild(el('span', 'pxp-dot'));
    hl.appendChild(document.createTextNode(headLeft));
    head.appendChild(hl);
    head.appendChild(el('div', null, headRight));

    var body = el('div', 'pxp-body');

    var foot = el('div', 'pxp-foot');
    foot.appendChild(el('div', null, CFG.SITE));
    foot.appendChild(el('div', 'pxp-no', ''));

    page.appendChild(head);
    page.appendChild(body);
    page.appendChild(foot);
    stage.appendChild(page);
    return { page: page, body: body, foot: foot };
  }

  function overflows(body) {
    return body.scrollHeight > body.clientHeight;
  }

  /* How much of the card is unused. scrollHeight is NOT the answer: it is
     defined as at least clientHeight, so an almost-empty card reports zero
     slack and every "spread the leftover" trick silently does nothing.
     Measure from the bottom of the last block instead. */
  function slackOf(body) {
    var last = body.lastElementChild;
    if (!last) return body.clientHeight;
    return Math.round(
      body.getBoundingClientRect().top + body.clientHeight -
      last.getBoundingClientRect().bottom
    );
  }

  /* A figure that misses the current card by a little wastes the rest of that
     card and starts a new one. Print typesetting shrinks the figure instead,
     and so do we, down to the caller's minScale. */
  function tryFitFigure(block, body, minScale) {
    var img = block.querySelector('img');
    if (!img) return false;
    var natural = img.getBoundingClientRect().height;
    if (natural < 120) return false;
    var floor = natural * minScale;
    var h = natural, guard = 0;
    while (overflows(body) && h > floor && guard++ < 40) {
      h = Math.max(floor, h - 20);
      img.style.maxHeight = h + 'px';
    }
    if (!overflows(body)) return true;
    img.style.maxHeight = '';
    return false;
  }

  /* Last-resort guard. A block taller than a whole card can never be placed
     by "move it to the next card", so shrink it until it fits: images first,
     then type. It has never triggered on a real post; the console warning is
     there so that if it ever does, it is not silent. */
  function shrinkToFit(block, body) {
    var img = block.querySelector('img');
    var guard = 0;
    if (img) {
      var h = img.getBoundingClientRect().height;
      while (overflows(body) && h > 200 && guard++ < 40) {
        h -= 40;
        img.style.maxHeight = h + 'px';
      }
    }
    var scale = 1;
    while (overflows(body) && scale > 0.6 && guard++ < 80) {
      scale -= 0.04;
      block.style.fontSize = Math.round(36 * scale) + 'px';
    }
    console.warn('[post-export] a block exceeded one card and was scaled down', block);
  }

  /* paginate() and distributeSlack() write inline styles onto the blocks
     (shrunken figures, scaled type, distributed gaps). Searching for a page
     height repacks the same blocks many times, so every attempt has to start
     from the same state or the search converges on whatever the last attempt
     happened to leave behind. */
  function resetBlocks(blocks) {
    blocks.forEach(function (b) {
      b.style.marginTop = '';
      b.style.fontSize = '';
      var im = b.querySelector('img');
      if (im) im.style.maxHeight = '';
    });
  }

  function paginate(stage, blocks, lang, headLeft, headRight) {
    var pages = [];
    var cur = makePage(stage, lang, headLeft, headRight);
    pages.push(cur);

    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      cur.body.appendChild(b);
      if (!overflows(cur.body)) continue;

      /* Close the gap by shrinking the figure rather than by starting a new
         card. How far we may shrink depends on how empty this card would be
         left if we did not: a nearly-full card is not worth distorting a
         figure for, a third-full one is. */
      if (cur.body.children.length > 1) {
        cur.body.removeChild(b);
        var fillWithout = 1 - (slackOf(cur.body) / cur.body.clientHeight);
        cur.body.appendChild(b);
        var floor = fillWithout < CFG.RESCUE_FILL ? CFG.FIG_SCALE_HARD : CFG.FIG_SCALE_SOFT;
        if (tryFitFigure(b, cur.body, floor)) continue;
      }

      cur.body.removeChild(b);
      if (cur.body.children.length === 0) {
        // nothing to move it away from: it simply does not fit a card
        cur.body.appendChild(b);
        shrinkToFit(b, cur.body);
        cur = makePage(stage, lang, headLeft, headRight);
        pages.push(cur);
        continue;
      }

      // keep-with-next: a heading must not be the last thing on a card
      var trailing = null;
      var last = cur.body.lastElementChild;
      if (last && last.className === 'pxp-h2' && cur.body.children.length > 1) {
        trailing = last;
        cur.body.removeChild(last);
      }

      cur = makePage(stage, lang, headLeft, headRight);
      pages.push(cur);
      if (trailing) cur.body.appendChild(trailing);
      cur.body.appendChild(b);

      // a heading plus one oversized block can still overflow the fresh card
      if (overflows(cur.body) && cur.body.children.length > 1) {
        cur.body.removeChild(b);
        cur = makePage(stage, lang, headLeft, headRight);
        pages.push(cur);
        cur.body.appendChild(b);
        if (overflows(cur.body)) shrinkToFit(b, cur.body);
      }
    }

    // an empty trailing card can appear when the last block exactly filled one
    if (pages.length > 1 && pages[pages.length - 1].body.children.length === 0) {
      var dead = pages.pop();
      dead.page.parentNode.removeChild(dead.page);
    }
    return pages;
  }

  /* "不要留白太多": rather than pooling the leftover at the foot of a card,
     spread it between the blocks, capped so the card still reads as typeset.
     A card that is barely filled centres instead, which looks intentional
     where a top-aligned block with a 900px hole under it does not. */
  function distributeSlack(pages) {
    pages.forEach(function (p) {
      var kids = Array.prototype.slice.call(p.body.children);
      var slack = slackOf(p.body);
      if (slack <= 8) return;

      if (kids.length > 1) {
        var extra = Math.floor(Math.min(slack / (kids.length - 1), CFG.MAX_EXTRA_GAP)) - 1;
        if (extra > 0) {
          for (var i = 1; i < kids.length; i++) {
            kids[i].style.marginTop = (34 + extra) + 'px';
          }
          if (overflows(p.body)) {          // rounding backstop
            kids.forEach(function (k, j) { if (j) k.style.marginTop = ''; });
          }
        }
        slack = slackOf(p.body);
      }

      // still mostly empty: centring reads as a deliberate card, a block
      // pinned to the top with a 900px hole under it reads as a bug
      if (slack > p.body.clientHeight * 0.28) p.body.classList.add('pxp-center');
    });
  }

  /* html2canvas paints an inline element's background and borders ONCE, over
     the union of its line boxes. A .hl or .ul that wraps therefore comes out
     as a single band across the wrong lines: the second line is fully
     highlighted including words outside the span, the first line gets nothing.
     Verified, not theoretical.

     So the decoration is not drawn by CSS at all. Once the layout is final,
     each emphasis span is measured with getClientRects() (one rect per line
     fragment) and one absolutely-positioned band is placed per rect. Bands sit
     over the text at low alpha, which is how a highlighter behaves anyway and
     avoids relying on html2canvas honouring a negative z-index.

     Must run after pagination, slack distribution and centring: every one of
     those moves the text the rects are measured from. */
  function flattenEmphasis(page) {
    var spans = Array.prototype.slice.call(page.querySelectorAll('.hl, .ul'));
    spans.forEach(function (span) {
      var isHl = span.classList.contains('hl');
      var host = span.parentElement;
      while (host && host !== page && getComputedStyle(host).display.indexOf('inline') === 0) {
        host = host.parentElement;
      }
      if (!host || host === page) return;

      var rects = span.getClientRects();
      if (!rects.length) return;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      var hb = host.getBoundingClientRect();

      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (r.width < 1) continue;
        var band = document.createElement('span');
        band.className = 'pxp-band ' + (isHl ? 'pxp-band-hl' : 'pxp-band-ul');
        band.style.left = (r.left - hb.left) + 'px';
        band.style.width = r.width + 'px';
        if (isHl) {
          /* Marker band, matching the site's linear-gradient(transparent 64%):
             from mid x-height down to the bottom of the inline box. */
          band.style.top = (r.top - hb.top + r.height * 0.58) + 'px';
          band.style.height = (r.height * 0.40) + 'px';
        } else {
          /* Rule 1px clear of the inline box, i.e. just below the descenders.
             Sitting it at (bottom - 2) puts it straight through the tail of
             p, g and y — measured, not assumed. */
          band.style.top = (r.top - hb.top + r.height + 1) + 'px';
          band.style.height = '3px';
        }
        host.appendChild(band);
      }
      span.classList.remove('hl', 'ul');
    });
  }

  /* A short post can leave its last content card nearly empty: on the py2Dmol
     post the Japanese credit block landed alone on a card at 15% fill, right
     before an equally airy QR card. Credit and QR belong together anyway, so
     fold the tail into the closing card when it fits. Reverts cleanly if it
     does not, which is why it is a post-pass and not a packing rule. */
  function mergeTailIntoQr(pages, qr) {
    var last = pages[pages.length - 1];
    if (!last || last === qr) return false;
    if (1 - slackOf(last.body) / last.body.clientHeight >= CFG.RESCUE_FILL) return false;

    var kids = Array.prototype.slice.call(last.body.children);
    if (!kids.length) return false;
    var anchor = qr.body.firstElementChild;
    kids.forEach(function (k) { qr.body.insertBefore(k, anchor); });

    if (overflows(qr.body)) {
      kids.forEach(function (k) { last.body.appendChild(k); });
      return false;
    }
    last.page.parentNode.removeChild(last.page);
    pages.pop();
    return true;
  }

  /* The closing block on its own, so it can either take a card (default
     export) or ride at the foot of the last one (fixed image count). */
  function qrBlock(lang) {
    var box = el('div', 'pxp-qr');
    box.appendChild(el('div', 'pxp-rule'));
    box.appendChild(el('div', 'pxp-lead', t('qrLead', lang)));
    // restating the title stops the closing card being three-quarters empty,
    // and a card reshared on its own still says what it points to
    var srcTitle = document.querySelector('[data-post-lang="' + lang + '"] .post-title');
    if (srcTitle) box.appendChild(el('div', 'pxp-ttl', srcTitle.textContent.trim()));
    var img = document.createElement('img');
    img.src = CFG.QR_SRC;
    img.alt = '';
    box.appendChild(img);
    box.appendChild(el('div', 'pxp-url', canonicalUrl()));
    box.appendChild(el('div', 'pxp-by', t('qrBy', lang)));
    return box;
  }

  function qrCard(stage, lang, headLeft, headRight) {
    var c = makePage(stage, lang, headLeft, headRight);
    c.body.appendChild(qrBlock(lang));
    c.body.classList.add('pxp-center');
    return c;
  }

  /* ------------------------------------------------------------ zip (store) */

  var CRC = (function () {
    var tbl = new Uint32Array(256), c, n, k;
    for (n = 0; n < 256; n++) {
      c = n;
      for (k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      tbl[n] = c >>> 0;
    }
    return tbl;
  })();

  function crc32(buf) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /* Store-only: PNG is already deflated, so compressing again buys nothing and
     a hand-written store writer avoids a second CDN dependency. */
  function zipStore(entries) {
    var enc = new TextEncoder();
    var now = new Date();
    var time = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xFFFF;
    var date = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xFFFF;
    var local = [], central = [], offset = 0;

    entries.forEach(function (e) {
      var name = enc.encode(e.name);
      var crc = crc32(e.data);
      var size = e.data.length;

      var lh = new Uint8Array(30 + name.length);
      var lv = new DataView(lh.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true);   // UTF-8 filenames
      lv.setUint16(8, 0, true);        // method 0 = store
      lv.setUint16(10, time, true);
      lv.setUint16(12, date, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, size, true);
      lv.setUint32(22, size, true);
      lv.setUint16(26, name.length, true);
      lv.setUint16(28, 0, true);
      lh.set(name, 30);
      local.push(lh, e.data);

      var ch = new Uint8Array(46 + name.length);
      var cv = new DataView(ch.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, time, true);
      cv.setUint16(14, date, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, name.length, true);
      cv.setUint32(42, offset, true);
      ch.set(name, 46);
      central.push(ch);

      offset += lh.length + size;
    });

    var cdSize = central.reduce(function (a, b) { return a + b.length; }, 0);
    var eocd = new Uint8Array(22);
    var ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);

    return new Blob(local.concat(central, [eocd]), { type: 'application/zip' });
  }

  /* ------------------------------------------------------------------- hud */

  function makeHud() {
    var hud = el('div', 'pxp-hud');
    var row = el('div', 'pxp-hud-row');
    var label = el('span', null, '');
    var count = el('span', null, '');
    row.appendChild(label); row.appendChild(count);
    var bar = el('div', 'pxp-hud-bar');
    var fill = el('div', 'pxp-hud-fill');
    bar.appendChild(fill);
    hud.appendChild(row); hud.appendChild(bar);
    document.body.appendChild(hud);
    return {
      set: function (text, i, n) {
        label.textContent = text;
        count.textContent = n ? i + ' / ' + n : '';
        fill.style.width = n ? Math.round((i / n) * 100) + '%' : '0%';
      },
      done: function (text) {
        label.textContent = text; count.textContent = '';
        fill.style.width = '100%';
        setTimeout(function () { hud.remove(); }, 2600);
      }
    };
  }

  /* ----------------------------------------------------------------- export */

  /* Everything up to (but not including) rasterisation. Split out so the page
     breaks can be inspected without paying for a full render — see dryRun(). */
  /* One complete layout attempt at page height H. Clears whatever the previous
     attempt built, repacks, and attaches the QR block. Returns the page list.

     `inlineQr` is what makes a target count honest: with tall pages the last
     card has room to spare, so the QR rides at the foot of it instead of
     spending one of the user's images on a mostly empty card. The default
     1200x1600 export keeps its own behaviour, where the QR gets a card and
     mergeTailIntoQr pulls a short tail onto it. */
  function layoutAt(stage, blocks, lang, headLeft, headRight, H, inlineQr) {
    Array.prototype.slice.call(stage.querySelectorAll('.pxp-page'))
      .forEach(function (n) { n.remove(); });
    resetBlocks(blocks);
    stage.style.setProperty('--pxp-h', H + 'px');

    var pages = paginate(stage, blocks, lang, headLeft, headRight);

    if (inlineQr) {
      var box = qrBlock(lang);
      var last = pages[pages.length - 1];
      last.body.appendChild(box);
      if (overflows(last.body)) {
        last.body.removeChild(box);
        var extra = makePage(stage, lang, headLeft, headRight);
        extra.body.appendChild(box);
        extra.body.classList.add('pxp-center');
        pages.push(extra);
      }
    } else {
      var qr = qrCard(stage, lang, headLeft, headRight);
      mergeTailIntoQr(pages, qr);     // before slack, which reads final layout
      pages.push(qr);
    }
    return pages;
  }

  /* Smallest page height that fits the post into `target` images. Binary
     search over the height, repacking each time: the packer is the only thing
     that knows whether a given height works, because blocks never split.
     Nothing else about the layout changes, so the type stays the size it is in
     the default card. */
  function heightForCount(stage, blocks, lang, headLeft, headRight, target) {
    var lo = CFG.H_MIN, hi = CFG.H_MAX, best = null;
    for (var i = 0; i < 18 && lo <= hi; i++) {
      var mid = Math.floor((lo + hi) / 2);
      var n = layoutAt(stage, blocks, lang, headLeft, headRight, mid, true).length;
      if (n <= target) { best = mid; hi = mid - 1; } else { lo = mid + 1; }
    }
    if (best === null) {
      console.warn('[post-export] cannot fit ' + target +
        ' image(s) even at ' + CFG.H_MAX + 'px; using the tallest page');
      best = CFG.H_MAX;
    }
    return best;
  }

  function build(lang, opts) {
    opts = opts || {};
    var target = opts.targetCards || 0;
    var langRoot = document.querySelector('[data-post-lang="' + lang + '"]');
    if (!langRoot) return Promise.reject(new Error('no content for language ' + lang));

    var kicker = langRoot.querySelector('.post-kicker');
    var headRight = kicker ? kicker.textContent.trim() : 'BLOG';
    var headLeft = 'YAO Pinshuo · 姚品碩';
    var stage = el('div', 'pxp-stage');

    injectSheet();

    return awaitFonts(lang).then(function () {
      document.body.appendChild(stage);
      var blocks = collectBlocks(langRoot);
      /* Decode every image before a single height is read. These are the same
         nodes that get paginated afterwards, so once they have decoded here
         they stay decoded, and pagination measures real figure heights on its
         first and only pass. Warming up clones instead would measure the
         clones and then paginate the originals at zero height. */
      var warm = el('div', 'pxp-warm');
      warm.style.cssText = 'width:1072px;';
      blocks.forEach(function (b) { warm.appendChild(b); });
      stage.appendChild(warm);
      return awaitImages(warm).then(function () {
        blocks.forEach(function (b) { warm.removeChild(b); });
        warm.remove();

        var H = target
          ? heightForCount(stage, blocks, lang, headLeft, headRight, target)
          : CFG.H;
        var pages = layoutAt(stage, blocks, lang, headLeft, headRight, H, !!target);
        distributeSlack(pages);

        return awaitImages(stage).then(function () {
          var total = pages.length;
          pages.forEach(function (p, i) {
            p.foot.lastChild.textContent = pad2(i + 1) + ' / ' + pad2(total);
            flattenEmphasis(p.page);   // last: it measures the final layout
          });
          return { stage: stage, pages: pages, height: H };
        });
      });
    });
  }

  var running = false;

  function run(btn, opts) {
    if (running) return;
    opts = opts || {};
    running = true;
    if (btn) btn.disabled = true;

    var lang = document.body.getAttribute('data-lang') || 'en';
    var slug = (location.pathname.split('/').pop() || 'post').replace(/\.html?$/, '');
    var hud = makeHud();
    var stage = null;
    // a 4-image export and a default export of the same post are different
    // files; keep them apart in the download folder
    var tag = opts.targetCards ? '-' + opts.targetCards + 'up' : '';

    hud.set(t('busy'), 0, 0);

    loadScript(CFG.H2C_URL, CFG.H2C_SRI)
      .then(function () { return build(lang, opts); })
      .then(function (built) {
        stage = built.stage;
        return renderAll(built.pages, hud, slug, lang, built.height);
      })
      .then(function (entries) {
        hud.set(t('packing'), entries.length, entries.length);
        var blob = zipStore(entries);
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = slug + '-' + lang + tag + '-cards.zip';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
        hud.done(t('done') + ' · ' + t('cards')(entries.length));
      })
      .catch(function (err) {
        console.error('[post-export]', err);
        hud.done(t('fail'));
      })
      .then(function () {
        if (stage) stage.remove();
        running = false;
        if (btn) btn.disabled = false;
      });
  }

  /* Verification hook. Builds the cards, reports how full each one is and what
     is on it, then leaves the stage in the document (visible, at the top) so a
     screenshot shows every card at once. Call PostExport.dryRun('zh'). */
  function dryRun(lang, keepVisible, opts) {
    return build(lang || document.body.getAttribute('data-lang') || 'en', opts)
      .then(function (built) {
        var report = built.pages.map(function (p, i) {
          var kids = Array.prototype.slice.call(p.body.children);
          var content = kids.length === 1 && kids[0].className === 'pxp-qr'
            ? ['pxp-qr'] : kids.map(function (k) { return k.className; });
          // measured from the blocks themselves, so a centred card still
          // reports how full it actually is rather than half its slack
          var contentH = kids.reduce(function (a, k) {
            return a + k.getBoundingClientRect().height +
              parseFloat(getComputedStyle(k).marginTop || 0);
          }, 0);
          /* How far any figure on this card was shrunk, and how big it ends up
             against the original artwork. Worth reporting: a card is read at
             about a third of its pixel size in a feed, so `ofArtwork` 0.54
             means the figure is showing at ~0.18 of the resolution it was
             drawn at. Compare against the unshrunk case before blaming the
             shrink for anything. */
          var figScale = null;
          kids.forEach(function (k) {
            var im = k.querySelector && k.querySelector('img');
            if (!im || !im.naturalWidth) return;
            var box = im.parentElement.getBoundingClientRect().width - 30;
            var unshrunk = Math.min(box * im.naturalHeight / im.naturalWidth, 1040);
            var r = im.getBoundingClientRect();
            figScale = {
              file: (im.getAttribute('src') || '').split('/').pop(),
              ofUnshrunk: Math.round((r.height / unshrunk) * 100) / 100,
              ofArtwork: Math.round((r.width / im.naturalWidth) * 100) / 100
            };
          });
          return {
            card: i + 1,
            fill: Math.round((contentH / p.body.clientHeight) * 100) + '%',
            px: Math.round(contentH) + '/' + p.body.clientHeight,
            figScale: figScale,
            overflow: overflows(p.body),
            centered: p.body.classList.contains('pxp-center'),
            blocks: content,
            first: (kids[0] ? kids[0].textContent.trim().slice(0, 42) : '')
          };
        });
        if (keepVisible) {
          built.stage.style.cssText =
            'position:absolute;left:0;top:0;z-index:9999;transform:scale(0.25);' +
            'transform-origin:top left;display:flex;gap:16px;width:auto;';
        } else {
          built.stage.remove();
        }
        return report;
      });
  }

  function renderAll(pages, hud, slug, lang, H) {
    var entries = [];
    var folder = slug + '-' + lang;
    return pages.reduce(function (chain, p, i) {
      return chain.then(function () {
        hud.set(t('busy'), i + 1, pages.length);
        return window.html2canvas(p.page, {
          scale: 1,                       // default is devicePixelRatio: 2400px on a Retina Mac
          width: CFG.W,
          height: H,
          windowWidth: CFG.W,
          windowHeight: H,
          backgroundColor: CFG.BG,        // default is transparent
          useCORS: true,
          logging: false,
          imageTimeout: 20000
        }).then(function (canvas) {
          return new Promise(function (res, rej) {
            canvas.toBlob(function (blob) {
              if (!blob) return rej(new Error('toBlob returned null on card ' + (i + 1)));
              blob.arrayBuffer().then(function (buf) {
                entries.push({
                  name: folder + '/' + slug + '-' + pad2(i + 1) + '.png',
                  data: new Uint8Array(buf)
                });
                // Release the backing store now rather than at GC's leisure.
                // Each card is 1200x1600x4 = 7.7 MB live; holding twenty of
                // them alongside their PNG buffers is enough to make later
                // renders crawl.
                canvas.width = canvas.height = 0;
                res();
              }, rej);
            }, 'image/png');
          });
        });
      });
    }, Promise.resolve()).then(function () { return entries; });
  }

  /* ------------------------------------------------------------------ mount */

  /* Some platforms cap a post at four images. Offering the counts directly is
     more useful than a number field: the choice is always "how many will the
     platform take", never an arbitrary height. */
  var COUNTS = [4, 3, 2, 1];

  function buildMenu(wrap, btn) {
    var menu = el('div', 'pxp-menu');
    menu.appendChild(el('div', 'pxp-menu-t', t('menuTitle')));

    function item(label, opts) {
      var b = el('button', null, label);
      b.type = 'button';
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMenu();
        run(btn, opts);
      });
      menu.appendChild(b);
    }

    item(t('menuDefault') + '  ' + CFG.W + ' × ' + CFG.H, {});
    COUNTS.forEach(function (n) { item(t('menuCount')(n), { targetCards: n }); });
    menu.appendChild(el('div', 'pxp-menu-n', t('menuNote')));
    wrap.appendChild(menu);
    return menu;
  }

  var openMenu = null;
  function closeMenu() {
    if (openMenu) { openMenu.remove(); openMenu = null; }
    document.removeEventListener('click', closeMenu);
  }

  function mount() {
    var host = document.querySelector('.post-nav-actions');
    if (!host || !document.querySelector('[data-post-lang]')) return;

    /* The button and its menu are styled by the same sheet as the cards, so it
       has to be in the document from the start. Injecting it lazily inside
       build() left both unstyled until an export had already run once: the
       menu fell back to static flow and pushed the nav bar 100px taller. */
    injectSheet();

    var wrap = el('div', 'pxp-btn-wrap');
    var btn = el('button', 'pxp-btn', t('btn'));
    btn.type = 'button';
    btn.title = 'Export this post as PNG images (.zip)';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (openMenu) { closeMenu(); return; }
      openMenu = buildMenu(wrap, btn);
      setTimeout(function () { document.addEventListener('click', closeMenu); }, 0);
    });
    wrap.appendChild(btn);
    host.insertBefore(wrap, host.firstChild);

    // the post's own applyLang() only knows about its own elements, so follow
    // body[data-lang] instead of asking every post to call back into here
    new MutationObserver(function () {
      if (!running) btn.textContent = t('btn');
      closeMenu();
    }).observe(document.body, { attributes: true, attributeFilter: ['data-lang'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.PostExport = {
    run: run, dryRun: dryRun, build: build,
    zipStore: zipStore, crc32: crc32, CFG: CFG
  };
})();
