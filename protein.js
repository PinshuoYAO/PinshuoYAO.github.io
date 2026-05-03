/* Lightweight protein-ish 3D renderer using Canvas2D
   Renders a rotating helix of nodes connected by edges. */
(function () {
  function init(canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, cx = 0, cy = 0;

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2; cy = h / 2;
    }
    resize();
    window.addEventListener("resize", resize);

    // Build a helix-ish structure
    const N = 56;
    const nodes = [];
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const ang = t * Math.PI * 6;
      const r = 80 + 18 * Math.sin(t * Math.PI * 4);
      nodes.push({
        x: r * Math.cos(ang),
        y: (t - 0.5) * 220,
        z: r * Math.sin(ang),
        kind: i % 7 === 0 ? "key" : "std",
      });
    }

    let mouseX = 0, mouseY = 0;
    let targetMx = 0, targetMy = 0;
    window.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      targetMx = (e.clientX - r.left - r.width / 2) / r.width;
      targetMy = (e.clientY - r.top - r.height / 2) / r.height;
    });

    let rot = 0;
    function readVar(name, fb) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fb;
    }

    function frame() {
      rot += 0.004;
      mouseX += (targetMx - mouseX) * 0.06;
      mouseY += (targetMy - mouseY) * 0.06;

      const accent = readVar("--accent", "#ff5722");
      const fg = readVar("--fg", "#0a0a0a");

      ctx.clearRect(0, 0, w, h);

      // tilt by mouse
      const tiltX = mouseY * 0.4;
      const yaw = rot + mouseX * 0.6;

      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);

      const proj = nodes.map((n) => {
        // rotate Y
        let x = n.x * cosY - n.z * sinY;
        let z = n.x * sinY + n.z * cosY;
        let y = n.y;
        // rotate X
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        // perspective
        const persp = 320 / (320 + z2);
        return {
          sx: cx + x * persp,
          sy: cy + y2 * persp,
          z: z2,
          persp,
          kind: n.kind,
        };
      });

      // Sort by z for painter's algorithm
      const order = proj.map((_, i) => i).sort((a, b) => proj[a].z - proj[b].z);

      // Edges (chain)
      ctx.lineWidth = 1;
      for (let i = 0; i < proj.length - 1; i++) {
        const a = proj[i], b = proj[i + 1];
        const t = (a.z + b.z) / 2;
        const alpha = 0.25 + 0.45 * ((t + 200) / 400);
        ctx.strokeStyle = hexAlpha(fg, Math.max(0.08, Math.min(0.7, alpha)));
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // long-range "contacts" (every 7th to every 7th+~)
      ctx.strokeStyle = hexAlpha(accent, 0.35);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < proj.length; i += 7) {
        const j = (i + 14) % proj.length;
        ctx.beginPath();
        ctx.moveTo(proj[i].sx, proj[i].sy);
        ctx.lineTo(proj[j].sx, proj[j].sy);
        ctx.stroke();
      }

      // Nodes
      for (const k of order) {
        const p = proj[k];
        const size = (p.kind === "key" ? 4.5 : 2.2) * p.persp;
        if (p.kind === "key") {
          ctx.fillStyle = accent;
        } else {
          const t = (p.z + 200) / 400;
          ctx.fillStyle = hexAlpha(fg, 0.4 + 0.5 * t);
        }
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(frame);
    }
    frame();
  }

  function hexAlpha(c, a) {
    // accept #rrggbb or named/oklch — fallback to rgba parsing through canvas trick
    if (c.startsWith("#") && c.length === 7) {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }
    // try via temp element
    try {
      const tmp = document.createElement("span");
      tmp.style.color = c;
      document.body.appendChild(tmp);
      const cs = getComputedStyle(tmp).color;
      document.body.removeChild(tmp);
      const m = cs.match(/rgba?\(([^)]+)\)/);
      if (m) {
        const parts = m[1].split(",").map(s => s.trim());
        return `rgba(${parts[0]},${parts[1]},${parts[2]},${a})`;
      }
    } catch (e) {}
    return c;
  }

  window.initProtein = init;
})();
