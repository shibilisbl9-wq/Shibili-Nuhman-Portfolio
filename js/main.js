/* Shibili Nuhman — portfolio engine.
   One blue cursor builds the page: it draws the loader, resizes the portrait on scroll,
   then draws every cell of the grid. All geometry is in grid units (u). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = $('#stage'), intro = $('#intro'), frame = $('#frame'), frameDim = $('#frameDim');
  const cursor = $('#cursor'), loader = $('#loader'), topbar = $('#topbar'), tilesEl = $('#tiles');
  const cellEls = { hello: $('.c-hello'), roles: $('.c-roles'), move: $('.c-move'), meta: $('.c-meta') };

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const eio = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const eo = t => 1 - Math.pow(1 - t, 3);

  // selection ghost (blue outline + handles) for everything the cursor draws
  const GHOST = '<span class="ghost"><i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i></span>';
  $$('.cell,[data-draw]').forEach(el => el.insertAdjacentHTML('beforeend', GHOST));

  /* ------------------------------------------------ geometry */
  const G = { u: 60, cols: 24, rows: 13, W: 0, H: 0, wide: true };
  let F = [], STAGES = [], CELLS = [], REST = [0, 0];

  function measure() {
    G.W = root.clientWidth;
    G.H = stage.clientHeight || innerHeight;
    G.wide = G.W >= 1024;
    G.cols = G.wide ? 24 : 8;
    G.u = G.W / G.cols;
    G.rows = Math.floor(G.H / G.u);
    root.style.setProperty('--u', G.u + 'px');
    root.style.setProperty('--cols', G.cols);
    const s = G.u * 4, c = G.u * 2 + .5;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><path d="M${c - 5.5} ${c}H${c + 5.5}M${c} ${c - 5.5}V${c + 5.5}" stroke="#1e5bff" stroke-width="1.2"/></svg>`;
    root.style.setProperty('--plus', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    layout();
    snapRows();
  }

  function layout() {
    const { u, W, H, rows, wide } = G;
    const R = (x, y, w, h) => ({ x: x * u, y: y * u, w: w * u, h: h * u });
    const F0 = { x: 0, y: 0, w: W, h: H };
    let order;
    if (wide) {
      const PH = clamp(rows - 2, 8, 12), rest = PH - 4;
      F = [F0, R(1, 1, 22, rows - 2), R(8, 1, 15, PH), R(8, 1, 7, PH), R(1, 1, 7, PH)];
      STAGES = [
        { h: 'br', curved: 1, slow: { x: 0, y: 0, w: W - 2.6 * u, h: H - 2.1 * u } },
        { h: 'tl', curved: 0 },
        { h: 'br', curved: 1 },
        { h: 'mv', curved: 0 },
      ];
      CELLS = { hello: R(9, 1, 14, 4), roles: R(9, 5, 6, rest), move: R(15, 5, 8, rest - 2), meta: R(15, 3 + rest, 8, 2) };
      order = ['hello', 'roles', 'move', 'meta'];
      REST = [W - 5 * u, H * .52];
    } else {
      const PH = rows >= 16 ? 5 : rows >= 14 ? 4 : 3, y0 = 1 + PH;
      F = [F0, R(1, 1, 6, rows - 2), R(1, 1, 6, PH + 4), R(1, 1, 6, PH)];
      STAGES = [
        { h: 'br', curved: 1, slow: { x: 0, y: 0, w: W - 1.7 * u, h: H - 2.2 * u } },
        { h: 'bl', curved: 0 },
        { h: 'br', curved: 1 },
      ];
      CELLS = { hello: R(1, y0, 6, 3), roles: R(1, y0 + 3, 6, 3), move: R(1, y0 + 6, 6, Math.max(2, rows - 1 - (y0 + 6))) };
      order = ['hello', 'roles', 'move'];
      REST = [W - 2.6 * u, H * .5];
    }
    CELLS.order = order;
    for (const k of order) {
      const c = CELLS[k], el = cellEls[k];
      Object.assign(el.style, { left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px' });
    }
  }

  // bento cells: snap heights to whole grid rows so every border sits on a grid line
  function snapRows() {
    const bs = $$('.bento .b');
    bs.forEach(b => (b.style.gridRow = 'auto'));
    const need = bs.map(b => Math.ceil((b.scrollHeight + 2) / G.u));
    const max = {};
    bs.forEach((b, i) => { const r = b.dataset.row; max[r] = Math.max(max[r] || 0, need[i]); });
    bs.forEach((b, i) => (b.style.gridRow = 'span ' + (G.wide ? max[b.dataset.row] : need[i])));
  }

  const handlePos = (r, h) =>
    h === 'br' ? [r.x + r.w, r.y + r.h] : h === 'tl' ? [r.x, r.y] : h === 'bl' ? [r.x, r.y + r.h] : [r.x + r.w / 2, r.y + r.h * .74];
  const mix = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

  /* ------------------------------------------------ scroll choreography */
  const SP = .5, C0 = .53, C1 = .95, TR = .22, SNAP = .84;
  let p = 0, live = false, loaderMode = true;
  const Rr = { x: 0, y: 0, w: 0, h: 0, r: 0 };       // rendered frame (smoothed)
  const dR = { hello: 0, roles: 0, move: 0, meta: 0 }; // rendered cell draw progress
  const cur = { x: 0, y: 0 }, LC = { x: 0, y: 0 };

  // where the frame *should* be at progress p — with deliberate jumps at each snap
  function frameAt(p) {
    const n = STAGES.length, seg = SP / n;
    if (p >= SP) return { rect: F[n], r: 0, i: n - 1, t: 1 };
    const i = Math.min(n - 1, Math.floor(p / seg)), t = (p - i * seg) / seg;
    const prev = F[i], next = F[i + 1], st = STAGES[i];
    if (t < TR) return { rect: prev, r: 0, i, t };
    if (t < SNAP) {
      const q = eio((t - TR) / (SNAP - TR));
      const slow = st.slow || mix(prev, next, .34);
      return { rect: mix(prev, slow, q), r: st.curved ? q * G.u * 1.9 : 0, i, t };
    }
    return { rect: next, r: 0, i, t };
  }

  function cellsAt(p) {
    const order = CELLS.order, m = order.length, cp = (p - C0) / (C1 - C0);
    const out = { j: -1, tt: 0, d: {} };
    if (cp <= 0) { order.forEach(k => (out.d[k] = 0)); return out; }
    const j = cp >= 1 ? m - 1 : Math.floor(cp * m), tt = cp >= 1 ? 1 : cp * m - j;
    order.forEach((k, i) => (out.d[k] = i < j ? 1 : i > j ? 0 : tt < .3 ? 0 : eio((tt - .3) / .7)));
    out.j = j; out.tt = tt;
    return out;
  }

  /* role tags + "move" + rolling word */
  const tags = $$('#tagstack .rtag'), mv = $('#mv'), rollEl = $('#roll'), rollIn = $('.roll-in', rollEl);
  let tagTimers = [], mvTimer = 0, rollTimer = 0, rollIdx = 0;
  function rolesOn() { tags.forEach((t, i) => tagTimers.push(setTimeout(() => t.classList.add('in'), 180 + i * 360))); }
  function rolesOff() { tagTimers.forEach(clearTimeout); tagTimers = []; tags.forEach(t => t.classList.remove('in')); }
  function rollTo(i, instant) {
    const words = rollIn.children;
    rollIn.style.transition = instant ? 'none' : '';
    rollIn.style.transform = `translateY(${-i * 1.1}em)`;
    rollEl.style.width = words[i].offsetWidth + 'px';
  }
  function moveOn() {
    setTimeout(() => mv.classList.add('go'), 350);
    mvTimer = setInterval(() => { mv.classList.remove('go'); setTimeout(() => mv.classList.add('go'), 900); }, 5200);
    rollIdx = 0; rollTo(0, true);
    rollTimer = setInterval(() => {
      rollIdx++; rollTo(rollIdx);
      if (rollIdx === rollIn.children.length - 1) setTimeout(() => { rollIdx = 0; rollTo(0, true); }, 760);
    }, 1700);
  }
  function moveOff() { clearInterval(mvTimer); clearInterval(rollTimer); mv.classList.remove('go'); }
  const onDone = { roles: rolesOn, move: moveOn }, onUndone = { roles: rolesOff, move: moveOff };

  /* ------------------------------------------------ flow: cursor draws cells as they enter */
  const queue = []; let busy = false, flowEl = null, flowD = 0;
  const io = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target); queue.push(e.target); pump();
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  const inView = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  const finish = el => { el.style.setProperty('--d', 1); el.classList.remove('drawing'); el.classList.add('done'); };
  function pump() {
    if (busy) return;
    // fast scrollers never wait: anything already off screen, or stuck behind a long queue, just appears
    while (queue.length && (!inView(queue[0]) || queue.length > 3)) finish(queue.shift());
    if (!queue.length) return;
    busy = true;
    const el = queue.shift(), o = { d: 0 };
    flowEl = el; flowD = 0; el.classList.add('drawing');
    gsap.to(o, {
      d: 1, duration: queue.length ? .24 : .5, ease: 'power2.inOut',
      onUpdate() { flowD = o.d; el.style.setProperty('--d', o.d); },
      onComplete() { finish(el); busy = false; pump(); },
    });
  }

  /* ------------------------------------------------ frame loop */
  function tick() {
    requestAnimationFrame(tick);
    const { W, u } = G, vh = innerHeight;
    const sr = stage.getBoundingClientRect(), ir = intro.getBoundingClientRect();
    p = live ? clamp(-ir.top / Math.max(1, ir.height - sr.height)) : 0;

    // frame
    const ft = frameAt(p), k = .17;
    Rr.x = lerp(Rr.x, ft.rect.x, k); Rr.y = lerp(Rr.y, ft.rect.y, k);
    Rr.w = lerp(Rr.w, ft.rect.w, k); Rr.h = lerp(Rr.h, ft.rect.h, k); Rr.r = lerp(Rr.r, ft.r, .2);
    const fs = frame.style;
    fs.left = Rr.x + 'px'; fs.top = Rr.y + 'px'; fs.width = Rr.w + 'px'; fs.height = Rr.h + 'px';
    fs.borderRadius = (Rr.r < .5 ? 0 : Rr.r) + 'px';
    frameDim.textContent = Math.round(Rr.w) + ' × ' + Math.round(Rr.h);
    frame.classList.toggle('sel-on', live && p > .004 && p < SP + .015);
    frame.classList.toggle('placed', p >= SP + .015);
    stage.style.setProperty('--hero', 1 - clamp(p / .045));
    frame.style.setProperty('--shade', 1 - clamp((p - .04) / .2) * .8);

    // cells
    const ct = cellsAt(p);
    for (const key of CELLS.order) {
      const el = cellEls[key], was = dR[key];
      let d = lerp(was, ct.d[key], .22);
      if (Math.abs(d - ct.d[key]) < .004) d = ct.d[key];
      dR[key] = d; el.style.setProperty('--d', d);
      const done = d >= .999, drawing = d > .003 && !done;
      if (done !== el.classList.contains('done')) {
        el.classList.toggle('done', done);
        (done ? onDone : onUndone)[key]?.();
      }
      el.classList.toggle('drawing', drawing);
    }

    // top bar
    topbar.classList.toggle('on-dark', p < .1 && sr.bottom > 0);
    topbar.classList.toggle('solid', ir.bottom < vh * .5);

    // cursor
    let tx, ty, down = false, smooth = .3;
    const flow = flowEl && ir.bottom < vh * .8;
    if (loaderMode) { tx = LC.x; ty = LC.y; smooth = 1; }
    else if (flow) {
      const r = flowEl.getBoundingClientRect();
      tx = r.left + r.width * flowD; ty = r.top + r.height * flowD; down = busy;
    } else {
      const n = STAGES.length;
      if (p < SP) {
        const i = ft.i, t = ft.t, here = handlePos(Rr, STAGES[i].h);
        const from = i === 0 ? REST : handlePos(Rr, STAGES[i - 1].h);
        if (t < TR) { const q = eio(t / TR); tx = lerp(from[0], here[0], q); ty = lerp(from[1], here[1], q); }
        else { [tx, ty] = here; down = t < SNAP; }
      } else if (ct.j < 0) {
        [tx, ty] = handlePos(Rr, STAGES[n - 1].h);
      } else {
        const key = CELLS.order[ct.j], c = CELLS[key];
        const prev = ct.j ? CELLS[CELLS.order[ct.j - 1]] : null;
        const from = prev ? [prev.x + prev.w, prev.y + prev.h] : handlePos(Rr, STAGES[n - 1].h);
        if (ct.tt < .3) { const q = eio(ct.tt / .3); tx = lerp(from[0], c.x, q); ty = lerp(from[1], c.y, q); }
        else { tx = c.x + dR[key] * c.w; ty = c.y + dR[key] * c.h; down = ct.tt < 1; }
      }
      ty += sr.top;
      tx = clamp(tx, 4, W - 16); ty = Math.min(ty, vh - 34);
    }
    cur.x = lerp(cur.x, tx, smooth); cur.y = lerp(cur.y, ty, smooth);
    cursor.style.transform = `translate3d(${cur.x - 2}px,${cur.y - 2}px,0)`;
    cursor.classList.toggle('flip', cur.x > W - 150);
    cursor.classList.toggle('down', down);
  }

  /* ------------------------------------------------ loader */
  const FONTS = [
    ["'Instrument Serif',serif", 'italic', 400, 1.14], ["'Bebas Neue',sans-serif", 'normal', 400, 1.22],
    ["'Syne',sans-serif", 'normal', 800, .62], ["'Playfair Display',serif", 'italic', 700, .9],
    ["'JetBrains Mono',monospace", 'normal', 500, .7], ["'Caveat',cursive", 'normal', 700, 1.2],
    ["'Fraunces',serif", 'normal', 300, .92], ["'Space Grotesk',sans-serif", 'normal', 700, .86],
    ["'Inter Tight',sans-serif", 'normal', 700, .96],
  ];

  function ready() {
    const img = $('#portrait');
    const all = Promise.all([
      document.fonts ? document.fonts.ready : 0,
      img.decode ? img.decode().catch(() => 0) : 0,
      new Promise(r => (document.readyState === 'complete' ? r() : addEventListener('load', r))),
    ]);
    return Promise.race([all, new Promise(r => setTimeout(r, 6000))]);
  }

  function runLoader() {
    const { u, W, H, cols, rows, wide } = G;
    root.classList.add('is-loading');
    tilesEl.innerHTML = '<i></i>'.repeat(cols * (rows + 1));
    const selA = $('#selA'), selB = $('#selB'), tA = $('.txt', selA), tB = $('.txt', selB);
    const cx = Math.round(cols / 2), cy = Math.round(rows / 2);
    const c = wide ? { ax: cx - 6, ay: cy - 3, w1: 4, w2: 9, hA: 2, wB: 12, hB: 4, fs: 1.5 }
                   : { ax: 1, ay: cy - 3, w1: 3, w2: 5, hA: 2, wB: 6, hB: 3, fs: .98 };
    const P = { aw: 0, ah: 0, bw: 0, bh: 0 };
    selA.style.left = selB.style.left = c.ax * u + 'px';
    selA.style.top = c.ay * u + 'px'; selB.style.top = (c.ay + c.hA) * u + 'px';
    tB.style.opacity = 0;
    if (!wide) tB.innerHTML = 'visual<br>designer';
    const upd = () => {
      for (const [el, w, h] of [[selA, Math.round(P.aw), Math.round(P.ah)], [selB, Math.round(P.bw), Math.round(P.bh)]]) {
        el.style.width = w * u + 'px'; el.style.height = h * u + 'px';
        el.style.visibility = w > 0 && h > 0 ? 'visible' : 'hidden';
        $('.dim', el).textContent = Math.round(w * u) + ' × ' + Math.round(h * u);
      }
    };
    const type = (el, from, to) => { let i = from.length; const t = setInterval(() => { el.textContent = to.slice(0, ++i); if (i >= to.length) clearInterval(t); }, 45); };
    const down = () => cursor.classList.add('down'), up = () => cursor.classList.remove('down');

    let cyc = 0, ci = 0;
    const setFont = i => { const f = FONTS[i % FONTS.length]; Object.assign(tB.style, { fontFamily: f[0], fontStyle: f[1], fontWeight: f[2], fontSize: `calc(var(--u)*${c.fs * f[3]})` }); };
    const startCycle = () => { tB.style.opacity = 1; setFont(ci); cyc = setInterval(() => setFont(++ci), 150); };

    let exited = false;
    const exit = () => {
      if (exited) return; exited = true;
      clearInterval(cyc); setFont(0); up();
      try { sessionStorage.setItem('sn-seen', '1'); } catch (e) {}
      gsap.timeline()
        .to(LC, { x: REST[0], y: REST[1], duration: .9, ease: 'power3.inOut' }, .15)
        .to([selA, selB], { opacity: 0, scale: .985, duration: .35, stagger: .07, ease: 'power2.in' }, .25)
        .to(loader, { opacity: 0, duration: .55, ease: 'power1.out' }, .45)
        .to(tilesEl.children, { opacity: 0, duration: .45, ease: 'power1.out', stagger: { amount: 1.05, from: 'random' } }, .5)
        .from('.hero-ui > *', { autoAlpha: 0, y: 24, duration: .9, ease: 'power3.out', stagger: .09 }, 1.2)
        .call(() => { loader.remove(); root.classList.remove('is-loading'); cur.x = LC.x; cur.y = LC.y; loaderMode = false; live = true; }, null, 1.25)
        .call(() => tilesEl.remove(), null, 2.2);
    };
    $('#skip').addEventListener('click', () => { tl.kill(); ready().then(exit); });

    LC.x = W * .8; LC.y = H + 30; cur.x = LC.x; cur.y = LC.y;
    cursor.classList.add('on');
    let seen = false; try { seen = sessionStorage.getItem('sn-seen'); } catch (e) {}
    const tl = gsap.timeline();
    if (seen) { // repeat visit in the same session: don't make anyone sit through it twice
      tl.to(LC, { x: REST[0], y: REST[1], duration: .5, ease: 'power3.out' }).call(() => ready().then(exit));
      return;
    }
    tl.to(LC, { x: c.ax * u, y: c.ay * u, duration: .85, ease: 'power3.out' }, .25)
      .call(down)
      .to(LC, { x: (c.ax + c.w1) * u, y: (c.ay + c.hA) * u, duration: .55, ease: 'power2.inOut', onUpdate() { P.aw = LC.x / u - c.ax; P.ah = LC.y / u - c.ay; upd(); } }, '+=.08')
      .call(up).call(() => type(tA, '', 'meet'))
      .to(LC, { x: (c.ax + c.w1) * u, y: c.ay * u, duration: .32, ease: 'power2.inOut' }, '+=.28')
      .call(down)
      .to(LC, { x: (c.ax + c.w2) * u, duration: .5, ease: 'power2.inOut', onUpdate() { P.aw = LC.x / u - c.ax; upd(); } }, '+=.06')
      .call(up).call(() => type(tA, 'meet', 'meet our'))
      .to(LC, { x: c.ax * u, y: (c.ay + c.hA) * u, duration: .42, ease: 'power2.inOut' }, '+=.3')
      .call(down)
      .to(LC, { x: (c.ax + c.wB) * u, y: (c.ay + c.hA + c.hB) * u, duration: .75, ease: 'power2.inOut', onUpdate() { P.bw = LC.x / u - c.ax; P.bh = LC.y / u - c.ay - c.hA; upd(); } }, '+=.06')
      .call(up).call(startCycle)
      .to({}, { duration: 1.25 })
      .call(() => ready().then(exit));
  }

  /* ------------------------------------------------ boot */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function boot() {
    measure();
    Object.assign(Rr, F[0], { r: 0 });
    if (RM || !window.gsap) {
      // static: final layout, everything visible
      intro.style.height = 'auto';
      Object.assign(Rr, F[F.length - 1]);
      Object.assign(frame.style, { left: Rr.x + 'px', top: Rr.y + 'px', width: Rr.w + 'px', height: Rr.h + 'px' });
      frame.classList.add('placed'); stage.style.setProperty('--hero', 0); frame.style.setProperty('--shade', .2);
      $$('.cell,[data-draw]').forEach(el => el.classList.add('done'));
      tags.forEach(t => t.classList.add('in')); mv.classList.add('go'); rollTo(0, true);
      loader.remove(); tilesEl.remove();
      return;
    }
    scrollTo(0, 0);
    $$('[data-draw]').forEach(el => io ? io.observe(el) : el.classList.add('done'));
    runLoader();
    requestAnimationFrame(tick);
  }

  let rz = 0, lastW = root.clientWidth;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      // mobile browsers fire resize when the URL bar hides; only re-lay-out on real width changes
      if (root.clientWidth === lastW && !G.wide) return;
      lastW = root.clientWidth; measure();
    }, 120);
  });
  if (document.fonts) document.fonts.ready.then(() => { snapRows(); rollTo(rollIdx, true); });

  // reel: play when it is on screen, pause when it is not
  const rv = $('#reelVideo');
  if (rv && !RM && 'IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) rv.play().catch(() => {}); else rv.pause();
  }), { threshold: .5 }).observe(rv);

  boot();
})();
