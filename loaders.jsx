/* 9 elegant B&W loaders — natural, hazy feel */
/* Every loader is 200×200, monochrome, no text */

const { useEffect, useRef, useState } = React;

// ============================================================
// 01 — INK BLOOM
// A soft ink drop expanding and dissipating like watercolor on rice paper
// ============================================================
function InkBloom() {
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <radialGradient id="ink-blur" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.95"/>
            <stop offset="55%" stopColor="#0a0a0a" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0"/>
          </radialGradient>
          <filter id="ink-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3"/>
            <feDisplacementMap in="SourceGraphic" scale="6"/>
          </filter>
        </defs>
        <g style={{ transformOrigin: '100px 100px' }}>
          <circle cx="100" cy="100" r="22" fill="url(#ink-blur)" filter="url(#ink-noise)">
            <animate attributeName="r" values="8;52;58" dur="3.6s" repeatCount="indefinite" keyTimes="0;0.7;1" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 1 1"/>
            <animate attributeName="opacity" values="0;1;0" dur="3.6s" repeatCount="indefinite" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.4 0 0.6 1; 0.6 0 1 1"/>
          </circle>
          <circle cx="100" cy="100" r="14" fill="url(#ink-blur)" filter="url(#ink-noise)">
            <animate attributeName="r" values="4;38;44" dur="3.6s" begin="-0.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.7;1" keySplines="0.4 0 0.2 1; 0.4 0 1 1"/>
            <animate attributeName="opacity" values="0;0.7;0" dur="3.6s" begin="-0.6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.4;1" keySplines="0.4 0 0.6 1; 0.6 0 1 1"/>
          </circle>
        </g>
      </svg>
    </div>
  );
}

// ============================================================
// 02 — BREATHING ORBIT
// Three soft circles orbiting a slow center, pulsing as they pass
// ============================================================
function BreathingOrbit() {
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <filter id="bo-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5"/>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="48" fill="none" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.15"/>
        <g style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4.8s" repeatCount="indefinite"/>
          <circle cx="148" cy="100" r="8" fill="#0a0a0a" filter="url(#bo-soft)">
            <animate attributeName="r" values="6;11;6" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0.3;0.95;0.3" dur="2.4s" repeatCount="indefinite"/>
          </circle>
        </g>
        <g style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="4.8s" repeatCount="indefinite"/>
          <circle cx="148" cy="100" r="6" fill="#0a0a0a" filter="url(#bo-soft)">
            <animate attributeName="r" values="4;9;4" dur="2.4s" begin="-0.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0.25;0.85;0.25" dur="2.4s" begin="-0.8s" repeatCount="indefinite"/>
          </circle>
        </g>
        <g style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" from="240 100 100" to="600 100 100" dur="4.8s" repeatCount="indefinite"/>
          <circle cx="148" cy="100" r="5" fill="#0a0a0a" filter="url(#bo-soft)">
            <animate attributeName="r" values="3;7;3" dur="2.4s" begin="-1.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0.2;0.75;0.2" dur="2.4s" begin="-1.6s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>
    </div>
  );
}

// ============================================================
// 03 — DRIFTING DOTS
// 12 dots forming a ring; opacity wave traveling around like fog
// ============================================================
function DriftingDots() {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: 100 + Math.cos(a) * 60, y: 100 + Math.sin(a) * 60, i };
  });
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        {dots.map(d => (
          <circle key={d.i} cx={d.x} cy={d.y} r="4" fill="#0a0a0a">
            <animate
              attributeName="opacity"
              values="0.08;0.95;0.08"
              dur="2.4s"
              begin={`${-d.i * 0.18}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
            <animate
              attributeName="r"
              values="2.5;5.5;2.5"
              dur="2.4s"
              begin={`${-d.i * 0.18}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ============================================================
// 04 — VEILED ARC
// A blurred, softened arc rotating like mist on water
// ============================================================
function VeiledArc() {
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <linearGradient id="va-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0"/>
            <stop offset="60%" stopColor="#0a0a0a" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.95"/>
          </linearGradient>
          <filter id="va-blur">
            <feGaussianBlur stdDeviation="2"/>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="60" fill="none" stroke="#0a0a0a" strokeWidth="0.5" opacity="0.1"/>
        <g style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="2.8s" repeatCount="indefinite"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="url(#va-grad)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="180 380" filter="url(#va-blur)"/>
        </g>
        <g style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" from="180 100 100" to="540 100 100" dur="3.6s" repeatCount="indefinite"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="url(#va-grad)" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="60 320" opacity="0.7" filter="url(#va-blur)"/>
        </g>
      </svg>
    </div>
  );
}

// ============================================================
// 05 — RIPPLE GRID
// 4×4 grid of dots; a wave of scale ripples across diagonally
// ============================================================
function RippleGrid() {
  const dots = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      dots.push({ x: 56 + c * 30, y: 56 + r * 30, delay: (r + c) * 0.12 });
    }
  }
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="3" fill="#0a0a0a">
            <animate attributeName="r" values="2;6;2" dur="2.2s" begin={`${-d.delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            <animate attributeName="opacity" values="0.15;0.9;0.15" dur="2.2s" begin={`${-d.delay}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
          </circle>
        ))}
      </svg>
    </div>
  );
}

// ============================================================
// 06 — SMOKE TRAIL
// A line of dots flowing like smoke; canvas-based for organic motion
// ============================================================
function SmokeTrail() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 200 * dpr; canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    let raf;
    const particles = [];
    const start = performance.now();

    function tick(now) {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, 200, 200);

      // emit
      if (Math.random() < 0.35) {
        particles.push({
          x: 100 + Math.sin(t * 1.2) * 4,
          y: 160,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.6 - Math.random() * 0.4,
          life: 0,
          maxLife: 140 + Math.random() * 80,
          r: 6 + Math.random() * 10,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) { particles.splice(i, 1); continue; }
        // drift left/right organically
        p.vx += (Math.sin((t + i) * 1.3) * 0.008);
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.995;

        const lifeT = p.life / p.maxLife;
        const opacity = (1 - lifeT) * 0.25 * Math.sin(lifeT * Math.PI);
        const radius = p.r * (1 + lifeT * 1.5);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(10,10,10,${opacity})`);
        grad.addColorStop(1, 'rgba(10,10,10,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="loader-frame">
      <canvas ref={canvasRef} style={{ width: 200, height: 200 }} />
    </div>
  );
}

// ============================================================
// 07 — SHIFTING SQUARE
// A square that morphs between rotations, soft easing — like cloth
// ============================================================
function ShiftingSquare() {
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <filter id="ss-soft">
            <feGaussianBlur stdDeviation="0.4"/>
          </filter>
        </defs>
        {/* outer ghost */}
        <rect x="60" y="60" width="80" height="80" fill="none" stroke="#0a0a0a" strokeWidth="1" opacity="0.18"
              style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" values="0 100 100;90 100 100;180 100 100;270 100 100;360 100 100"
                           dur="4.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1"
                           keySplines="0.65 0 0.35 1; 0.65 0 0.35 1; 0.65 0 0.35 1; 0.65 0 0.35 1"/>
        </rect>
        {/* main square */}
        <rect x="70" y="70" width="60" height="60" fill="#0a0a0a" filter="url(#ss-soft)"
              style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" values="0 100 100;90 100 100;180 100 100;270 100 100;360 100 100"
                           dur="4.8s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1"
                           keySplines="0.65 0 0.35 1; 0.65 0 0.35 1; 0.65 0 0.35 1; 0.65 0 0.35 1"/>
          <animate attributeName="opacity" values="0.85;0.55;0.85;0.55;0.85" dur="4.8s" repeatCount="indefinite"
                   keyTimes="0;0.25;0.5;0.75;1"/>
          <animate attributeName="rx" values="2;30;2;30;2" dur="4.8s" repeatCount="indefinite"
                   keyTimes="0;0.25;0.5;0.75;1" calcMode="spline"
                   keySplines="0.65 0 0.35 1; 0.65 0 0.35 1; 0.65 0 0.35 1; 0.65 0 0.35 1"/>
        </rect>
      </svg>
    </div>
  );
}

// ============================================================
// 08 — PENDULUM PULSE
// Two arcs swinging gently like a pendulum, meeting at center
// ============================================================
function PendulumPulse() {
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <defs>
          <filter id="pp-blur"><feGaussianBlur stdDeviation="0.6"/></filter>
        </defs>
        <line x1="100" y1="40" x2="100" y2="160" stroke="#0a0a0a" strokeWidth="0.4" opacity="0.12"/>
        {/* left arc */}
        <g style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" values="-35 100 100;35 100 100;-35 100 100"
                           dur="3.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1"
                           keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
          <circle cx="100" cy="55" r="7" fill="#0a0a0a" filter="url(#pp-blur)">
            <animate attributeName="r" values="6;9;6" dur="3.2s" repeatCount="indefinite"
                     calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
          </circle>
        </g>
        {/* right arc, opposite phase */}
        <g style={{ transformOrigin: '100px 100px' }}>
          <animateTransform attributeName="transform" type="rotate" values="35 100 100;-35 100 100;35 100 100"
                           dur="3.2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1"
                           keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
          <circle cx="100" cy="145" r="7" fill="#0a0a0a" filter="url(#pp-blur)" opacity="0.6">
            <animate attributeName="r" values="6;9;6" dur="3.2s" repeatCount="indefinite"
                     calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
          </circle>
        </g>
        <circle cx="100" cy="100" r="2" fill="#0a0a0a" opacity="0.4"/>
      </svg>
    </div>
  );
}

// ============================================================
// 09 — BREATHING LINES
// Vertical lines breathing in soft waves, like a soundwave
// ============================================================
function BreathingLines() {
  const N = 9;
  return (
    <div className="loader-frame">
      <svg viewBox="0 0 200 200" width="200" height="200">
        {Array.from({ length: N }).map((_, i) => {
          const x = 36 + i * 16;
          const delay = -i * 0.18;
          return (
            <rect key={i} x={x - 2} width="4" rx="2" fill="#0a0a0a">
              <animate attributeName="height" values="20;90;20" dur="2.2s" begin={`${delay}s`}
                       repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
              <animate attributeName="y" values="90;55;90" dur="2.2s" begin={`${delay}s`}
                       repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
              <animate attributeName="opacity" values="0.25;0.9;0.25" dur="2.2s" begin={`${delay}s`}
                       repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"/>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// Export to window for canvas
// ============================================================
Object.assign(window, {
  InkBloom, BreathingOrbit, DriftingDots, VeiledArc, RippleGrid,
  SmokeTrail, ShiftingSquare, PendulumPulse, BreathingLines
});
