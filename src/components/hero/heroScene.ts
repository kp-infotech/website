/**
 * heroScene.ts — Homepage hero: "Power on".
 *
 * The operations dashboard is a chip on a gold circuit board.
 *   1. Unpowered — dark board (the cursor is a torch that reveals traces), broken
 *      lines spark, the dashboard tiles float as the mess they replace, and
 *      fragments of manual work drift around with notification badges.
 *   2. Power on  — a gold frame draws around the console, energy surges outward
 *      through every trace, fragments are sucked in and dissolve into gold
 *      particles that stream into the console ports, tiles flatten into place.
 *   3. Live      — pulses stream along the traces into the console; every
 *      arrival lights its tile, rolls its odometer and logs an event.
 *      The rotating headline phrase spotlights the matching module.
 *   4. Power down — lights retract into the chip, the mess returns, loop.
 *
 * Two canvases: sharp (.hs__canvas) + half-res blurred bloom (.hs__bloom).
 * Background constellation network gives depth with cursor parallax.
 *
 * mountHeroScene(root) returns a cleanup function (used on astro:before-swap).
 */
import { gsap } from 'gsap';

type Fn = () => void;
type Pt = [number, number];
type Rect = { x: number; y: number; w: number; h: number };

const GOLD = '201,168,124';
const GOLD_L = '228,212,188';
const HOT = '255,244,224';
const EMBER = '240,170,90';
const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const rand = (a = 1, b?: number) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const pick = <T,>(a: T[]): T => a[(Math.random() * a.length) | 0];

// Tile layout in % of the stage (must match Hero.astro)
const TILES: number[][] = [[0, 0, 100, 11], [0, 15, 31.5, 23], [34.25, 15, 31.5, 23], [68.5, 15, 31.5, 23], [0, 42, 64.5, 50], [68.5, 42, 31.5, 50]];
// Unpowered pose per tile: x% of stage w, y% of stage h, rotation, rotationX, rotationY, scale, blur
const CHAOS: number[][] = [
  [-8, -14, -6, 22, -16, 0.88, 0.6],
  [-14, 6, 9, -22, 30, 0.84, 1.6],
  [12, -12, -6, 18, 22, 0.94, 0],
  [20, 10, 12, -30, -26, 0.82, 2.2],
  [-5, 18, -4, 20, 14, 0.9, 0.4],
  [12, -22, 8, -16, -34, 0.86, 1.2],
];
// Headline phrase index → tiles it spotlights (Custom software, Odoo ERP, Automation, AI agents, Cloud platforms)
const SPOT: number[][] = [[0, 1, 2, 3, 4, 5], [1, 2], [5], [3], [0, 4]];
const SPOT_EVENTS = ['All modules in sync', 'Odoo · journal entries posted', 'Workflow · order routed end to end', 'AI agent · approvals triaged', 'Cloud · all services healthy'];
const STEPS = ['received', 'stock reserved', 'invoice raised', 'posted to ERP', 'customer notified'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function mountHeroScene(root: HTMLElement): Fn {
  const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => r.querySelector(s) as T;
  const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => Array.from(r.querySelectorAll(s)) as T[];

  const content = $('.hs__content');
  const visual = $('.hs__visual');
  const foot = $('.hs__foot');
  const stage = $('.hs-stage');
  const flowEl = $('.hs-flow');
  const canvas = $<HTMLCanvasElement>('.hs__canvas');
  const bloom = $<HTMLCanvasElement>('.hs__bloom');
  const chips = $$('.hs-chip');
  const toggle = $<HTMLButtonElement>('.hs__motion');
  if (!content || !stage || !flowEl || !canvas || !bloom) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const disposers: Fn[] = [];
  let alive = true;
  const on = (t: EventTarget, type: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, opts);
    disposers.push(() => t.removeEventListener(type, fn, opts));
  };
  const later = (fn: Fn, ms: number) => { const id = window.setTimeout(() => { if (alive) fn(); }, ms); disposers.push(() => clearTimeout(id)); };

  const S = { px: 0, py: 0, tx: 0, ty: 0, mx: -9999, my: -9999, pointer: false, scroll: 0, paused: reduced, visible: true, tiltX: 0, tiltY: 0 };
  /** m: network connectedness · power: how far light has travelled through the traces · spot: spotlight strength */
  const SYS = { m: reduced ? 1 : 0, power: reduced ? 1 : 0, live: false, spot: 0, spotTiles: new Set<number>() };
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

  /* ═════════════════ DASHBOARD (DOM) ═════════════════ */
  const dash = (() => {
    const tiles = $$('.hs-tile', flowEl), steps = $$('.hs-step', flowEl), bars = $$('.hs-bar i', flowEl);
    const el = (k: string) => $(`[data-k="${k}"]`, flowEl);
    const evt = el('event');
    const BASE = { orders: 128, inv: 96, appr: 3, ono: 1046 };
    const BARS = [40, 56, 49, 71, 64, 83, 92];
    const D = { ...BASE, step: 0, heights: BARS.slice() };
    let resetting = false, lastStep = 0, lastEvt = 0, pendingEvt = '';

    /* odometer: each digit is a rolling column */
    function odometer(host: HTMLElement) {
      let cur = '';
      return (n: number) => {
        const s = Math.round(n).toLocaleString('en-US');
        if (s === cur) return;
        if (s.length !== cur.length) {
          host.textContent = '';
          for (const ch of s) {
            if (/\d/.test(ch)) {
              const w = document.createElement('span'); w.className = 'hs-odo';
              const col = document.createElement('span'); col.className = 'hs-odo__col';
              for (let d = 0; d < 10; d++) { const dg = document.createElement('span'); dg.textContent = String(d); col.appendChild(dg); }
              col.style.transform = `translateY(-${Number(ch) * 10}%)`;
              w.appendChild(col); host.appendChild(w);
            } else { const sp = document.createElement('span'); sp.textContent = ch; host.appendChild(sp); }
          }
        } else {
          const cols = host.children;
          for (let i = 0; i < s.length; i++) {
            const col = cols[i]?.firstElementChild as HTMLElement | null;
            if (col && /\d/.test(s[i])) col.style.transform = `translateY(-${Number(s[i]) * 10}%)`;
          }
        }
        cur = s;
      };
    }
    const odo = { orders: odometer(el('orders')), inv: odometer(el('inv')), appr: odometer(el('appr')) };
    const ono = el('ono');
    function render() { odo.orders(D.orders); odo.inv(D.inv); odo.appr(D.appr); ono.textContent = String(D.ono); }

    const clockText = () => new Date().toTimeString().slice(0, 8);
    function showEvent(text: string) {
      if (!evt) return;
      evt.textContent = `${clockText()}  ${text}`;
      evt.classList.remove('in'); void evt.offsetWidth; evt.classList.add('in');
    }
    function event(text: string, force = false) {
      const now = performance.now();
      if (force || now - lastEvt > 650) { lastEvt = now; showEvent(text); pendingEvt = ''; }
      else pendingEvt = text;
    }
    const evTimer = window.setInterval(() => { if (pendingEvt && running()) event(pendingEvt, true); }, 700);
    disposers.push(() => clearInterval(evTimer));

    function reset() {
      Object.assign(D, BASE, { step: 0, heights: BARS.slice() });
      bars.forEach((b, i) => b.style.setProperty('--h', D.heights[i] + '%'));
      steps.forEach(s => s.classList.remove('done'));
      tiles.forEach(t => t.classList.remove('spot'));
      render();
      if (evt) { evt.textContent = 'Waiting for data…'; evt.classList.remove('in'); }
    }
    function pulse(i: number) { const t = tiles[i]; t.classList.remove('hit'); void t.offsetWidth; t.classList.add('hit'); }
    function hit(i: number) {
      pulse(i);
      if (!SYS.live) return;
      if (i === 0) event(`Sync complete · ${(rand(12, 48)) | 0} records`);
      if (i === 1) { D.orders += 1 + ((Math.random() * 3) | 0); event(`SO-${2400 + D.orders} confirmed · stock reserved`); }
      if (i === 2) { D.inv += 1; event(`INV-${3091 + D.inv} matched to PO → posted`); }
      if (i === 3) { D.appr = 1 + ((Math.random() * 5) | 0); event(`PO-${1040 + ((Math.random() * 60) | 0)} routed to Priya for approval`); }
      if (i === 4) {
        const b = Math.random() < 0.5 ? 6 : (Math.random() * 7) | 0;
        D.heights[b] = clamp(D.heights[b] + rand(-4, 10), 28, 98);
        bars[b].style.setProperty('--h', D.heights[b] + '%');
        event(`Throughput updated · ${DAYS[b]}`);
      }
      if (i === 5 && !resetting && performance.now() - lastStep > 520) {
        lastStep = performance.now();
        steps[D.step].classList.add('done');
        event(`Order #${D.ono} · ${STEPS[D.step]}`);
        D.step++;
        if (D.step >= steps.length) {
          resetting = true;
          later(() => { steps.forEach(s => s.classList.remove('done')); D.step = 0; D.ono++; render(); resetting = false; }, 700);
        }
      }
      render();
    }
    function spotlight(n: number) {
      if (!SYS.live) return;
      const set = SPOT[n] || [];
      SYS.spotTiles = new Set(set);
      tiles.forEach((t, i) => t.classList.toggle('spot', set.includes(i) && set.length < 6));
      if (set.length === 6) { const sw = $('.hs-flow__sweep i', flowEl); gsap.fromTo(sw, { xPercent: -110 }, { xPercent: 110, duration: 1.3, ease: 'power2.inOut' }); }
      gsap.to(SYS, { spot: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
      event(SPOT_EVENTS[n] || '', true);
      later(() => { gsap.to(SYS, { spot: 0, duration: 0.8, overwrite: true }); tiles.forEach(t => t.classList.remove('spot')); }, 2600);
    }
    return { tiles, bars, steps, D, BASE, reset, render, hit, spotlight, event };
  })();

  /* ═════════════════ BOARD (canvas) ═════════════════ */
  type Node = { bx: number; by: number; x: number; y: number; ph: number; amp: number; sp: number; hub: boolean; flash: number };
  type Edge = { a: number; b: number; brk: boolean };
  type Trace = { pts: Pt[]; seg: number[]; cum: number[]; len: number; tile: number; side: number; pad: boolean; vias: number[]; brk: number; flash: number; mx: number[]; my: number[]; dim: number };
  type Pulse = { tr: number; s: number; speed: number };
  type Particle = { x: number; y: number; px: number; py: number; vx: number; vy: number; tx: number; ty: number; tr: number; life: number };
  type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number };

  const fx = (() => {
    const ctx = canvas.getContext('2d')!;
    const gctx = bloom.getContext('2d')!;
    let W = 0, H = 0, T = 0, lastKey = '', mobile = false;
    let nodes: Node[] = [], edges: Edge[] = [], adj: number[][] = [], npk: Array<{ path: number[]; seg: number; t: number; speed: number }> = [];
    let traces: Trace[] = [], maxLen = 1;
    let pulses: Pulse[] = [], parts: Particle[] = [], sparks: Spark[] = [];
    let grid: Pt[] = [];
    const waves: Array<{ x: number; y: number; t0: number; s: number }> = [];
    let pulseAcc = 0, sparkAcc = 0, npkAcc = 0;
    let loop: { wake: Fn } | null = null;

    const dashRect = (): Rect => {
      const cr = canvas.getBoundingClientRect(), fr = stage.getBoundingClientRect();
      return { x: fr.left - cr.left, y: fr.top - cr.top, w: fr.width, h: fr.height };
    };
    const keyOf = (r: Rect) => [r.x, r.y, r.w, r.h, W, H].map(v => Math.round(v / 8)).join(',');

    /* ── geometry helpers ── */
    function offsetPolyline(c: Pt[], o: number): Pt[] {
      const n = c.length, out: Pt[] = [];
      const norms: Pt[] = [];
      for (let i = 0; i < n - 1; i++) {
        const dx = c[i + 1][0] - c[i][0], dy = c[i + 1][1] - c[i][1], l = Math.hypot(dx, dy) || 1;
        norms.push([-dy / l, dx / l]);
      }
      for (let i = 0; i < n; i++) {
        if (i === 0) { out.push([c[0][0] + norms[0][0] * o, c[0][1] + norms[0][1] * o]); continue; }
        if (i === n - 1) { const m = norms[n - 2]; out.push([c[i][0] + m[0] * o, c[i][1] + m[1] * o]); continue; }
        const a = norms[i - 1], b = norms[i], d = 1 + a[0] * b[0] + a[1] * b[1];
        out.push([c[i][0] + (a[0] + b[0]) / d * o, c[i][1] + (a[1] + b[1]) / d * o]);
      }
      return out;
    }
    function finishTrace(pts: Pt[], tile: number, side: number, pad: boolean, dim = 1): Trace {
      const seg: number[] = [], cum: number[] = [0], mx: number[] = [], my: number[] = [];
      let len = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
        seg.push(l); len += l; cum.push(len);
        mx.push((pts[i][0] + pts[i + 1][0]) / 2); my.push((pts[i][1] + pts[i + 1][1]) / 2);
      }
      const vias = Math.random() < 0.6 ? [rand(0.3, 0.85) * len] : [];
      return { pts, seg, cum, len, tile, side, pad, vias, brk: rand(0.15, 0.85) * len, flash: 0, mx, my, dim };
    }
    function at(tr: Trace, s: number): Pt {
      s = clamp(s, 0, tr.len);
      let i = 0;
      while (i < tr.seg.length - 1 && tr.cum[i + 1] < s) i++;
      const f = tr.seg[i] ? (s - tr.cum[i]) / tr.seg[i] : 0;
      return [lerp(tr.pts[i][0], tr.pts[i + 1][0], f), lerp(tr.pts[i][1], tr.pts[i + 1][1], f)];
    }
    function strokeRange(c: CanvasRenderingContext2D, tr: Trace, s0: number, s1: number) {
      if (s1 <= s0) return;
      const a = at(tr, s0);
      c.beginPath(); c.moveTo(a[0], a[1]);
      for (let i = 1; i < tr.pts.length - 1; i++) if (tr.cum[i] > s0 && tr.cum[i] < s1) c.lineTo(tr.pts[i][0], tr.pts[i][1]);
      const b = at(tr, s1); c.lineTo(b[0], b[1]); c.stroke();
    }
    function tileAt(r: Rect, p: Pt) {
      let best = 0, bd = Infinity;
      TILES.forEach((t, i) => {
        const x0 = r.x + t[0] / 100 * r.w, y0 = r.y + t[1] / 100 * r.h, x1 = x0 + t[2] / 100 * r.w, y1 = y0 + t[3] / 100 * r.h;
        const dx = Math.max(x0 - p[0], 0, p[0] - x1), dy = Math.max(y0 - p[1], 0, p[1] - y1), d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }

    /* ── build board ── */
    function build() {
      const r = dashRect();
      mobile = W < 768;
      const ch = r.h * 0.92; // tiles occupy the top 92% of the stage
      const cvr = canvas.getBoundingClientRect(), cb = content.getBoundingClientRect();
      const contentRight = cb.right - cvr.left;
      // background constellation
      const cell = mobile ? 84 : 118;
      nodes = [];
      for (let gy = 0; gy < Math.ceil(H / cell) + 1; gy++) for (let gx = 0; gx < Math.ceil(W / cell) + 1; gx++) {
        if (Math.random() > 0.62) continue;
        const bx = (gx - 0.35 + rand(0.7)) * cell, by = (gy - 0.35 + rand(0.7)) * cell;
        nodes.push({ bx, by, x: bx, y: by, ph: rand(TAU), amp: rand(2, 6), sp: rand(0.3, 0.8), hub: Math.random() < 0.08, flash: 0 });
      }
      edges = []; adj = nodes.map(() => []);
      const seen = new Set<number>(), maxD = (cell * 1.7) ** 2;
      nodes.forEach((n, i) => {
        const near: Array<[number, number]> = [];
        nodes.forEach((m, j) => { if (i !== j) { const d = (m.bx - n.bx) ** 2 + (m.by - n.by) ** 2; if (d < maxD) near.push([j, d]); } });
        near.sort((a, b) => a[1] - b[1]).slice(0, 3).forEach(([j]) => {
          const k = i < j ? i * 100000 + j : j * 100000 + i;
          if (seen.has(k)) return; seen.add(k);
          edges.push({ a: i, b: j, brk: Math.random() < 0.45 }); adj[i].push(j); adj[j].push(i);
        });
      });
      npk = [];

      // circuit traces: parallel buses leaving each side of the console
      traces = [];
      const SP = mobile ? 6 : 7;
      const sides = [
        { side: 0, d: [0, -1] as Pt, groups: mobile ? 2 : 3 },   // top
        { side: 1, d: [1, 0] as Pt, groups: mobile ? 2 : 3 },    // right
        { side: 2, d: [0, 1] as Pt, groups: mobile ? 2 : 3 },    // bottom
        { side: 3, d: [-1, 0] as Pt, groups: mobile ? 2 : 3 },   // left
      ];
      for (const sd of sides) {
        for (let g = 0; g < sd.groups; g++) {
          const n = mobile ? 2 + ((Math.random() * 2) | 0) : 2 + ((Math.random() * 3) | 0);
          const f = clamp((g + 0.5) / sd.groups + rand(-0.1, 0.1), 0.08, 0.92);
          const [dx, dy] = sd.d;
          let start: Pt;
          if (sd.side === 0) start = [r.x + f * r.w, r.y - 3];
          else if (sd.side === 2) start = [r.x + f * r.w, r.y + ch + 3];
          else if (sd.side === 1) start = [r.x + r.w + 3, r.y + f * ch];
          else start = [r.x - 3, r.y + f * ch];
          // centreline: straight, 45° jog, straight, maybe a second jog, then out to the edge (or a pad)
          const nrm: Pt = [-dy, dx];
          const c: Pt[] = [start];
          let cur: Pt = start;
          const jogs = Math.random() < 0.55 ? 2 : 1;
          const toLeft = sd.side === 3;
          for (let j = 0; j < jogs; j++) {
            const L1 = rand(16, toLeft ? 40 : 70);
            cur = [cur[0] + dx * L1, cur[1] + dy * L1]; c.push(cur);
            const s = Math.random() < 0.5 ? -1 : 1, L2 = rand(18, toLeft ? 60 : 110);
            const dg: Pt = [(dx + s * nrm[0]) / Math.SQRT2, (dy + s * nrm[1]) / Math.SQRT2];
            cur = [cur[0] + dg[0] * L2, cur[1] + dg[1] * L2]; c.push(cur);
          }
          // final run
          let L3: number, pad = true;
          // desktop: stop short of the headline column
          if (toLeft) L3 = mobile ? rand(20, 60) : Math.max(16, Math.min(rand(60, 260), cur[0] - contentRight - 36));
          else {
            const toEdge = dx > 0 ? W - cur[0] + 30 : dx < 0 ? cur[0] + 30 : dy > 0 ? H - cur[1] + 30 : cur[1] + 30;
            if (Math.random() < 0.65) { L3 = toEdge; pad = false; } else L3 = Math.min(toEdge, rand(40, 160));
          }
          for (let i = 0; i < n; i++) {
            const o = (i - (n - 1) / 2) * SP;
            const cc = c.map(p => [p[0], p[1]] as Pt);
            const extra = pad ? rand(-0.35, 0.2) * L3 : 0;
            const last = cc[cc.length - 1];
            cc.push([last[0] + dx * (L3 + extra), last[1] + dy * (L3 + extra)]);
            const pts = offsetPolyline(cc, o);
            // phones: the copy sits above the console, so upward traces run behind text — keep them quiet
            traces.push(finishTrace(pts, tileAt(r, pts[0]), sd.side, pad, W < 1024 && sd.side === 0 ? 0.35 : 1));
          }
        }
      }
      maxLen = Math.max(1, ...traces.map(t => t.len));
      pulses = []; parts = []; sparks = [];
      // PCB dot grid for the torch
      grid = [];
      const gs = 22;
      for (let y = gs / 2; y < H; y += gs) for (let x = gs / 2; x < W; x += gs) grid.push([x, y]);
      lastKey = keyOf(r);
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      if (Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 1) return;
      W = r.width; H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bd = 0.5;
      bloom.width = Math.round(W * bd); bloom.height = Math.round(H * bd);
      gctx.setTransform(bd, 0, 0, bd, 0, 0);
      build();
      loop?.wake();
    }

    /* ── public: effects ── */
    function wave(s = 1) { const r = dashRect(); waves.push({ x: r.x + r.w / 2, y: r.y + r.h * 0.46, t0: T, s }); }
    function absorb(x: number, y: number, n: number) {
      const cr = canvas.getBoundingClientRect();
      x -= cr.left; y -= cr.top;
      for (let i = 0; i < n; i++) {
        const tr = traces.length ? (Math.random() * traces.length) | 0 : -1;
        const target = tr >= 0 ? traces[tr].pts[0] : [x, y];
        const a = rand(TAU), sp = rand(80, 320);
        parts.push({ x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, tx: target[0], ty: target[1], tr, life: 2.2 });
      }
    }
    function burst(x: number, y: number, n: number, hot = true) {
      for (let i = 0; i < n; i++) {
        const a = rand(TAU), sp = rand(30, hot ? 160 : 70);
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (hot ? 0 : 20), life: rand(0.25, 0.6), max: 0.6 });
      }
    }

    /* ── frame ── */
    function frame(dt: number, t: number) {
      T = t;
      const r = dashRect();
      if (dt > 0 && window.scrollY < 2 && keyOf(r) !== lastKey) build();
      ctx.clearRect(0, 0, W, H);
      gctx.clearRect(0, 0, W, H);
      const m = SYS.m, P = SYS.power, intro = reduced ? 1 : easeOut(clamp(t / 2, 0, 1));
      const mx = S.mx, my = S.my, ptr = S.pointer && finePointer;
      const torchR = 230;
      const torch = (x: number, y: number) => (ptr ? clamp(1 - Math.hypot(x - mx, y - my) / torchR, 0, 1) : 0);

      /* background constellation (parallax depth) */
      const ox = -S.px * 16, oy = -S.py * 10;
      ctx.save(); ctx.translate(ox, oy);
      for (const n of nodes) {
        n.x = n.bx + Math.sin(t * n.sp + n.ph) * n.amp * (1 + (1 - m));
        n.y = n.by + Math.cos(t * n.sp * 0.8 + n.ph) * n.amp * (1 + (1 - m));
        n.flash = Math.max(0, n.flash - dt * 1.4);
      }
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        let al = (0.028 + 0.05 * m) * intro + Math.max(a.flash, b.flash) * 0.18;
        if (e.brk) al *= m;
        if (al < 0.004) continue;
        ctx.strokeStyle = `rgba(${GOLD},${al})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${GOLD},${(0.18 + 0.22 * m) * intro + n.flash * 0.5})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? 1.8 : 1.1, 0, TAU); ctx.fill();
      }
      // wandering background packets
      if (!reduced && dt > 0 && nodes.length) {
        npkAcc += dt;
        if (npkAcc > lerp(0.9, 0.35, m)) {
          npkAcc = 0;
          const s = (Math.random() * nodes.length) | 0, path = [s];
          let prev = -1, cur = s;
          for (let h = 0; h < 4; h++) { const o = adj[cur].filter(x => x !== prev); if (!o.length) break; prev = cur; cur = pick(o); path.push(cur); }
          if (path.length > 1) npk.push({ path, seg: 0, t: 0, speed: rand(60, 120) });
        }
      }
      for (let q = npk.length - 1; q >= 0; q--) {
        const p = npk[q], a = nodes[p.path[p.seg]], b = nodes[p.path[p.seg + 1]];
        p.t += dt * p.speed / (Math.hypot(b.x - a.x, b.y - a.y) || 1);
        if (p.t >= 1) { b.flash = 0.5; p.seg++; p.t = 0; if (p.seg >= p.path.length - 1) npk.splice(q, 1); continue; }
        ctx.fillStyle = `rgba(${GOLD_L},${0.35 + 0.35 * m})`;
        ctx.beginPath(); ctx.arc(lerp(a.x, b.x, p.t), lerp(a.y, b.y, p.t), 1.3, 0, TAU); ctx.fill();
      }
      ctx.restore();

      /* console halo */
      if (P > 0.01) {
        const cx = r.x + r.w / 2, cy = r.y + r.h * 0.46, rad = Math.max(r.w, r.h) * 1.05;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `rgba(${GOLD},${0.12 * P})`); g.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.fillStyle = g; ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }

      /* torch-lit PCB dot grid */
      if (ptr) {
        const reveal = 0.55 * (1 - P * 0.6);
        for (const [x, y] of grid) {
          if (Math.abs(x - mx) > torchR || Math.abs(y - my) > torchR) continue;
          const k = torch(x, y);
          if (k <= 0) continue;
          ctx.fillStyle = `rgba(${GOLD},${k * k * reveal * 0.5})`;
          ctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
        }
      }

      /* waves */
      for (let q = waves.length - 1; q >= 0; q--) {
        const w = waves[q], rr = (t - w.t0) * 1200, max = Math.hypot(W, H);
        if (rr > max) { waves.splice(q, 1); continue; }
        const a = (1 - rr / max) * 0.5 * w.s;
        for (const c of [ctx, gctx]) {
          c.strokeStyle = `rgba(${GOLD_L},${a})`; c.lineWidth = c === gctx ? 6 : 1.4;
          c.beginPath(); c.arc(w.x, w.y, rr, 0, TAU); c.stroke();
        }
        for (const n of nodes) { if (Math.abs(Math.hypot(n.x - w.x, n.y - w.y) - rr) < 30) n.flash = Math.max(n.flash, w.s); }
      }

      /* traces */
      const D = P * (maxLen + 80);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      gctx.lineCap = 'round'; gctx.lineJoin = 'round';
      traces.forEach(tr => {
        ctx.globalAlpha = gctx.globalAlpha = tr.dim;
        const spot = SYS.spotTiles.has(tr.tile) ? SYS.spot : 0;
        const lit = clamp(D, 0, tr.len);
        tr.flash = Math.max(0, tr.flash - dt * 2.4);
        // unpowered remainder (torch reveals it)
        if (lit < tr.len) {
          for (let i = 0; i < tr.seg.length; i++) {
            const s0 = Math.max(tr.cum[i], lit), s1 = tr.cum[i + 1];
            if (s1 <= s0) continue;
            const k = torch(tr.mx[i], tr.my[i]);
            const al = (0.05 + 0.03 * m) * intro + k * 0.42;
            ctx.strokeStyle = `rgba(${GOLD},${al})`; ctx.lineWidth = 1;
            strokeRange(ctx, tr, s0, s1);
          }
        }
        if (lit > 0) {
          const al = 0.2 + 0.12 * P + spot * 0.35 + tr.flash * 0.4;
          ctx.strokeStyle = `rgba(${GOLD},${Math.min(0.9, al)})`; ctx.lineWidth = 1.25;
          strokeRange(ctx, tr, 0, lit);
          gctx.strokeStyle = `rgba(${GOLD},${Math.min(0.7, 0.18 + spot * 0.5 + tr.flash * 0.5)})`; gctx.lineWidth = 3;
          strokeRange(gctx, tr, 0, lit);
          // power front
          if (lit < tr.len && P < 1) {
            const [hx, hy] = at(tr, lit);
            ctx.strokeStyle = `rgba(${HOT},0.95)`; ctx.lineWidth = 1.8; strokeRange(ctx, tr, Math.max(0, lit - 28), lit);
            gctx.fillStyle = `rgba(${HOT},0.9)`; gctx.beginPath(); gctx.arc(hx, hy, 7, 0, TAU); gctx.fill();
          }
        }
        // pads & vias
        const end = tr.pts[tr.pts.length - 1];
        const endLit = lit >= tr.len - 1;
        if (tr.pad) {
          const k = torch(end[0], end[1]);
          ctx.strokeStyle = `rgba(${endLit ? GOLD_L : GOLD},${endLit ? 0.55 : (0.08 + k * 0.5) * intro})`;
          ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(end[0], end[1], 3.2, 0, TAU); ctx.stroke();
          if (endLit) { ctx.fillStyle = `rgba(${GOLD},0.35)`; ctx.fill(); }
        }
        for (const v of tr.vias) {
          const [vx, vy] = at(tr, v);
          const on = lit > v;
          ctx.fillStyle = `rgba(${on ? GOLD_L : GOLD},${on ? 0.6 : 0.1 * intro + torch(vx, vy) * 0.4})`;
          ctx.beginPath(); ctx.arc(vx, vy, 1.9, 0, TAU); ctx.fill();
        }
        // console port connector
        if (P > 0.05) {
          const [px, py] = tr.pts[0];
          ctx.fillStyle = `rgba(${GOLD_L},${Math.min(1, P) * (0.45 + tr.flash * 0.55)})`;
          const vert = tr.side === 0 || tr.side === 2;
          ctx.fillRect(px - (vert ? 1.5 : 3), py - (vert ? 3 : 1.5), vert ? 3 : 6, vert ? 6 : 3);
        }
      });
      ctx.globalAlpha = gctx.globalAlpha = 1;

      /* chaos sparks at the breaks */
      if (!reduced && dt > 0 && P < 0.3 && traces.length) {
        sparkAcc += dt;
        if (sparkAcc > 0.16) {
          sparkAcc = 0;
          const tr = pick(traces), [bx, by] = at(tr, tr.brk);
          burst(bx, by, 2 + ((Math.random() * 3) | 0), false);
        }
      }

      /* live pulses */
      if (!reduced && dt > 0 && P > 0.92 && traces.length) {
        pulseAcc += dt;
        const every = SYS.live ? (mobile ? 0.12 : 0.055) : 0.2;
        while (pulseAcc > every) {
          pulseAcc -= every;
          if (pulses.length > (mobile ? 22 : 60)) break;
          let i = (Math.random() * traces.length) | 0;
          if (SYS.spot > 0.3 && Math.random() < 0.6) {
            const cands = traces.map((tr, k) => (SYS.spotTiles.has(tr.tile) ? k : -1)).filter(k => k >= 0);
            if (cands.length) i = pick(cands);
          }
          const tr = traces[i];
          pulses.push({ tr: i, s: tr.len * rand(0.55, 1), speed: rand(260, 480) });
        }
      }
      for (let q = pulses.length - 1; q >= 0; q--) {
        const p = pulses[q], tr = traces[p.tr];
        if (!tr) { pulses.splice(q, 1); continue; }
        p.s -= p.speed * dt;
        if (p.s <= 0) {
          tr.flash = 1;
          const [px, py] = tr.pts[0];
          burst(px, py, 3);
          dash.hit(tr.tile);
          pulses.splice(q, 1);
          continue;
        }
        const tail = 54;
        ctx.globalAlpha = gctx.globalAlpha = tr.dim;
        const [hx, hy] = at(tr, p.s);
        const [sx, sy] = at(tr, Math.min(tr.len, p.s + tail));
        const g = ctx.createLinearGradient(sx, sy, hx, hy);
        g.addColorStop(0, `rgba(${GOLD},0)`); g.addColorStop(1, `rgba(${HOT},0.95)`);
        ctx.strokeStyle = g; ctx.lineWidth = 1.7;
        strokeRange(ctx, tr, p.s, Math.min(tr.len, p.s + tail));
        ctx.fillStyle = `rgba(${HOT},1)`; ctx.beginPath(); ctx.arc(hx, hy, 1.6, 0, TAU); ctx.fill();
        gctx.fillStyle = `rgba(${GOLD_L},0.85)`; gctx.beginPath(); gctx.arc(hx, hy, 5, 0, TAU); gctx.fill();
      }
      ctx.globalAlpha = gctx.globalAlpha = 1;

      /* absorbed particles → ports */
      for (let q = parts.length - 1; q >= 0; q--) {
        const p = parts[q];
        p.life -= dt;
        const dx = p.tx - p.x, dy = p.ty - p.y, d = Math.hypot(dx, dy) || 1;
        const pull = 1400 * (1 - p.life / 2.2) + 300;
        p.vx = (p.vx + dx / d * pull * dt) * (1 - 2.2 * dt);
        p.vy = (p.vy + dy / d * pull * dt) * (1 - 2.2 * dt);
        p.px = p.x; p.py = p.y;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (d < 10 || p.life <= 0) {
          if (p.tr >= 0 && traces[p.tr]) traces[p.tr].flash = 1;
          parts.splice(q, 1); continue;
        }
        for (const c of [ctx, gctx]) {
          c.strokeStyle = `rgba(${c === gctx ? GOLD_L : HOT},${c === gctx ? 0.7 : 0.95})`;
          c.lineWidth = c === gctx ? 3 : 1.4;
          c.beginPath(); c.moveTo(p.px, p.py); c.lineTo(p.x, p.y); c.stroke();
        }
      }

      /* sparks */
      for (let q = sparks.length - 1; q >= 0; q--) {
        const s = sparks[q];
        s.life -= dt;
        if (s.life <= 0) { sparks.splice(q, 1); continue; }
        s.vy += 160 * dt; s.vx *= 1 - 3 * dt; s.vy *= 1 - 3 * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        const a = s.life / s.max, col = P < 0.3 ? EMBER : HOT;
        ctx.fillStyle = `rgba(${col},${a})`; ctx.fillRect(s.x - 0.8, s.y - 0.8, 1.6, 1.6);
        gctx.fillStyle = `rgba(${col},${a * 0.8})`; gctx.beginPath(); gctx.arc(s.x, s.y, 3, 0, TAU); gctx.fill();
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    disposers.push(() => ro.disconnect());
    resize();
    loop = makeLoop(frame);
    return { wave, absorb, burst };
  })();

  /* ═════════════════ DIRECTOR ═════════════════ */
  let master: gsap.core.Timeline | null = null;
  let asTime = 0;
  const director = (() => {
    const tiles = dash.tiles;
    const ins = $$('.hs-tile__in', flowEl), mess = $$('.hs-face--mess', flowEl), clean = $$('.hs-face--clean', flowEl);
    const frags = $$('.hs-frag', flowEl), sweep = $('.hs-flow__sweep i', flowEl);
    const frame = $$('.hs-frame i', flowEl);
    const capB = $('.hs-cap--before', flowEl), capA = $('.hs-cap--after', flowEl), prog = $('.hs-flow__prog i', flowEl);
    const showCap = (after: boolean) => { capB.classList.toggle('on', !after); capA.classList.toggle('on', after); };
    let lastW = 0, started = false;

    function ordered() {
      flowEl.classList.remove('is-chaos'); flowEl.classList.add('is-live');
      SYS.m = 1; SYS.power = 1; SYS.live = false;
      mess.forEach(m => (m.style.opacity = '0'));
      frags.forEach(f => (f.style.opacity = '0'));
      frame.forEach(f => (f.style.transform = 'none'));
      dash.steps.slice(0, 3).forEach(s => s.classList.add('done'));
      dash.event('Order #1046 · invoice raised', true);
      showCap(true);
      prog.style.transform = 'scaleX(1)';
    }

    function build(first: boolean) {
      master?.kill();
      const r = stage.getBoundingClientRect();
      lastW = r.width;
      if (reduced) { ordered(); return; }
      const sw = r.width, sh = r.height;
      const chaos = (i: number) => ({ x: CHAOS[i][0] / 100 * sw, y: CHAOS[i][1] / 100 * sh, rotation: CHAOS[i][2], rotationX: CHAOS[i][3], rotationY: CHAOS[i][4], scale: CHAOS[i][5], filter: `blur(${CHAOS[i][6]}px)` });
      const flat = { x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1, filter: 'blur(0px)' };
      const fragHome = { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, filter: 'blur(0px)' };
      const frameOff = (el: HTMLElement) => (el.classList.contains('v') ? { scaleY: 0 } : { scaleX: 0 });
      const frameOn = (el: HTMLElement) => (el.classList.contains('v') ? { scaleY: 1 } : { scaleX: 1 });

      const enterChaos = () => {
        flowEl.classList.add('is-chaos'); flowEl.classList.remove('is-live');
        showCap(false); SYS.live = false; dash.reset();
      };
      enterChaos(); SYS.m = 0; SYS.power = 0;
      tiles.forEach((t, i) => gsap.set(t, chaos(i)));
      gsap.set(mess, { opacity: 1 }); gsap.set(clean, { opacity: 0 }); gsap.set(dash.bars, { scaleY: 0.04 });
      gsap.set(frags, fragHome);
      frame.forEach(f => gsap.set(f, frameOff(f)));

      const tl = gsap.timeline({ repeat: -1, paused: true, onUpdate() { prog.style.transform = `scaleX(${tl.progress().toFixed(4)})`; } });
      tl.call(enterChaos, undefined, 0);
      tiles.forEach((t, i) => tl.set(t, chaos(i), 0));
      tl.set(SYS, { m: 0, power: 0 }, 0).set(mess, { opacity: 1 }, 0).set(clean, { opacity: 0 }, 0).set(dash.bars, { scaleY: 0.04 }, 0);

      asTime = 3.6;
      tl.addLabel('as', asTime);
      // the frame draws itself (top → right → bottom → left)
      frame.forEach((f, i) => tl.to(f, { ...frameOn(f), duration: 0.32, ease: 'power2.inOut' }, `as-=${0.75 - i * 0.18}`));
      tl.call(() => { fx.wave(1); flowEl.classList.remove('is-chaos'); flowEl.classList.add('is-live'); }, undefined, 'as');
      tl.to(SYS, { power: 1, duration: 1.9, ease: 'power2.inOut' }, 'as');
      tl.to(SYS, { m: 1, duration: 1.6, ease: 'power2.inOut' }, 'as');
      // fragments are pulled into the console and dissolve into particles
      frags.forEach((f, i) => {
        const at = `as+=${0.05 + i * 0.07}`;
        tl.to(f, {
          x: () => sw / 2 - (f.offsetLeft + f.offsetWidth / 2),
          y: () => sh * 0.46 - (f.offsetTop + f.offsetHeight / 2),
          scale: 0.15, rotation: rand(-40, 40), opacity: 0, filter: 'blur(6px)', duration: 0.95, ease: 'power3.in',
        }, at);
        tl.call(() => { const b = f.getBoundingClientRect(); fx.absorb(b.left + b.width / 2, b.top + b.height / 2, 26); }, undefined, `as+=${0.62 + i * 0.07}`);
      });
      tl.to(tiles, { ...flat, duration: 1.6, ease: 'expo.inOut', stagger: { each: 0.09, from: 'random' } }, 'as+=0.15');
      tl.to(mess, { opacity: 0, duration: 0.45, stagger: 0.08 }, 'as+=0.6');
      tl.to(clean, { opacity: 1, duration: 0.6, stagger: 0.08 }, 'as+=0.75');
      tl.call(() => { tiles.forEach((_, i) => later(() => dash.hit(i), i * 60)); showCap(true); fx.wave(0.55); dash.event('Console online · 6 modules connected', true); }, undefined, 'as+=1.7');
      tl.fromTo(sweep, { xPercent: -110 }, { xPercent: 110, duration: 1.3, ease: 'power2.inOut' }, 'as+=1.65');
      tl.to(dash.bars, { scaleY: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06 }, 'as+=1.65');
      (['orders', 'inv', 'appr'] as const).forEach(key => {
        const o = { v: 0 };
        tl.to(o, { v: dash.BASE[key], duration: 1.3, ease: 'power2.out', onUpdate() { dash.D[key] = Math.round(o.v); dash.render(); } }, 'as+=1.65');
      });
      tl.call(() => { SYS.live = true; }, undefined, 'as+=3');

      tl.addLabel('sc', 'as+=12.5');
      tl.call(() => { SYS.live = false; flowEl.classList.add('is-chaos'); flowEl.classList.remove('is-live'); showCap(false); dash.event('Connection lost · back to spreadsheets', true); }, undefined, 'sc');
      tl.to(SYS, { power: 0, duration: 1.3, ease: 'power2.in' }, 'sc');
      tl.to(SYS, { m: 0, duration: 1.3, ease: 'power2.in' }, 'sc');
      [...frame].reverse().forEach((f, i) => tl.to(f, { ...frameOff(f), duration: 0.25, ease: 'power2.in' }, `sc+=${i * 0.12}`));
      tl.to(clean, { opacity: 0, duration: 0.35, stagger: 0.05 }, 'sc+=0.15');
      tl.to(mess, { opacity: 1, duration: 0.4, stagger: 0.05 }, 'sc+=0.25');
      tl.to(dash.bars, { scaleY: 0.04, duration: 0.4 }, 'sc');
      tiles.forEach((t, i) => tl.to(t, { ...chaos(i), duration: 1.3, ease: 'expo.inOut' }, `sc+=${0.1 + i * 0.05}`));
      tl.fromTo(frags, { x: 0, y: 0, scale: 0, opacity: 0, rotation: 0, filter: 'blur(0px)' }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)', stagger: 0.08, immediateRender: false }, 'sc+=0.6');
      tl.to({}, { duration: 0.5 }, 'sc+=2');
      master = tl;

      if (first) {
        started = false;
        tl.seek(1.2);
        gsap.fromTo(ins, { opacity: 0, y: -80, rotationX: 75, scale: 0.6 }, {
          opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1.3, ease: 'power3.out', stagger: 0.09, delay: 0.5,
          onComplete() { gsap.set(ins, { clearProps: 'all' }); },
        });
        gsap.fromTo(frags, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)', stagger: 0.08, delay: 0.9 });
        later(() => { started = true; sync(); }, 1500);
      } else { started = true; }
      sync();
    }
    function sync() { if (!master) return; (!started || !running()) ? master.pause() : master.resume(); }
    listeners.add(sync);
    build(true);
    const ro = new ResizeObserver(() => { const w = stage.getBoundingClientRect().width; if (Math.abs(w - lastW) > 2) build(false); });
    ro.observe(stage);
    disposers.push(() => ro.disconnect());

    // click the unpowered console to power it on now
    on(flowEl, 'click', () => {
      if (!master || reduced || !started) return;
      const t = master.time();
      if (t < asTime - 0.8) { master.seek(asTime - 0.8); if (!running()) master.pause(); }
    });
    return { sync };
  })();
  void director;

  /* ═════════════════ HEADLINE ═════════════════ */
  const firstPhrase = (() => {
    const box = $('.hs__rot'), line = $('.hs__rot-line', box);
    const first = box ? $('.hs__phrase', box) : null;
    if (!box || !first) return null;
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
      later(() => dash.spotlight(n), 500);
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

  /* ═════════════════ AI AGENT TYPER + CLOCK ═════════════════ */
  (() => {
    const el = $('.hs-typer');
    if (!el) return;
    const lines = (el.dataset.lines || '').split('|').filter(Boolean);
    let li = 0, ci = 0, mode: 'type' | 'hold' | 'erase' = 'type', wait = 0;
    const id = window.setInterval(() => {
      if (!running() || !lines.length) return;
      const text = lines[li];
      if (mode === 'type') { ci++; el.textContent = text.slice(0, ci); if (ci >= text.length) { mode = 'hold'; wait = 0; } }
      else if (mode === 'hold') { if (++wait > 55) mode = 'erase'; }
      else { ci = Math.max(0, ci - 3); el.textContent = text.slice(0, ci); if (ci === 0) { mode = 'type'; li = (li + 1) % lines.length; } }
    }, 38);
    disposers.push(() => clearInterval(id));
  })();
  (() => {
    const el = $('[data-k="clock"]');
    if (!el) return;
    const tick = () => { el.textContent = new Date().toTimeString().slice(0, 8); };
    tick();
    const id = window.setInterval(tick, 1000);
    disposers.push(() => clearInterval(id));
  })();

  /* ═════════════════ CHIPS, TILT, POINTER, SCROLL, PAUSE ═════════════════ */
  function applyStage() {
    const p = reduced ? 0 : S.scroll;
    chips.forEach(c => {
      const d = Number(c.dataset.depth) || 16;
      c.style.transform = `translate3d(${(S.px * d).toFixed(2)}px,${(S.py * d - p * 180 * (d / 20)).toFixed(2)}px,0)`;
    });
    flowEl.style.transform = `rotateX(${(S.tiltX + p * 24).toFixed(2)}deg) rotateY(${S.tiltY.toFixed(2)}deg)`;
  }
  const glare = $('.hs-glare', flowEl);
  makeLoop(dt => {
    const k = Math.min(1, dt * 4);
    S.px = lerp(S.px, S.tx, k); S.py = lerp(S.py, S.ty, k);
    const fr = flowEl.getBoundingClientRect();
    let gx = 0.5, gy = 0.3, tx = 0, ty = 0;
    if (S.pointer && finePointer) {
      const rr = root.getBoundingClientRect();
      gx = (S.mx + rr.left - fr.left) / (fr.width || 1); gy = (S.my + rr.top - fr.top) / (fr.height || 1);
      tx = clamp((gy - 0.5) * -9, -6, 6); ty = clamp((gx - 0.5) * 12, -8, 8);
    }
    S.tiltX = lerp(S.tiltX, tx, Math.min(1, dt * 3)); S.tiltY = lerp(S.tiltY, ty, Math.min(1, dt * 3));
    if (glare) { glare.style.setProperty('--gx', (gx * 100).toFixed(1) + '%'); glare.style.setProperty('--gy', (gy * 100).toFixed(1) + '%'); }
    applyStage();
  });

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
    // the board lays down into the distance
    visual.style.transform = `perspective(1100px) rotateX(${(p * 34).toFixed(2)}deg) translate3d(0,${(p * 90).toFixed(1)}px,0) scale(${(1 + p * 0.08).toFixed(4)})`;
    stage.style.transform = `translate3d(0,${(p * 70).toFixed(1)}px,${(-p * 160).toFixed(1)}px)`;
    stage.style.opacity = String(clamp(1 - p * 1.15, 0, 1));
    foot.style.opacity = String(clamp(1 - p * 3, 0, 1));
    applyStage();
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

  /* ═════════════════ ENTRANCE ═════════════════ */
  let intro: gsap.core.Timeline | null = null;
  if (!reduced) {
    intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from($$('.hs__label'), { opacity: 0, x: -14, duration: 0.9 }, 0.1)
      .from(firstPhrase ? firstPhrase.children : [], { yPercent: 115, rotation: 8, opacity: 0, duration: 0.9, stagger: 0.035 }, 0.25)
      .from($$('.hs__rest .hs-wi'), { yPercent: 110, rotation: 3, duration: 1.05, stagger: 0.05 }, 0.45)
      .from($$('.hs__desc'), { opacity: 0, y: 24, duration: 0.8 }, 0.95)
      // animate the wrapper: the site Button has `transition: all`, which fights GSAP on the <a> itself
      .from($$('.hs__actions'), { opacity: 0, y: 20, duration: 0.8 }, 1.05)
      .from($$('.hs-console'), { opacity: 0, y: -10, duration: 0.8 }, 0.6)
      .from($$('.hs__foot'), { opacity: 0, duration: 1 }, 1.3)
      .from($$('.hs-chip__pop'), { opacity: 0, y: 26, scale: 0.94, duration: 0.9, stagger: 0.2 }, 2.6);
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
