/**
 * heroScene.ts — Homepage hero motion system.
 *
 * One scene, four beats, looping (~15s):
 *   1. Disconnected — dim, broken network; six "messy" items float loose in 3D.
 *   2. Routing      — shockwave from the dashboard; links reconnect; items fly in
 *                      and flatten into clean dashboard tiles.
 *   3. Connected    — data pulses stream through the network, along cables, into
 *                      the dashboard. Each arrival lights a tile and moves its data.
 *   4. Reset        — dashboard breaks apart; loop restarts.
 *
 * Also: in-place rotating headline phrase, status chips, cursor glow, parallax
 * exit on scroll, pause control, prefers-reduced-motion support.
 *
 * mountHeroScene(root) returns a cleanup function (used on astro:before-swap).
 */
import { gsap } from 'gsap';

type Fn = () => void;

const GOLD = '201,168,124';
const GOLD_L = '228,212,188';
const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const pick = <T,>(a: T[]): T => a[(Math.random() * a.length) | 0];

// Dashboard edge ports: [fx, fy, tile index]
const PORTS: Array<[number, number, number]> = [
  [0.12, 0, 0], [0.5, 0, 2], [0.88, 0, 3],
  [0, 0.26, 1], [0, 0.58, 4], [0, 0.82, 4],
  [1, 0.26, 3], [1, 0.58, 5], [1, 0.82, 5],
  [0.3, 0.92, 4], [0.84, 0.92, 5],
];

// Disconnected pose per tile: x% of stage width, y% of stage height, rotation, rotationX, rotationY, scale, blur px
const CHAOS: number[][] = [
  [-8, -14, -6, 22, -16, 0.88, 0.6],
  [-14, 6, 9, -22, 30, 0.84, 1.6],
  [12, -12, -6, 18, 22, 0.94, 0],
  [20, 10, 12, -30, -26, 0.82, 2.2],
  [-5, 18, -4, 20, 14, 0.9, 0.4],
  [12, -22, 8, -16, -34, 0.86, 1.2],
];

export function mountHeroScene(root: HTMLElement): Fn {
  const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => r.querySelector(s) as T;
  const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => Array.from(r.querySelectorAll(s)) as T[];

  const content = $('.hs__content');
  const visual = $('.hs__visual');
  const foot = $('.hs__foot');
  const flowEl = $('.hs-flow');
  const canvas = $<HTMLCanvasElement>('.hs__canvas');
  const chips = $$('.hs-chip');
  const toggle = $<HTMLButtonElement>('.hs__motion');
  if (!content || !flowEl || !canvas) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const disposers: Fn[] = [];
  let alive = true;
  const on = (t: EventTarget, type: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, opts);
    disposers.push(() => t.removeEventListener(type, fn, opts));
  };
  const later = (fn: Fn, ms: number) => { const id = window.setTimeout(() => { if (alive) fn(); }, ms); disposers.push(() => clearTimeout(id)); };

  const S = { px: 0, py: 0, tx: 0, ty: 0, mx: -9999, my: -9999, pointer: false, scroll: 0, paused: reduced, visible: true };
  const SYS = { m: reduced ? 1 : 0, live: false };
  const listeners = new Set<Fn>();
  const emit = () => listeners.forEach(f => f());
  const running = () => alive && !S.paused && S.visible && !document.hidden;

  function makeLoop(frame: (dt: number, t: number) => void) {
    let raf = 0, last = 0, t = 0;
    function tick(now: number) {
      raf = 0;
      if (!running()) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now; t += dt;
      frame(dt, t);
      raf = requestAnimationFrame(tick);
    }
    function wake() {
      if (!alive) return;
      if (running()) { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
      else { if (raf) { cancelAnimationFrame(raf); raf = 0; } frame(0, t); }
    }
    listeners.add(wake);
    disposers.push(() => { cancelAnimationFrame(raf); listeners.delete(wake); });
    wake();
    return { wake };
  }

  /* ═════════ DASHBOARD ═════════ */
  const dash = (() => {
    const tiles = $$('.hs-tile', flowEl), steps = $$('.hs-step', flowEl), bars = $$('.hs-bar i', flowEl);
    const el = (k: string) => $(`[data-k="${k}"]`, flowEl);
    const E = { orders: el('orders'), inv: el('inv'), appr: el('appr'), ono: el('ono'), sync: el('sync') };
    const BASE = { orders: 128, inv: 96, appr: 3, ono: 1046 };
    const BARS = [40, 56, 49, 71, 64, 83, 92];
    const D = { ...BASE, step: 0, heights: BARS.slice() };
    let resetting = false, lastStep = 0;
    const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
    function render() {
      E.orders.textContent = fmt(D.orders); E.inv.textContent = fmt(D.inv); E.appr.textContent = fmt(D.appr); E.ono.textContent = String(D.ono);
    }
    function reset() {
      Object.assign(D, BASE, { step: 0, heights: BARS.slice() });
      bars.forEach((b, i) => b.style.setProperty('--h', D.heights[i] + '%'));
      steps.forEach(s => s.classList.remove('done'));
      render();
    }
    function pulse(i: number) { const t = tiles[i]; t.classList.remove('hit'); void t.offsetWidth; t.classList.add('hit'); }
    function hit(i: number) {
      pulse(i);
      if (!SYS.live) return;
      if (i === 0) { E.sync.classList.add('flash'); requestAnimationFrame(() => requestAnimationFrame(() => E.sync.classList.remove('flash'))); }
      if (i === 1) D.orders += 1 + ((Math.random() * 3) | 0);
      if (i === 2) D.inv += 1;
      if (i === 3) D.appr = 1 + ((Math.random() * 5) | 0);
      if (i === 4) {
        const b = Math.random() < 0.5 ? 6 : (Math.random() * 7) | 0;
        D.heights[b] = clamp(D.heights[b] + (Math.random() * 14 - 4), 28, 98);
        bars[b].style.setProperty('--h', D.heights[b] + '%');
      }
      if (i === 5 && !resetting && performance.now() - lastStep > 520) {
        lastStep = performance.now();
        steps[D.step].classList.add('done');
        D.step++;
        if (D.step >= steps.length) {
          resetting = true;
          later(() => { steps.forEach(s => s.classList.remove('done')); D.step = 0; D.ono++; render(); resetting = false; }, 700);
        }
      }
      render();
    }
    return { tiles, bars, steps, D, BASE, reset, render, hit };
  })();

  /* ═════════ NETWORK ═════════ */
  type Node = { bx: number; by: number; x: number; y: number; ox: number; oy: number; ph: number; amp: number; sp: number; hub: boolean; flash: number; glow: number; vis: number; appear: number };
  type Edge = { a: number; b: number; brk: boolean; fl: boolean; ph: number };
  type Packet = { path: number[]; port: number; seg: number; t: number; speed: number; fizzle: number };
  type Rect = { x: number; y: number; w: number; h: number };

  const net = (() => {
    const ctx = canvas.getContext('2d')!;
    const portFlash = new Float32Array(PORTS.length);
    let W = 0, H = 0, T = 0, lastRectKey = '';
    let nodes: Node[] = [], edges: Edge[] = [], adj: number[][] = [], hubs: number[] = [], packets: Packet[] = [];
    let dust: Array<{ x: number; y: number; r: number; v: number; a: number }> = [];
    let cables: Array<{ k: number; node: number }> = [];
    const waves: Array<{ x: number; y: number; t0: number; speed: number; max: number; s: number }> = [];
    let spawnAcc = 0, inAcc = 0, cursorAcc = 0;
    let loop: { wake: Fn } | null = null;

    const dashRect = (): Rect => {
      const cr = canvas.getBoundingClientRect(), fr = flowEl.getBoundingClientRect();
      return { x: fr.left - cr.left, y: fr.top - cr.top, w: fr.width, h: fr.height };
    };
    const portPt = (r: Rect, k: number): [number, number] => [r.x + PORTS[k][0] * r.w, r.y + PORTS[k][1] * r.h];
    const rectKey = (r: Rect) => [r.x, r.y, r.w, r.h].map(v => Math.round(v / 8)).join(',');

    function build() {
      const mobile = W < 768, cell = mobile ? 66 : 92;
      const r = dashRect(), pad = 20;
      const inside = (x: number, y: number) => x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h * 0.93 + pad;
      nodes = [];
      const cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1;
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        const bx = (gx - 0.35 + Math.random() * 0.7) * cell, by = (gy - 0.35 + Math.random() * 0.7) * cell;
        if (inside(bx, by)) continue;
        const keep = mobile ? 0.55 : 0.12 + 0.86 * smooth(0.2, 0.5, bx / W);
        if (Math.random() > keep) continue;
        nodes.push({ bx, by, x: bx, y: by, ox: 0, oy: 0, ph: Math.random() * TAU, amp: 2 + Math.random() * 4, sp: 0.3 + Math.random() * 0.5,
          hub: Math.random() < 0.1, flash: 0, glow: 0, vis: 0, appear: mobile ? Math.random() : clamp(bx / W, 0, 1) });
      }
      edges = []; adj = nodes.map(() => []); hubs = [];
      const seen = new Set<number>(), maxD = (cell * 1.8) ** 2;
      nodes.forEach((n, i) => {
        if (n.hub) hubs.push(i);
        const near: Array<[number, number]> = [];
        nodes.forEach((m, j) => { if (i !== j) { const d = (m.bx - n.bx) ** 2 + (m.by - n.by) ** 2; if (d < maxD) near.push([j, d]); } });
        near.sort((a, b) => a[1] - b[1]);
        near.slice(0, n.hub ? 4 : 3).forEach(([j]) => {
          const key = i < j ? i * 100000 + j : j * 100000 + i;
          if (seen.has(key)) return;
          seen.add(key);
          edges.push({ a: i, b: j, brk: Math.random() < 0.42, fl: Math.random() < 0.25, ph: Math.random() * TAU });
          adj[i].push(j); adj[j].push(i);
        });
      });
      cables = [];
      PORTS.forEach((_, k) => {
        const [px, py] = portPt(r, k);
        let best = -1, bd = (mobile ? 140 : 230) ** 2;
        nodes.forEach((n, i) => { const d = (n.bx - px) ** 2 + (n.by - py) ** 2; if (d < bd && adj[i].length) { bd = d; best = i; } });
        if (best >= 0) cables.push({ k, node: best });
      });
      packets = [];
      dust = Array.from({ length: mobile ? 24 : 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + 0.2, v: 4 + Math.random() * 10, a: 0.04 + Math.random() * 0.14 }));
      lastRectKey = rectKey(r);
    }

    function walk(start: number, hops: number) {
      const path = [start]; let prev = -1, cur = start;
      for (let h = 0; h < hops; h++) {
        const opts = adj[cur].filter(x => x !== prev && !path.includes(x));
        if (!opts.length) break;
        prev = cur; cur = pick(opts); path.push(cur);
      }
      return path;
    }
    function spawnWander(from?: number) {
      if (!nodes.length) return;
      let i = from;
      if (i == null) i = Math.random() < 0.6 && hubs.length ? pick(hubs) : (Math.random() * nodes.length) | 0;
      const path = walk(i, 2 + ((Math.random() * 4) | 0));
      if (path.length < 2) return;
      packets.push({ path, port: -1, seg: 0, t: 0, speed: lerp(70, 190, SYS.m) + Math.random() * 60, fizzle: SYS.m < 0.5 ? 0.3 + Math.random() * 0.6 : 2 });
    }
    function spawnInbound() {
      if (!cables.length) return;
      const c = pick(cables);
      const path = walk(c.node, 3 + ((Math.random() * 5) | 0)).reverse();
      packets.push({ path, port: c.k, seg: 0, t: 0, speed: 230 + Math.random() * 140, fizzle: 2 });
    }
    function nearest(x: number, y: number) {
      let best = -1, bd = 200 * 200;
      nodes.forEach((n, i) => { const d = (n.x - x) ** 2 + (n.y - y) ** 2; if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function wave(strength = 1) {
      const r = dashRect();
      waves.push({ x: r.x + r.w / 2, y: r.y + r.h * 0.45, t0: T, speed: 1100, max: Math.hypot(W, H), s: strength });
    }
    function resize() {
      const r = canvas.getBoundingClientRect();
      if (Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 1) return;
      W = r.width; H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      loop?.wake();
    }
    const point = (p: Packet, idx: number, r: Rect): [number, number] => {
      if (idx < p.path.length) { const n = nodes[p.path[idx]]; return [n.x, n.y]; }
      return portPt(r, p.port);
    };

    function frame(dt: number, t: number) {
      T = t;
      const r = dashRect();
      if (dt > 0 && window.scrollY < 2 && rectKey(r) !== lastRectKey) build();
      ctx.clearRect(0, 0, W, H);
      const m = SYS.m;
      const intro = reduced ? 1 : easeOut(clamp(t / 2.4, 0, 1));
      const R = 170, mx = S.mx, my = S.my, ptr = S.pointer;

      for (const d of dust) {
        d.y -= d.v * dt; if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
        ctx.fillStyle = `rgba(${GOLD},${d.a * intro})`; ctx.fillRect(d.x, d.y, d.r, d.r);
      }
      if (m > 0.01) {
        const cx = r.x + r.w / 2, cy = r.y + r.h * 0.45, rad = Math.max(r.w, r.h) * 0.95;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${GOLD},${0.11 * m})`); g.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.fillStyle = g; ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }
      for (let q = waves.length - 1; q >= 0; q--) {
        const w = waves[q], rr = (t - w.t0) * w.speed;
        if (rr > w.max) { waves.splice(q, 1); continue; }
        const a = (1 - rr / w.max) * 0.45 * w.s;
        ctx.strokeStyle = `rgba(${GOLD_L},${a})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(w.x, w.y, rr, 0, TAU); ctx.stroke();
        ctx.strokeStyle = `rgba(${GOLD},${a * 0.35})`; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(w.x, w.y, Math.max(0, rr - 8), 0, TAU); ctx.stroke();
        for (const n of nodes) { const d = Math.hypot(n.x - w.x, n.y - w.y); if (Math.abs(d - rr) < 30) n.flash = Math.max(n.flash, w.s); }
      }

      const k = Math.min(1, dt * 6), jitter = 1 + (1 - m) * 1.6;
      for (const n of nodes) {
        let tx = 0, ty = 0;
        if (ptr) { const dx = n.bx - mx, dy = n.by - my, d = Math.hypot(dx, dy); if (d < R && d > 0.01) { const f = (1 - d / R) ** 2 * 28; tx = dx / d * f; ty = dy / d * f; } }
        n.ox = lerp(n.ox, tx, k); n.oy = lerp(n.oy, ty, k);
        n.x = n.bx + Math.sin(t * n.sp + n.ph) * n.amp * jitter + n.ox;
        n.y = n.by + Math.cos(t * n.sp * 0.8 + n.ph) * n.amp * jitter + n.oy;
        n.vis = reduced ? 1 : clamp((intro * 1.5 - (1 - n.appear)) / 0.5, 0, 1);
        n.glow = ptr ? clamp(1 - Math.hypot(n.x - mx, n.y - my) / (R * 1.4), 0, 1) : 0;
        n.flash = Math.max(0, n.flash - dt * 1.5);
      }

      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        const v = Math.min(a.vis, b.vis);
        if (v <= 0.01) continue;
        let al = 0.03 + 0.08 * m + (a.hub || b.hub ? 0.04 * m : 0) + Math.max(a.glow, b.glow) * 0.4 + Math.max(a.flash, b.flash) * 0.25;
        if (e.brk) al *= m;
        if (e.fl) al *= m + (1 - m) * (0.35 + 0.65 * Math.abs(Math.sin(t * 7 + e.ph)));
        if (al < 0.004) continue;
        ctx.strokeStyle = `rgba(${GOLD},${al})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(lerp(a.x, b.x, v), lerp(a.y, b.y, v)); ctx.stroke();
      }

      for (const c of cables) {
        const n = nodes[c.node]; if (!n || n.vis < 0.5) continue;
        const [px, py] = portPt(r, c.k);
        const al = m * 0.42 + portFlash[c.k] * 0.55 * m;
        if (al > 0.005) {
          const reach = Math.min(1, m * 1.2);
          ctx.strokeStyle = `rgba(${GOLD},${al})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(lerp(n.x, px, reach), lerp(n.y, py, reach)); ctx.stroke();
        }
        if (m > 0.6) {
          const s = 2.5 + portFlash[c.k] * 3;
          ctx.fillStyle = `rgba(${GOLD_L},${(m - 0.6) * 2.2 * (0.5 + portFlash[c.k] * 0.5)})`;
          ctx.fillRect(px - s, py - s, s * 2, s * 2);
          if (portFlash[c.k] > 0) {
            ctx.strokeStyle = `rgba(${GOLD_L},${portFlash[c.k] * 0.7})`;
            ctx.beginPath(); ctx.arc(px, py, 4 + (1 - portFlash[c.k]) * 18, 0, TAU); ctx.stroke();
          }
        }
        portFlash[c.k] = Math.max(0, portFlash[c.k] - dt * 2.2);
      }

      if (!reduced && dt > 0) {
        const mobile = W < 768;
        const wanderMax = mobile ? 6 : lerp(8, 14, m);
        const every = lerp(0.6, 0.25, m);
        spawnAcc += dt;
        while (spawnAcc > every) {
          spawnAcc -= every;
          if (packets.length < 40 && intro > 0.4 && packets.filter(p => p.port < 0).length < wanderMax) spawnWander();
        }
        if (m > 0.85) {
          inAcc += dt;
          const inEvery = SYS.live ? (mobile ? 0.24 : 0.11) : 0.3;
          while (inAcc > inEvery) { inAcc -= inEvery; if (packets.length < 48) spawnInbound(); }
        }
        if (ptr) { cursorAcc += dt; if (cursorAcc > 0.3) { cursorAcc = 0; const ni = nearest(mx, my); if (ni >= 0) spawnWander(ni); } }
      }

      for (let q = packets.length - 1; q >= 0; q--) {
        const p = packets[q];
        const segs = p.path.length - 1 + (p.port >= 0 ? 1 : 0);
        const [ax, ay] = point(p, p.seg, r), [bx, by] = point(p, p.seg + 1, r);
        const len = Math.hypot(bx - ax, by - ay) || 1;
        p.t += dt * p.speed / len;
        p.fizzle -= dt;
        if (p.fizzle <= 0) { packets.splice(q, 1); continue; }
        if (p.t >= 1) {
          p.seg++; p.t = 0;
          if (p.seg < p.path.length) { const n = nodes[p.path[p.seg]]; n.flash = Math.max(n.flash, n.hub ? 0.9 : 0.45); }
          if (p.seg >= segs) {
            if (p.port >= 0) { portFlash[p.port] = 1; dash.hit(PORTS[p.port][2]); }
            packets.splice(q, 1);
          }
          continue;
        }
        const hx = lerp(ax, bx, p.t), hy = lerp(ay, by, p.t);
        const tt = Math.max(0, p.t - 0.45), sx = lerp(ax, bx, tt), sy = lerp(ay, by, tt);
        const fade = Math.min(1, p.fizzle * 3) * (0.45 + 0.55 * m);
        const gr = ctx.createLinearGradient(sx, sy, hx, hy);
        gr.addColorStop(0, `rgba(${GOLD},0)`); gr.addColorStop(1, `rgba(${GOLD_L},${0.95 * fade})`);
        ctx.strokeStyle = gr; ctx.lineWidth = p.port >= 0 ? 1.8 : 1.3;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.fillStyle = `rgba(${GOLD},${0.18 * fade})`; ctx.beginPath(); ctx.arc(hx, hy, p.port >= 0 ? 7 : 5, 0, TAU); ctx.fill();
        ctx.fillStyle = `rgba(255,246,230,${fade})`; ctx.beginPath(); ctx.arc(hx, hy, p.port >= 0 ? 1.9 : 1.4, 0, TAU); ctx.fill();
      }

      ctx.lineWidth = 1;
      for (const n of nodes) {
        if (n.vis <= 0.01) continue;
        const al = n.vis * (0.45 + 0.55 * m);
        if (n.hub) {
          const s = 3.4 + n.glow * 1.6 + n.flash * 1.5;
          ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(${GOLD_L},${0.85 * al})`; ctx.fillRect(-s / 2, -s / 2, s, s);
          ctx.restore();
          ctx.strokeStyle = `rgba(${GOLD},${(0.2 + n.glow * 0.35) * al})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, 9, 0, TAU); ctx.stroke();
          if (n.flash > 0.05) { ctx.strokeStyle = `rgba(${GOLD_L},${n.flash * 0.6 * al})`; ctx.beginPath(); ctx.arc(n.x, n.y, 9 + (1 - n.flash) * 24, 0, TAU); ctx.stroke(); }
        } else {
          ctx.fillStyle = `rgba(${n.flash > 0.3 ? GOLD_L : GOLD},${Math.min(1, 0.35 + n.glow * 0.6 + n.flash * 0.65) * al})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, 1.3 + n.glow * 1.2 + n.flash * 1.2, 0, TAU); ctx.fill();
        }
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    disposers.push(() => ro.disconnect());
    resize();
    loop = makeLoop(frame);
    return { wave };
  })();

  /* ═════════ DIRECTOR ═════════ */
  let master: gsap.core.Timeline | null = null;
  (() => {
    const tiles = dash.tiles;
    const ins = $$('.hs-tile__in', flowEl), mess = $$('.hs-face--mess', flowEl), clean = $$('.hs-face--clean', flowEl);
    const debris = $$('.hs-deb', flowEl), sweep = $('.hs-flow__sweep i', flowEl);
    const capB = $('.hs-cap--before', flowEl), capA = $('.hs-cap--after', flowEl), prog = $('.hs-flow__prog i', flowEl);
    const showCap = (after: boolean) => { capB.classList.toggle('on', !after); capA.classList.toggle('on', after); };
    let lastW = 0, started = false;

    function ordered() {
      flowEl.classList.remove('is-chaos');
      SYS.m = 1; SYS.live = false;
      mess.forEach(m => (m.style.opacity = '0')); debris.forEach(d => (d.style.opacity = '0'));
      dash.steps.slice(0, 3).forEach(s => s.classList.add('done'));
      showCap(true);
      prog.style.transform = 'scaleX(1)';
    }

    function build(first: boolean) {
      master?.kill();
      const r = flowEl.getBoundingClientRect();
      lastW = r.width;
      if (reduced) { ordered(); return; }
      const sw = r.width, sh = r.height;
      const chaos = (i: number) => ({ x: CHAOS[i][0] / 100 * sw, y: CHAOS[i][1] / 100 * sh, rotation: CHAOS[i][2], rotationX: CHAOS[i][3], rotationY: CHAOS[i][4], scale: CHAOS[i][5], filter: `blur(${CHAOS[i][6]}px)` });
      const flat = { x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, filter: 'blur(0px)' };

      flowEl.classList.add('is-chaos'); showCap(false); SYS.live = false; SYS.m = 0; dash.reset();
      tiles.forEach((t, i) => gsap.set(t, chaos(i)));
      gsap.set(mess, { opacity: 1 }); gsap.set(clean, { opacity: 0 }); gsap.set(debris, { opacity: 1, x: 0, y: 0, scale: 1 }); gsap.set(dash.bars, { scaleY: 0.04 });

      const tl = gsap.timeline({ repeat: -1, paused: true, onUpdate() { prog.style.transform = `scaleX(${tl.progress().toFixed(4)})`; } });
      tl.call(() => { flowEl.classList.add('is-chaos'); showCap(false); SYS.live = false; dash.reset(); }, undefined, 0);
      tiles.forEach((t, i) => tl.set(t, chaos(i), 0));
      tl.set(SYS, { m: 0 }, 0).set(mess, { opacity: 1 }, 0).set(clean, { opacity: 0 }, 0).set(debris, { opacity: 1, x: 0, y: 0, scale: 1 }, 0).set(dash.bars, { scaleY: 0.04 }, 0);

      tl.addLabel('as', 3.2);
      tl.call(() => { net.wave(1); flowEl.classList.remove('is-chaos'); }, undefined, 'as');
      tl.to(SYS, { m: 1, duration: 1.5, ease: 'power2.inOut' }, 'as-=0.1');
      tl.to(tiles, { ...flat, duration: 1.6, ease: 'expo.inOut', stagger: { each: 0.09, from: 'random' } }, 'as');
      tl.to(mess, { opacity: 0, duration: 0.45, stagger: 0.08 }, 'as+=0.45');
      tl.to(clean, { opacity: 1, duration: 0.6, stagger: 0.08 }, 'as+=0.6');
      tl.to(debris, {
        opacity: 0, scale: 0.2, duration: 0.9, ease: 'power3.in', stagger: 0.05,
        x: (_i: number, el: HTMLElement) => (sw / 2 - (el.offsetLeft + el.offsetWidth / 2)) * 0.8,
        y: (_i: number, el: HTMLElement) => (sh * 0.45 - (el.offsetTop + el.offsetHeight / 2)) * 0.8,
      }, 'as');
      tl.call(() => { tiles.forEach((_, i) => later(() => dash.hit(i), i * 60)); showCap(true); net.wave(0.6); }, undefined, 'as+=1.55');
      tl.fromTo(sweep, { xPercent: -110 }, { xPercent: 110, duration: 1.3, ease: 'power2.inOut' }, 'as+=1.5');
      tl.to(dash.bars, { scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 }, 'as+=1.5');
      (['orders', 'inv', 'appr'] as const).forEach(key => {
        const o = { v: 0 };
        tl.to(o, { v: dash.BASE[key], duration: 1.2, ease: 'power2.out', onUpdate() { dash.D[key] = Math.round(o.v); dash.render(); } }, 'as+=1.5');
      });
      tl.call(() => { SYS.live = true; }, undefined, 'as+=2.7');

      tl.addLabel('sc', 'as+=12');
      tl.call(() => { SYS.live = false; flowEl.classList.add('is-chaos'); showCap(false); net.wave(0.5); }, undefined, 'sc');
      tl.to(SYS, { m: 0, duration: 1.2, ease: 'power2.in' }, 'sc');
      tl.to(clean, { opacity: 0, duration: 0.35, stagger: 0.05 }, 'sc+=0.1');
      tl.to(mess, { opacity: 1, duration: 0.4, stagger: 0.05 }, 'sc+=0.2');
      tl.to(dash.bars, { scaleY: 0.04, duration: 0.4 }, 'sc');
      tiles.forEach((t, i) => tl.to(t, { ...chaos(i), duration: 1.3, ease: 'expo.inOut' }, `sc+=${i * 0.05}`));
      tl.to(debris, { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.05 }, 'sc+=0.3');
      tl.to({}, { duration: 0.6 }, 'sc+=1.6');
      master = tl;

      if (first) {
        started = false;
        gsap.fromTo(ins, { opacity: 0, y: -80, rotationX: 75, scale: 0.6 }, {
          opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1.3, ease: 'power3.out', stagger: 0.09, delay: 0.5,
          onComplete() { gsap.set(ins, { clearProps: 'all' }); },
        });
        gsap.fromTo(debris, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.06, delay: 1 });
        later(() => { started = true; sync(); }, 1400);
      } else { started = true; }
      sync();
    }
    function sync() { if (!master) return; (!started || !running()) ? master.pause() : master.resume(); }
    listeners.add(sync);
    build(true);
    const ro = new ResizeObserver(() => { const w = flowEl.getBoundingClientRect().width; if (Math.abs(w - lastW) > 2) build(false); });
    ro.observe(flowEl);
    disposers.push(() => ro.disconnect());
  })();

  /* ═════════ HEADLINE ═════════ */
  const firstPhrase = (() => {
    const box = $('.hs__rot'), line = $('.hs__rot-line', box);
    const first = box ? $('.hs__phrase', box) : null;
    if (!box || !first) return null;
    // Only the first phrase is server-rendered; the rest are built here so the
    // H1's crawlable text isn't a run-on of every phrase.
    const phrases = [first];
    (box.dataset.phrases || '').split('|').map(s => s.trim()).filter(Boolean).slice(1).forEach(text => {
      const el = document.createElement('span');
      el.className = 'hs__phrase';
      for (const c of text) {
        const ch = document.createElement('span');
        ch.className = 'hs-ch';
        ch.textContent = c === ' ' ? ' ' : c;
        el.appendChild(ch);
      }
      box.insertBefore(el, line);
      phrases.push(el);
    });
    let i = 0, timer = 0;
    phrases[0].classList.add('is-on');
    const fitLine = () => { line.style.width = phrases[i].offsetWidth * 0.92 + 'px'; };
    function show(n: number) {
      const out = phrases[i], inn = phrases[n];
      i = n;
      gsap.to(out.children, {
        yPercent: -110, rotation: -4, opacity: 0, duration: 0.45, ease: 'power3.in', stagger: 0.018,
        onComplete() { out.classList.remove('is-on'); gsap.set(out.children, { clearProps: 'all' }); },
      });
      inn.classList.add('is-on');
      gsap.fromTo(inn.children, { yPercent: 115, rotation: 8, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.03, delay: 0.3 });
      line.style.width = '0px';
      later(fitLine, 450);
    }
    function sync() {
      clearInterval(timer); timer = 0;
      if (running() && phrases.length > 1) timer = window.setInterval(() => show((i + 1) % phrases.length), 3200);
    }
    listeners.add(sync);
    disposers.push(() => clearInterval(timer));
    document.fonts?.ready.then(() => { if (alive) fitLine(); });
    on(window, 'resize', fitLine);
    fitLine();
    return phrases[0];
  })();

  /* ═════════ CHIPS, POINTER, SCROLL, PAUSE ═════════ */
  function placeChips() {
    const lift = reduced ? 0 : S.scroll * 180;
    chips.forEach(c => {
      const d = Number(c.dataset.depth) || 16;
      c.style.transform = `translate3d(${(S.px * d).toFixed(2)}px,${(S.py * d - lift * (d / 20)).toFixed(2)}px,0)`;
    });
  }
  makeLoop(dt => { const k = Math.min(1, dt * 4); S.px = lerp(S.px, S.tx, k); S.py = lerp(S.py, S.ty, k); placeChips(); });

  on(root, 'pointermove', (ev) => {
    const e = ev as PointerEvent;
    const r = root.getBoundingClientRect();
    S.mx = e.clientX - r.left; S.my = e.clientY - r.top;
    S.tx = (S.mx / r.width) * 2 - 1; S.ty = (S.my / r.height) * 2 - 1;
    root.style.setProperty('--mx', S.mx + 'px'); root.style.setProperty('--my', S.my + 'px');
    if (!S.pointer && e.pointerType === 'mouse') { S.pointer = true; root.classList.add('is-pointer'); }
  });
  on(root, 'pointerleave', () => { S.pointer = false; S.tx = 0; S.ty = 0; S.mx = -9999; S.my = -9999; root.classList.remove('is-pointer'); });

  let scrollRaf = 0;
  function onScroll() {
    scrollRaf = 0;
    S.scroll = clamp(window.scrollY / (root.offsetHeight || 1), 0, 1);
    if (reduced) return;
    const p = S.scroll;
    content.style.transform = `translate3d(0,${(-p * 90).toFixed(1)}px,0)`;
    content.style.opacity = String(clamp(1 - p * 1.35, 0, 1));
    visual.style.transform = `translate3d(0,${(p * 150).toFixed(1)}px,0) scale(${(1 + p * 0.06).toFixed(4)})`;
    flowEl.style.transform = `translate3d(0,${(p * 60).toFixed(1)}px,0)`;
    flowEl.style.opacity = String(clamp(1 - p * 1.1, 0, 1));
    foot.style.opacity = String(clamp(1 - p * 3, 0, 1));
    placeChips();
  }
  on(window, 'scroll', () => { if (!scrollRaf) scrollRaf = requestAnimationFrame(onScroll); }, { passive: true });
  disposers.push(() => cancelAnimationFrame(scrollRaf));

  const cue = $('.hs__cue');
  if (cue) on(cue, 'click', () => window.scrollTo({ top: root.offsetTop + root.offsetHeight, behavior: reduced ? 'auto' : 'smooth' }));

  function renderToggle() {
    root.classList.toggle('is-paused', S.paused);
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(S.paused));
    const label = $('.hs__motion-text', toggle);
    if (label) label.textContent = S.paused ? 'Play motion' : 'Pause motion';
  }
  if (toggle) on(toggle, 'click', () => { S.paused = !S.paused; renderToggle(); emit(); });
  renderToggle();

  const io = new IntersectionObserver(([e]) => { S.visible = e.isIntersecting; emit(); }, { threshold: 0 });
  io.observe(root);
  disposers.push(() => io.disconnect());
  on(document, 'visibilitychange', emit);

  /* ═════════ ENTRANCE ═════════ */
  let intro: gsap.core.Timeline | null = null;
  if (!reduced) {
    intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from($$('.hs__label'), { opacity: 0, x: -14, duration: 0.9 }, 0.1)
      .from(firstPhrase ? firstPhrase.children : [], { yPercent: 115, rotation: 8, opacity: 0, duration: 0.9, stagger: 0.035 }, 0.25)
      .from($$('.hs__rest .hs-wi'), { yPercent: 110, rotation: 3, duration: 1.05, stagger: 0.05 }, 0.45)
      .from($$('.hs__desc'), { opacity: 0, y: 24, duration: 0.8 }, 0.95)
      // animate the wrapper: the site Button has `transition: all`, which fights GSAP on the <a> itself
      .from($$('.hs__actions'), { opacity: 0, y: 20, duration: 0.8 }, 1.05)
      .from($$('.hs__foot'), { opacity: 0, duration: 1 }, 1.3)
      .from($$('.hs-chip__pop'), { opacity: 0, y: 26, scale: 0.94, duration: 0.9, stagger: 0.2 }, 2.2);
  }
  emit();

  return () => {
    alive = false;
    master?.kill();
    intro?.kill();
    gsap.killTweensOf(SYS);
    gsap.killTweensOf(root.querySelectorAll('*'));
    disposers.forEach(d => d());
    listeners.clear();
  };
}
