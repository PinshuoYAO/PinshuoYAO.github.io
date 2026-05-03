/* ============================================================
   Loaders Integration
   - Splash on first load (Veiled Arc)
   - Language switch overlay (Ink Bloom)
   - Section reveal hint (Breathing Orbit) — subtle, one-shot per section
   Pure DOM — no React dependency.
   ============================================================ */
(function(){
  'use strict';

  // Run BEFORE first paint (this script is synchronous, at end of body, so body exists).
  // If splash will run, hide the static-prerendered tweaks panel immediately so it
  // never flashes between first paint and splash-overlay insertion.
  const willShowSplash = !sessionStorage.getItem('__yao_splash_shown');
  if (willShowSplash && document.body) {
    document.body.classList.add('ld-splash-active');
  }

  // ---------- shared SVG strings (200x200 viewBox) ----------
  // Splash uses Drifting Dots — 12 dots in a ring, opacity wave traveling around
  const SVG_DRIFTING_DOTS = (function () {
    const N = 12;
    let circles = '';
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      const x = (100 + Math.cos(a) * 60).toFixed(2);
      const y = (100 + Math.sin(a) * 60).toFixed(2);
      const begin = (-i * 0.18).toFixed(2);
      circles += `
        <circle cx="${x}" cy="${y}" r="4" fill="currentColor">
          <animate attributeName="opacity" values="0.08;0.95;0.08" dur="2.4s" begin="${begin}s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
          <animate attributeName="r" values="2.5;5.5;2.5" dur="2.4s" begin="${begin}s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
        </circle>`;
    }
    return `<svg viewBox="0 0 200 200" width="200" height="200" aria-hidden="true">${circles}</svg>`;
  })();

  const SVG_INK_BLOOM = `
    <svg viewBox="0 0 200 200" width="160" height="160" aria-hidden="true">
      <defs>
        <radialGradient id="lib-blur" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.95"/>
          <stop offset="55%" stop-color="currentColor" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
        </radialGradient>
        <filter id="lib-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/>
          <feDisplacementMap in="SourceGraphic" scale="6"/>
        </filter>
      </defs>
      <circle cx="100" cy="100" r="22" fill="url(#lib-blur)" filter="url(#lib-noise)">
        <animate attributeName="r" values="8;52;58" dur="1.8s" repeatCount="indefinite" keyTimes="0;0.7;1" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 1 1"/>
        <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.4 0 0.6 1; 0.6 0 1 1"/>
      </circle>
      <circle cx="100" cy="100" r="14" fill="url(#lib-blur)" filter="url(#lib-noise)">
        <animate attributeName="r" values="4;38;44" dur="1.8s" begin="-0.3s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;1" keySplines="0.4 0 0.2 1; 0.4 0 1 1"/>
        <animate attributeName="opacity" values="0;0.7;0" dur="1.8s" begin="-0.3s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.4;1" keySplines="0.4 0 0.6 1; 0.6 0 1 1"/>
      </circle>
    </svg>`;

  const SVG_BREATHING_ORBIT_SMALL = `
    <svg viewBox="0 0 200 200" width="44" height="44" aria-hidden="true">
      <defs><filter id="lbo-soft"><feGaussianBlur stdDeviation="1.5"/></filter></defs>
      <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.18"/>
      <g style="transform-origin:100px 100px">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="3.2s" repeatCount="indefinite"/>
        <circle cx="148" cy="100" r="9" fill="currentColor" filter="url(#lbo-soft)">
          <animate attributeName="r" values="7;12;7" dur="1.6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.95;0.4" dur="1.6s" repeatCount="indefinite"/>
        </circle>
      </g>
      <g style="transform-origin:100px 100px">
        <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="3.2s" repeatCount="indefinite"/>
        <circle cx="148" cy="100" r="7" fill="currentColor" filter="url(#lbo-soft)">
          <animate attributeName="r" values="5;10;5" dur="1.6s" begin="-0.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.85;0.3" dur="1.6s" begin="-0.5s" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>`;

  // ---------- inject styles ----------
  const STYLE = `
  /* Hide tweaks panel + late-loading floats during splash so they don't flash */
  body.ld-splash-active .twk-panel,
  body.ld-splash-active .twk-toggle { opacity: 0 !important; pointer-events: none !important; }

  .ld-overlay {
    position: fixed; inset: 0; z-index: 2147483647;
    display: flex; align-items: center; justify-content: center;
    pointer-events: auto;
    background: var(--ld-bg, rgba(250,249,247,0.96));
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    color: var(--ld-fg, #0a0a0a);
    opacity: 1;
    transition: opacity .55s cubic-bezier(.4,0,.2,1);
  }
  .ld-overlay[data-loader="lang"] { opacity: 0; }
  .ld-overlay[data-loader="lang"].show { opacity: 1; }
  .ld-overlay.fading { opacity: 0; pointer-events: none; }
  body[data-theme="dark"] .ld-overlay { --ld-bg: rgba(15,18,22,0.92); --ld-fg: #f5f5f4; }
  body[data-mode="terminal"] .ld-overlay { --ld-bg: rgba(247,243,233,0.94); --ld-fg: #1a1614; }
  body[data-mode="terminal"][data-theme="dark"] .ld-overlay { --ld-bg: rgba(20,18,16,0.94); --ld-fg: #e8dfc9; }

  .ld-splash-content { display:flex; flex-direction:column; align-items:center; gap: 28px; }
  .ld-splash-mark {
    font: 500 11px/1 'JetBrains Mono', ui-monospace, monospace;
    letter-spacing: 0.18em; text-transform: uppercase;
    opacity: 0; animation: ld-fade-in .7s .25s ease forwards;
    color: currentColor;
  }
  @keyframes ld-fade-in { to { opacity: 0.55; } }

  /* section reveal hint — small dot in upper-right corner of each section as it enters */
  .ld-section-hint {
    position: absolute; top: 24px; right: 24px;
    pointer-events: none; opacity: 0;
    transition: opacity .4s ease;
    color: var(--accent, #0a0a0a);
    z-index: 5;
  }
  .ld-section-hint.active { opacity: 0.6; animation: ld-hint-fade 1.6s .15s ease forwards; }
  @keyframes ld-hint-fade {
    0%   { opacity: 0; transform: scale(0.85); }
    35%  { opacity: 0.55; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.05); }
  }

  body[data-mode="terminal"] .ld-section-hint { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .ld-overlay, .ld-section-hint { transition: none !important; animation: none !important; }
    .ld-overlay svg * { animation-duration: 0s !important; }
  }
  `;

  function injectStyle() {
    if (document.getElementById('loaders-integration-style')) return;
    const s = document.createElement('style');
    s.id = 'loaders-integration-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  // ---------- splash on first paint ----------
  function showSplash() {
    const sessionKey = '__yao_splash_shown';
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');

    document.body.classList.add('ld-splash-active');

    const ov = document.createElement('div');
    ov.className = 'ld-overlay';
    ov.setAttribute('data-loader', 'splash');
    ov.innerHTML = `
      <div class="ld-splash-content">
        ${SVG_DRIFTING_DOTS}
        <div class="ld-splash-mark">YAO · 姚品碩</div>
      </div>`;
    document.body.appendChild(ov);

    setTimeout(() => {
      ov.classList.add('fading');
      setTimeout(() => {
        ov.remove();
        document.body.classList.remove('ld-splash-active');
      }, 600);
    }, 1600);
  }

  // ---------- lang-switch overlay ----------
  let langOverlayBusy = false;
  function showLangOverlay() {
    if (langOverlayBusy) return;
    langOverlayBusy = true;

    const ov = document.createElement('div');
    ov.className = 'ld-overlay';
    ov.setAttribute('data-loader', 'lang');
    ov.innerHTML = `<div class="ld-splash-content">${SVG_INK_BLOOM}</div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('show'));

    setTimeout(() => {
      ov.classList.add('fading');
      setTimeout(() => {
        ov.remove();
        langOverlayBusy = false;
      }, 550);
    }, 700);
  }

  // Intercept lang-pills clicks (delegated, so React rerenders don't break it)
  function attachLangListener() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-pills button');
      if (!btn) return;
      // Only if the clicked one isn't already active — avoids overlay on no-op clicks
      if (btn.classList.contains('active')) return;
      showLangOverlay();
    }, true);
  }

  // ---------- per-section reveal hint ----------
  function attachSectionHints() {
    const seen = new WeakSet();
    function tagSections() {
      const sections = document.querySelectorAll('main section[id]');
      sections.forEach(sec => {
        if (seen.has(sec)) return;
        seen.add(sec);
        // Some sections are position:static — make them relative so absolute hint anchors correctly
        const cs = getComputedStyle(sec);
        if (cs.position === 'static') sec.style.position = 'relative';

        const hint = document.createElement('div');
        hint.className = 'ld-section-hint';
        hint.innerHTML = SVG_BREATHING_ORBIT_SMALL;
        sec.appendChild(hint);

        const io = new IntersectionObserver((entries) => {
          entries.forEach(en => {
            if (en.isIntersecting) {
              hint.classList.add('active');
              io.disconnect();
            }
          });
        }, { threshold: 0.18 });
        io.observe(sec);
      });
    }
    // Run once now and again after React hydrates
    tagSections();
    const mo = new MutationObserver(() => tagSections());
    mo.observe(document.body, { childList: true, subtree: true });
    // Stop observing after a few seconds — we've caught everything by then
    setTimeout(() => mo.disconnect(), 5000);
  }

  // ---------- boot ----------
  function init() {
    injectStyle();
    showSplash();
    attachLangListener();
    // Wait for React to render sections before tagging
    setTimeout(attachSectionHints, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
