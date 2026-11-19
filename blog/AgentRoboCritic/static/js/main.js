/* AgentRoboCritic project page: table of contents, rollout videos, figures and charts. No dependencies. */
(function () {
  'use strict';

  var ARC = window.ARC;
  var PAL = ARC.palette;
  var CH = PAL.chart;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var FIGFONT = 'Tinos, "Times New Roman", Times, serif';

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'style') Object.keys(v).forEach(function (p) { node.style.setProperty(p, v[p]); });
      else node.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      node.append(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return node;
  }
  function sv(tag, attrs, text) {
    var node = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] != null) node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
  }
  function icon(id) {
    var s = sv('svg', { class: 'i', 'aria-hidden': 'true' });
    s.appendChild(sv('use', { href: '#i-' + id }));
    return s;
  }
  function fmt(n, d) { return Number(n).toFixed(d == null ? 1 : d); }
  function within(x) { return x === 'end' ? 'by the end of the episode' : 'within ' + x + (x === 1 ? ' action' : ' actions'); }

  /* ================================================================ table of contents */
  function initToc() {
    var toc = $('#toc');
    if (!toc) return;
    var links = $$('a', toc);
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var manual = new Set(), collapsed = new Set(), pinned = null, lastSub = null, lastActive = null;
    $$('.toc-toggle', toc).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.closest('.has-sub');
        var open = !li.classList.contains('is-open');
        li.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        if (open) { manual.add(li); collapsed.delete(li); } else { manual.delete(li); collapsed.add(li); }
      });
    });
    links.forEach(function (a, i) { a.addEventListener('click', function () { pinned = i; setTimeout(update, 0); }); });
    ['wheel', 'touchmove', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { pinned = null; }, { passive: true }); });
    function update() {
      var line = Math.min(120, window.innerHeight * 0.2);
      var idx = 0;
      targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) idx = i; });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) idx = targets.length - 1;
      if (pinned !== null) idx = pinned;
      links.forEach(function (a) { a.classList.remove('is-active', 'is-current'); });
      var a = links[idx];
      if (!a) return;
      a.classList.add('is-active');
      var sub = a.closest('.has-sub');
      if (sub !== lastSub) { collapsed.clear(); lastSub = sub; }
      $$('.has-sub', toc).forEach(function (li) {
        var open = (li === sub && !collapsed.has(li)) || manual.has(li);
        li.classList.toggle('is-open', open);
        $('.toc-toggle', li).setAttribute('aria-expanded', String(open));
      });
      if (sub) {
        var parent = $('.toc-row > a', sub);
        if (parent !== a) parent.classList.add('is-current');
      }
      /* narrow screens: the contents become a horizontal bar; keep the active entry in view */
      if (a !== lastActive) {
        lastActive = a;
        if (toc.scrollWidth > toc.clientWidth + 2) {
          var vis = a.offsetWidth ? a : (sub ? $('.toc-row > a', sub) : a);
          var r = vis.getBoundingClientRect(), tr = toc.getBoundingClientRect();
          var delta = (r.left + r.width / 2) - (tr.left + tr.width / 2);
          if (Math.abs(delta) > 4) toc.scrollBy({ left: delta, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initPendingLinks() {
    $$('a.is-pending').forEach(function (a) {
      a.setAttribute('aria-disabled', 'true');
      a.setAttribute('title', 'Coming soon');
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });
  }

  /* ================================================================ videos */
  function safePlay(v) { try { var p = v.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  function warm(v) { if (v.preload !== 'auto') v.preload = 'auto'; }

  /* A group plays and pauses together: the teaser tiles, or a paired rollout. */
  function makeGroup(videos, opts) {
    var g = {
      videos: videos, userPaused: false, sync: !!(opts && opts.sync), started: false,
      visible: function () { return videos.some(function (v) { return v._vis; }); },
      pause: function () { videos.forEach(function (v) { v.pause(); }); },
      play: function () {
        if (g.sync && (!g.started || videos.every(function (v) { return v.ended; }))) return g.start();
        videos.forEach(function (v) { if (!v.ended) { warm(v); safePlay(v); } });
      },
      start: function () {
        videos.forEach(warm);
        Promise.all(videos.map(waitCanPlay)).then(function () {
          if (g.userPaused || !g.visible()) return;
          g.started = true;
          videos.forEach(function (v) { try { v.currentTime = 0; } catch (e) {} });
          videos.forEach(safePlay);
        });
      },
      onVisibility: function () {
        if (!g.visible()) { g.pause(); return; }
        if (!reduceMotion && !g.userPaused) g.play();
      }
    };
    videos.forEach(function (v) {
      v._group = g;
      if (g.sync) {
        v.addEventListener('ended', function () {
          if (videos.every(function (x) { return x.ended; }) && g.visible() && !g.userPaused && !reduceMotion) setTimeout(g.start, 900);
        });
      }
    });
    if (g.sync) {
      videos.forEach(function (v) {
        v.addEventListener('timeupdate', function () {
          var longest = videos.slice().sort(function (a, b) { return (b.duration || 0) - (a.duration || 0); })[0];
          if (v !== longest || v.paused) return;
          videos.forEach(function (o) {
            if (o === v || o.paused || o.ended || !o.duration) return;
            if (o.duration > v.currentTime && Math.abs(o.currentTime - v.currentTime) > 0.3) o.currentTime = v.currentTime;
          });
        });
      });
    }
    return g;
  }
  function waitCanPlay(v) {
    return new Promise(function (resolve) {
      if (v.readyState >= 3) return resolve();
      v.addEventListener('canplay', function () { resolve(); }, { once: true });
      setTimeout(resolve, 5000);
    });
  }
  function toggle(v) {
    var g = v._group;
    if (g) {
      if (g.videos.some(function (x) { return !x.paused && !x.ended; })) { g.userPaused = true; g.pause(); }
      else { g.userPaused = false; g.play(); }
      return;
    }
    if (v.paused) { v._userPaused = false; warm(v); safePlay(v); }
    else { v._userPaused = true; v.pause(); }
  }
  function addToggle(wrap, video) {
    var btn = el('button', { class: 'vid-toggle', type: 'button', 'aria-label': 'Pause video' }, icon('pause'));
    wrap.appendChild(btn);
    function sync() {
      var playing = !video.paused && !video.ended;
      btn.replaceChildren(icon(playing ? 'pause' : 'play'));
      btn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
      wrap.classList.toggle('is-paused', !playing);
    }
    ['play', 'pause', 'ended'].forEach(function (e) { video.addEventListener(e, sync); });
    sync();
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(video); });
  }
  function initAutoplay() {
    var vids = $$('video');
    if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { v.setAttribute('controls', ''); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        v._vis = e.isIntersecting && e.intersectionRatio >= 0.15;
        if (v._group) { v._group.onVisibility(); return; }
        if (v._vis) { warm(v); if (!reduceMotion && !v._userPaused) safePlay(v); }
        else if (!v.paused) v.pause();
      });
    }, { threshold: [0, 0.15, 0.5] });
    vids.forEach(function (v) { io.observe(v); });
  }
  function videoEl(src, poster, label, loop) {
    var v = el('video', { src: src, poster: poster, muted: true, playsinline: true, loop: loop !== false, preload: 'none', 'aria-label': label });
    v.muted = true;
    v.defaultMuted = true;
    return v;
  }

  /* ================================================================ paper figures with video slots */
  function slotBox(s, W, H) {
    var v = videoEl(s.src, s.poster, s.label);
    var box = el('div', { class: 'slot', style: {
      left: (s.x / W * 100) + '%', top: (s.y / H * 100) + '%',
      width: (s.w / W * 100) + '%', height: (s.h / H * 100) + '%' } }, v);
    return { v: v, box: box };
  }
  /* one "Pause clips" control in the caption of a figure whose photos are rollout loops */
  function clipsToggle(figure, vids) {
    var cap = figure && $('figcaption', figure);
    if (!cap || !vids.length) return;
    var btn = el('button', { class: 'clips-toggle', type: 'button' });
    function sync() {
      var playing = vids.some(function (v) { return !v.paused && !v.ended; });
      btn.replaceChildren(icon(playing ? 'pause' : 'play'), document.createTextNode(playing ? 'Pause clips' : 'Play clips'));
    }
    vids.forEach(function (v) { v.addEventListener('play', sync); v.addEventListener('pause', sync); });
    sync();
    btn.addEventListener('click', function () { toggle(vids[0]); });
    cap.insertBefore(btn, cap.firstChild);
  }
  function buildSlots(container, slots, W, H) {
    if (!container) return null;
    var vids = [];
    slots.forEach(function (s) { var o = slotBox(s, W, H); container.appendChild(o.box); vids.push(o.v); });
    var g = makeGroup(vids);
    container.addEventListener('click', function () { if (vids[0]) toggle(vids[0]); });
    container.style.cursor = 'pointer';
    container.title = 'Click to pause or play the rollout clips';
    clipsToggle(container.closest('figure'), vids);
    return g;
  }
  /* Teaser: each of the three panels becomes a link to the section that discusses it. A panel is a window
   * onto the full paper figure (its own copy of the vector layers and its rollout clips), so it can be
   * enlarged on hover without touching the other two. */
  function buildTeaser(pf) {
    if (!pf || !ARC.teaserPanels) return;
    var W = 495, H = 129.5, layers = $$('img.layer', pf), vids = [];
    ARC.teaserPanels.forEach(function (p, k) {
      var slots = el('div', { class: 'slots' });
      ARC.teaserSlots.forEach(function (s) {
        var cx = s.x + s.w / 2, cy = s.y + s.h / 2;
        if (cx >= p.x && cx <= p.x + p.w && cy >= p.y && cy <= p.y + p.h) {
          var o = slotBox(s, W, H);
          slots.appendChild(o.box);
          vids.push(o.v);
        }
      });
      var canvas = el('div', { class: 'tp-canvas', style: {
          width: (W / p.w * 100) + '%', height: (H / p.h * 100) + '%',
          left: (-p.x / p.w * 100) + '%', top: (-p.y / p.h * 100) + '%' } },
        el('img', { class: 'layer', src: layers[0].getAttribute('src'), alt: '' }),
        slots,
        el('img', { class: 'layer', src: layers[1].getAttribute('src'), alt: '' }));
      var r = p.r || 3.4;
      pf.appendChild(el('a', { class: 'tpanel tpanel--' + 'abc'.charAt(k), href: p.href, title: p.title, 'aria-label': p.label, style: {
        left: (p.x / W * 100) + '%', top: (p.y / H * 100) + '%', width: (p.w / W * 100) + '%', height: (p.h / H * 100) + '%',
        'border-radius': (r / p.w * 100) + '% / ' + (r / p.h * 100) + '%' } }, canvas));
    });
    pf.classList.add('is-split');
    pf.removeAttribute('role');
    pf.removeAttribute('aria-label');
    makeGroup(vids);
    clipsToggle(pf.closest('figure'), vids);
  }

  /* ================================================================ Figure 3 */
  function buildFig3(root) {
    if (!root) return;
    ARC.fig3.forEach(function (m) {
      var c = PAL.fig3tags[m.id] || {};
      var head = el('div', { class: 'fm-head' },
        el('span', { class: 'fm-tag', style: { background: c.bg, color: c.fg } }, m.tag),
        el('span', null, m.desc));
      var wrap = el('div', { class: 'vid vid--fig', style: { '--ar': m.ar } }, videoEl(m.src, m.poster, m.tag + ' failure. Local intent: ' + m.intent));
      addToggle(wrap, $('video', wrap));
      var steps = el('div', { class: 'fm-steps' });
      m.steps.forEach(function (s) { steps.appendChild(el('span', null, s)); });
      root.appendChild(el('div', { class: 'fm-item' }, head, wrap, steps, el('div', { class: 'fm-intent' }, 'Local Intent: ' + m.intent)));
    });
  }

  /* ================================================================ Figure 6 */
  /* Figure 6: four rollouts in a row, GPT-6 Astra on the left and pi0.5 on the right, each pair in its own box;
   * the two rollouts of the same task play in sync */
  function buildFig6(root) {
    if (!root) return;
    var F = ARC.fig6, C = PAL.fig6;
    var row = el('div', { class: 'fig6-groups' });
    var pairs = F.tasks.map(function () { return []; });
    [['astra', 'fig6-group--astra'], ['base', 'fig6-group--base']].forEach(function (g) {
      var title = g[0] === 'astra' ? el('p', { class: 'fig6-group-title' }, 'GPT-6 Astra')
        : el('p', { class: 'fig6-group-title' }, 'π', el('sub', null, '0.5'));
      var cols = el('div', { class: 'fig6-cols' });
      F.tasks.forEach(function (t, ti) {
        var d = t[g[0]];
        var who = g[0] === 'astra' ? 'GPT-6 Astra' : 'pi 0.5';
        var v = videoEl(d.src, d.poster, who + ', ' + t.title + ' (' + t.bench + '), full episode', false);
        var wrap = el('div', { class: 'vid vid--fig', style: { '--ar': t.ar } }, v,
          el('span', { class: 'corner', style: { background: d.ok ? C.success : C.fail } }, (d.ok ? '✓ ' : '✗ ') + d.badge));
        addToggle(wrap, v);
        pairs[ti].push(v);
        var steps = el('div', { class: 'fig6-steps' });
        d.steps.forEach(function (s) {
          steps.appendChild(s.indexOf('↻') === 0 ? el('span', { class: 'replan', style: { color: C.replan } }, s) : el('span', null, s));
        });
        cols.appendChild(el('div', { class: 'fig6-cell' },
          el('p', { class: 'fig6-task' }, el('b', null, t.title), el('span', null, t.bench + ' · ' + d.rate + '% success')),
          wrap, steps));
      });
      row.appendChild(el('div', { class: 'fig6-group ' + g[1] }, title, cols));
    });
    pairs.forEach(function (p) { makeGroup(p, { sync: true }); });
    root.appendChild(row);
  }

  /* ================================================================ benchmark cover strip */
  /* Carousel: three copies of the cards give an endless loop; the middle copy is the real one. Native
   * horizontal scrolling (swipe, trackpad) with scroll snapping, arrows, dots and a slow automatic advance. */
  function buildCovers(root) {
    var C = ARC.covers;
    if (!root || !C || !C.length) return;
    var n = C.length, cards = [];
    var track = el('div', { class: 'bc-track' });
    for (var copy = 0; copy < 3; copy++) {
      C.forEach(function (c, i) {
        var real = copy === 1;
        var card = el('a', { class: 'bench-card', href: c.url, target: '_blank', rel: 'noopener', title: c.name,
            'aria-hidden': real ? null : 'true', tabindex: real ? null : '-1', 'aria-label': real ? c.name + ' (project page)' : null },
          el('img', { src: c.img, alt: '', width: c.w, height: c.h, loading: real ? 'eager' : 'lazy', decoding: 'async', draggable: 'false' }),
          el('span', { class: 'bench-band', 'aria-hidden': 'true' }, c.name));
        track.appendChild(card);
        cards.push(card);
      });
    }
    var viewport = el('div', { class: 'bc-viewport' }, track);
    var prev = el('button', { class: 'bc-arrow bc-prev', type: 'button', 'aria-label': 'Previous benchmark' }, icon('chev'));
    var next = el('button', { class: 'bc-arrow bc-next', type: 'button', 'aria-label': 'Next benchmark' }, icon('chev'));
    var dots = el('div', { class: 'bc-dots', role: 'group', 'aria-label': 'Choose a benchmark' });
    var dotBtns = C.map(function (c, i) {
      var b = el('button', { class: 'bc-dot', type: 'button', 'aria-label': c.name });
      b.addEventListener('click', function () { hold(); go(n + i, true); });
      dots.appendChild(b);
      return b;
    });
    root.append(el('div', { class: 'bc-stage' }, prev, viewport, next), dots);
    track.addEventListener('focusin', function (e) {
      var k = cards.indexOf(e.target.closest('.bench-card'));
      if (k >= n && k < 2 * n) { hold(); go(k, false); }
    });

    function step() { return cards[1].offsetLeft - cards[0].offsetLeft; }
    function raw() { return Math.round(viewport.scrollLeft / step()); }
    function go(i, smooth) { viewport.scrollTo({ left: i * step(), behavior: smooth && !reduceMotion ? 'smooth' : 'auto' }); }
    function mark() {
      var cur = ((raw() % n) + n) % n;
      dotBtns.forEach(function (b, k) { b.classList.toggle('is-on', k === cur); b.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    }
    /* after scrolling settles, jump silently from a clone back into the middle copy */
    var settle;
    viewport.addEventListener('scroll', function () {
      mark();
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = raw();
        if (i < n || i >= 2 * n) go(((i % n) + n) % n + n, false);
      }, 160);
    }, { passive: true });
    prev.addEventListener('click', function () { hold(); go(raw() - 1, true); });
    next.addEventListener('click', function () { hold(); go(raw() + 1, true); });
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });

    /* automatic advance: every 2.5 s while visible; pauses on hover and focus and for 8 s after any user action */
    var hovering = false, until = 0, visible = false;
    function hold() { until = Date.now() + 8000; }
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { viewport.addEventListener(ev, hold, { passive: true }); });
    root.addEventListener('mouseenter', function () { hovering = true; });
    root.addEventListener('mouseleave', function () { hovering = false; });
    root.addEventListener('focusin', function () { hovering = true; });
    root.addEventListener('focusout', function () { hovering = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.3 }).observe(viewport);
    if (!reduceMotion) setInterval(function () {
      if (visible && !hovering && !document.hidden && Date.now() > until) go(raw() + 1, true);
    }, 2500);

    function home() { go(n + (((raw() % n) + n) % n), false); mark(); }
    requestAnimationFrame(function () { go(n, false); mark(); });
    window.addEventListener('resize', home);
  }

  /* ================================================================ tooltip */
  var tipEl = $('#tip');
  function showTip(evt, title, rows) {
    tipEl.replaceChildren();
    if (title) tipEl.appendChild(el('div', { class: 'tip-t' }, title));
    rows.forEach(function (r) {
      tipEl.appendChild(el('div', { class: 'tip-r' }, r.color ? el('i', { style: { background: r.color } }) : null, el('b', null, r.value), r.label ? el('span', null, r.label) : null));
    });
    tipEl.hidden = false;
    var x, y;
    if (evt.clientX != null && evt.type !== 'focus') { x = evt.clientX + 14; y = evt.clientY + 16; }
    else { var rc = evt.target.getBoundingClientRect(); x = rc.left + rc.width / 2; y = rc.bottom + 8; }
    var tw = tipEl.offsetWidth, th = tipEl.offsetHeight;
    if (x + tw > innerWidth - 8) x = Math.max(8, x - tw - 24);
    if (y + th > innerHeight - 8) y = Math.max(8, y - th - 28);
    tipEl.style.left = x + 'px';
    tipEl.style.top = y + 'px';
  }
  function hideTip() { tipEl.hidden = true; }
  function tip(node, fn, focusable) {
    node.setAttribute('tabindex', focusable ? '0' : '-1');
    node.addEventListener('pointermove', function (e) { var c = fn(); showTip(e, c[0], c[1]); });
    node.addEventListener('pointerleave', hideTip);
    node.addEventListener('focus', function (e) { var c = fn(); showTip(e, c[0], c[1]); });
    node.addEventListener('blur', hideTip);
  }
  window.addEventListener('scroll', hideTip, { passive: true });

  /* ================================================================ chart helpers (matplotlib style of the paper) */
  function svgRoot(W, H, label) {
    return sv('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': label, 'font-family': FIGFONT });
  }
  function text(s, x, y, str, o) {
    o = o || {};
    var t = sv('text', { x: x, y: y, 'text-anchor': o.anchor || 'start', 'font-size': o.size || 13, fill: o.fill || CH.axisLabel, 'font-weight': o.weight, 'font-style': o.style, transform: o.transform, 'font-variant': o.variant, 'pointer-events': 'none' }, str);
    s.appendChild(t);
    return t;
  }
  function line(s, x1, y1, x2, y2, o) {
    o = o || {};
    var l = sv('line', { x1: x1, y1: y1, x2: x2, y2: y2, stroke: o.stroke || CH.spine, 'stroke-width': o.width || 1, 'stroke-dasharray': o.dash, 'stroke-linecap': o.cap || 'butt', 'stroke-opacity': o.opacity });
    s.appendChild(l);
    return l;
  }
  function rect(s, x, y, w, h, fill, o) {
    o = o || {};
    var r = sv('rect', { x: x, y: y, width: Math.max(0, w), height: Math.max(0, h), fill: fill, 'fill-opacity': o.opacity, stroke: o.stroke, 'stroke-width': o.sw });
    s.appendChild(r);
    return r;
  }
  function responsive(root, draw) {
    if (!root) return;
    var last = 0;
    function run() { var w = root.clientWidth; if (w && w !== last) { last = w; root.replaceChildren(); draw(w); } }
    run();
    if ('ResizeObserver' in window) new ResizeObserver(run).observe(root);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { last = 0; run(); });
  }
  function marker(s, shape, x, y, size, fill, edge) {
    var r = size / 2, n;
    if (shape === 'square') n = sv('rect', { x: x - r, y: y - r, width: size, height: size });
    else if (shape === 'diamond') n = sv('path', { d: 'M' + x + ' ' + (y - r * 1.35) + 'L' + (x + r * 1.35) + ' ' + y + 'L' + x + ' ' + (y + r * 1.35) + 'L' + (x - r * 1.35) + ' ' + y + 'Z' });
    else if (shape === 'triangle') n = sv('path', { d: 'M' + x + ' ' + (y - r * 1.15) + 'L' + (x + r * 1.15) + ' ' + (y + r * 0.85) + 'L' + (x - r * 1.15) + ' ' + (y + r * 0.85) + 'Z' });
    else if (shape === 'triangle-down') n = sv('path', { d: 'M' + x + ' ' + (y + r * 1.15) + 'L' + (x + r * 1.15) + ' ' + (y - r * 0.85) + 'L' + (x - r * 1.15) + ' ' + (y - r * 0.85) + 'Z' });
    else n = sv('circle', { cx: x, cy: y, r: r });
    n.setAttribute('fill', fill);
    if (edge) { n.setAttribute('stroke', edge); n.setAttribute('stroke-width', 1); }
    s.appendChild(n);
    return n;
  }
  function panelTitle(s, W, str) { text(s, W / 2, 16, str, { anchor: 'middle', size: 15, weight: 700, fill: CH.title }); }
  function gridline(s, x1, y1, x2, y2) { return line(s, x1, y1, x2, y2, { stroke: CH.grid, opacity: CH.gridOpacity }); }
  /* left/bottom spines, outward ticks, horizontal gridlines */
  function axesY(s, W, H, m, yMin, yMax, ticks, label, o) {
    o = o || {};
    var ink = o.ink;
    var Y = function (v) { return m.t + (H - m.t - m.b) * (1 - (v - yMin) / (yMax - yMin)); };
    ticks.forEach(function (t) {
      if (o.grid !== false) gridline(s, m.l, Y(t), W - m.r, Y(t));
      line(s, m.l - 4, Y(t), m.l, Y(t), { stroke: ink || CH.tick });
      text(s, m.l - 7, Y(t) + 4.5, String(t), { anchor: 'end', size: o.tickSize || 12.5, fill: ink || CH.tick });
    });
    line(s, m.l, m.t, m.l, H - m.b, { stroke: ink || CH.spine, width: 1.1 });
    line(s, m.l, H - m.b, W - m.r, H - m.b, { stroke: ink || CH.spine, width: 1.1 });
    text(s, 0, 0, label, { anchor: 'middle', size: o.labelSize || 13, fill: ink, transform: 'translate(13 ' + ((m.t + H - m.b) / 2) + ') rotate(-90)' });
    return Y;
  }
  function errbar(s, x, y1, y2, color, o) {
    o = o || {};
    var cap = o.cap || 3.5;
    line(s, x, y1, x, y2, { stroke: color, width: o.width || 1.1, opacity: o.opacity });
    line(s, x - cap, y1, x + cap, y1, { stroke: color, width: o.width || 1.1, opacity: o.opacity });
    line(s, x - cap, y2, x + cap, y2, { stroke: color, width: o.width || 1.1, opacity: o.opacity });
  }
  function polyline(s, pts, color, width, dash) {
    return s.appendChild(sv('polyline', { points: pts.map(function (p) { return p.join(','); }).join(' '), fill: 'none', stroke: color, 'stroke-width': width || 1.9, 'stroke-dasharray': dash || null, 'stroke-linejoin': 'round' }));
  }
  /* a point that grows on hover: transparent hit area, marker, optional label in one group */
  function pointGroup(s, cx, cy) {
    var g = sv('g', { class: 'pt-g' });
    g.appendChild(sv('circle', { cx: cx, cy: cy, r: 14, fill: 'transparent' }));
    s.appendChild(g);
    g.addEventListener('pointerenter', function () {
      if (g.parentNode && g.nextSibling) g.parentNode.appendChild(g);
      g.classList.add('is-hot');
    });
    g.addEventListener('pointerleave', function () { g.classList.remove('is-hot'); });
    return g;
  }
  function hoverMarker(s, shape, cx, cy, size, fill, edge) {
    var g = pointGroup(s, cx, cy);
    marker(g, shape, cx, cy, size, fill, edge).classList.add('pt');
    return g;
  }
  /* grow an svg to fit labels drawn outside its box (rotated tick labels) */
  function fitSvg(s, W, H) {
    try {
      var bb = s.getBBox(), x0 = Math.min(0, Math.floor(bb.x) - 2), h = Math.max(H, Math.ceil(bb.y + bb.height) + 6), w = W - x0;
      s.setAttribute('viewBox', x0 + ' 0 ' + w + ' ' + h);
      s.setAttribute('height', Math.round(h * W / w));
    } catch (e) {}
  }
  /* x positions for the paper's log axis 1..100 with a break before 'end' */
  function logX(xs, m, W) {
    var plotW = W - m.l - m.r, lo = Math.log10(0.72), hi = Math.log10(370);
    return function (i) {
      var v = typeof xs[i] === 'number' ? xs[i] : 320;
      return m.l + plotW * (Math.log10(v) - lo) / (hi - lo);
    };
  }
  function axisBreak(s, x, y) {
    line(s, x - 3, y, x + 3, y, { stroke: '#ffffff', width: 3 });
    line(s, x - 5, y + 5, x - 1, y - 5, { stroke: CH.spine });
    line(s, x + 1, y + 5, x + 5, y - 5, { stroke: CH.spine });
  }

  /* ================================================================ Figure 4: failure modes per benchmark */
  var MODES = ['grasp', 'alignment', 'interference', 'effect', 'incomplete', 'choice', 'unresolved'];
  var MODE_NAMES = { grasp: 'Grasp', alignment: 'Alignment', interference: 'Interference', effect: 'Effect', incomplete: 'Incomplete motion', choice: 'Choice', unresolved: 'Unresolved' };
  function num(v) { return v === '<1' ? 0.5 : (v == null ? 0 : v); }
  function pct(v) { return v === '<1' ? '<1%' : (v == null ? 'not assessed' : v + '%'); }

  function fig4(root) {
    if (!root) return;
    var selected = null, F4 = PAL.fig4;
    var legend = el('div', { class: 'chart-legend', role: 'group', 'aria-label': 'Failure modes; select one to sort the benchmarks by it' });
    var buttons = MODES.map(function (id) {
      var b = el('button', { type: 'button', 'aria-pressed': 'false' }, el('i', { style: { background: PAL.modes[id] } }), MODE_NAMES[id]);
      b.addEventListener('click', function () {
        selected = selected === id ? null : id;
        buttons.forEach(function (x, i) { x.setAttribute('aria-pressed', String(MODES[i] === selected)); });
        draw();
      });
      legend.appendChild(b);
      return b;
    });
    var area = el('div');
    root.append(legend, area);
    var lastW = 0;
    function draw() {
      var W = area.clientWidth || root.clientWidth;
      lastW = W;
      var narrow = W < 560;
      /* label column as wide as the longest benchmark name, so the bars use the rest */
      var ctx = fig4.ctx || (fig4.ctx = document.createElement('canvas').getContext('2d'));
      ctx.font = '14px ' + FIGFONT;
      var longest = Math.max.apply(null, ARC.mechanisms.map(function (d) { return ctx.measureText(d.name + (d.mark || '')).width; }));
      var labelW = narrow ? 0 : Math.ceil(longest) + 2;
      var rowH = narrow ? 34 : 26, barH = narrow ? 15 : 18, top = 4, axisH = 26;
      legend.style.paddingLeft = narrow ? '' : (labelW + 10) + 'px';
      var rows = ARC.mechanisms.slice().sort(function (a, b) {
        var k = selected || 'grasp';
        return num(b.v[k]) - num(a.v[k]) || a.name.localeCompare(b.name);
      });
      var H = top + rows.length * rowH + axisH, base = top + rows.length * rowH;
      var x0 = labelW + (narrow ? 0 : 10), x1 = W - 6, bw = x1 - x0;
      var s = svgRoot(W, H, 'Stacked bar chart of failure modes per benchmark');
      [0, 25, 50, 75, 100].forEach(function (t) {
        var x = x0 + bw * t / 100;
        line(s, x, base, x, base + 4, { stroke: F4.axis });
        text(s, x, base + 18, t + '%', { anchor: t === 0 ? 'start' : (t === 100 ? 'end' : 'middle'), size: 12.5, fill: F4.tick });
      });
      line(s, x0, base, x1, base, { stroke: F4.axis });
      rows.forEach(function (d, i) {
        var yRow = top + i * rowH;
        var yBar = narrow ? yRow + 16 : yRow + (rowH - barH) / 2;
        var lt = narrow ? text(s, x0, yRow + 11, d.name, { size: 12.5, fill: F4.label })
          : text(s, labelW, yBar + barH / 2 + 4.8, d.name, { anchor: 'end', size: 14, fill: F4.label });
        if (d.mark) lt.appendChild(sv('tspan', { 'baseline-shift': 'super', 'font-size': '70%' }, d.mark));
        var order = MODES.slice();
        if (selected) { order.splice(order.indexOf(selected), 1); order.unshift(selected); }
        var total = order.reduce(function (acc, id) { return acc + num(d.v[id]); }, 0);
        var x = x0;
        order.forEach(function (id) {
          var v = num(d.v[id]);
          if (v <= 0) return;
          var w = bw * v / total;
          var dim = selected && id !== selected;
          var r = rect(s, x, yBar, w, barH, PAL.modes[id], { opacity: dim ? 0.25 : 1, stroke: F4.sep, sw: 0.8 });
          r.setAttribute('aria-label', d.name + ', ' + MODE_NAMES[id] + ': ' + pct(d.v[id]));
          tip(r, function () { return [d.name + (d.mark || '') + ' · ' + d.n.toLocaleString('en-US') + ' failures with a mode label' + (d.v.choice === null ? ' · Choice not assessed' : ''), [{ value: pct(d.v[id]), label: MODE_NAMES[id], color: PAL.modes[id] }]]; });
          var lbl = pct(d.v[id]);
          if (!dim && (v >= 8 || (selected && v >= 3)) && w > lbl.length * 7 + 6) {
            text(s, x + w / 2, yBar + barH / 2 + 4.4, lbl, { anchor: 'middle', size: 12, fill: PAL.modeLabel[id] });
          }
          x += w;
        });
      });
      area.replaceChildren(s);
    }
    draw();
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (area.clientWidth !== lastW) draw(); }).observe(area);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  }

  /* ================================================================ Figure 5: recovery panels */
  var SERIES5 = ['overall', 'robodojo', 'openvitac', 'liberomax'];
  function fig5(root) {
    if (!root) return;
    var F = ARC.fig5, S = F.series;
    var legend = el('div', { class: 'chart-legend chart-legend--plain' });
    SERIES5.forEach(function (k) {
      var sw = sv('svg', { width: 28, height: 12, 'aria-hidden': 'true' });
      sw.appendChild(sv('line', { x1: 1, y1: 6, x2: 27, y2: 6, stroke: S[k].color, 'stroke-width': 2, 'stroke-dasharray': S[k].dash || null }));
      marker(sw, S[k].marker, 14, 6, 8, S[k].color);
      legend.appendChild(el('span', null, sw, S[k].name));
    });
    var pa = el('div', { class: 'chart' }), pb = el('div', { class: 'chart' }), pc = el('div', { class: 'chart' }), pd = el('div', { class: 'chart' });
    pd.classList.add('chart--wide');
    var panel = el('div', { class: 'bench-stats', 'aria-live': 'polite' });
    root.append(pa, pb, pc, legend, el('div', { class: 'fig5d' }, pd, panel));
    var selName = null, pointGroups = {};
    function select(name) { dismissHint(); selName = selName === name ? null : name; applySel(); renderPanel(); }
    /* animated hint on (d): a cursor clicks RoboDojo until the reader interacts with a benchmark */
    var HINT_TARGET = 'RoboDojo', hintDone = false, hintSeen = false;
    function startHint() {
      if (hintDone || hintSeen) return;
      hintSeen = true;
      var h = pd.querySelector('.click-hint');
      if (h) h.classList.add('is-playing');
      if (pointGroups[HINT_TARGET]) pointGroups[HINT_TARGET].classList.add('demo');
    }
    function dismissHint() {
      if (hintDone) return;
      hintDone = true;
      var h = pd.querySelector('.click-hint');
      if (h) { h.classList.add('is-out'); setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 300); }
      Object.keys(pointGroups).forEach(function (n) { pointGroups[n].classList.remove('demo'); });
    }
    function addHint(s, X, Y, W, m, narrow) {
      var t = ARC.fig5.d.points.filter(function (p) { return p.name === HINT_TARGET; })[0];
      if (!t) return;
      var cx = X(t.x), cy = Y(t.y);
      var h = sv('g', { class: 'click-hint' + (hintSeen ? ' is-playing' : ''), 'aria-hidden': 'true' });
      h.appendChild(sv('circle', { class: 'hint-ripple', cx: cx, cy: cy, r: 9 }));
      var bub = sv('g', { class: 'hint-bubble' });
      h.appendChild(bub);
      var at = sv('g', { transform: 'translate(' + (cx + 1) + ' ' + (cy + 1) + ')' });
      var cur = sv('g', { class: 'hint-cursor' });
      cur.appendChild(sv('path', { d: 'M0 0 L0 17 L4.6 12.9 L7.7 19.6 L10.6 18.3 L7.6 11.7 L13.4 11.4 Z', fill: '#ffffff', stroke: '#1d2333', 'stroke-width': 1.3, 'stroke-linejoin': 'round' }));
      at.appendChild(cur);
      h.appendChild(at);
      s.appendChild(h);
      var msg = window.matchMedia('(hover: none)').matches ? 'Tap a benchmark to explore' : 'Click a benchmark to explore';
      var bt = text(bub, 0, 0, msg, { size: narrow ? 11.5 : 13, fill: '#ffffff', weight: 600 });
      bt.setAttribute('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
      var b = bt.getBBox(), padX = narrow ? 8 : 11, padY = narrow ? 4 : 5;
      var bw = b.width + 2 * padX, bh = b.height + 2 * padY;
      var bx = Math.max(m.l + 4, Math.min(cx + 22, W - m.r - bw)), by = cy + 24;
      if (narrow) { bx = m.l + 6; by = m.t + 26; }
      bt.setAttribute('x', bx + padX);
      bt.setAttribute('y', by + padY - b.y);
      bub.insertBefore(sv('rect', { x: bx, y: by, width: bw, height: bh, rx: bh / 2, fill: '#3d5fa8' }), bt);
      if (hintSeen && pointGroups[HINT_TARGET]) pointGroups[HINT_TARGET].classList.add('demo');
    }
    if ('IntersectionObserver' in window) {
      var hio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { startHint(); hio.disconnect(); } }, { threshold: 0.6 });
      hio.observe(pd);
    } else startHint();
    function applySel() {
      Object.keys(pointGroups).forEach(function (n) {
        pointGroups[n].classList.toggle('is-sel', n === selName);
        pointGroups[n].setAttribute('aria-pressed', String(n === selName));
      });
    }
    function renderPanel() {
      var R = ARC.recoveryStats, row = selName ? R.rows[selName] : null;
      var cols = row ? [row] : [R.combined, R.average];
      var head = el('div', { class: 'bs-head' }, el('p', { class: 'bs-title' }, row ? selName + (row.mark || '') : 'All 12 benchmarks'));
      if (row) {
        var back = el('button', { class: 'linklike', type: 'button' }, 'Show all benchmarks');
        back.addEventListener('click', function () { select(selName); });
        head.appendChild(el('p', { class: 'bs-hint' }, back));
      } else head.appendChild(el('p', { class: 'bs-hint' }, 'Click a benchmark to see its statistics.'));
      var table = el('table', { class: 'bs-table' });
      if (!row) table.appendChild(el('thead', null,
        el('tr', null, el('th'), el('th', { scope: 'colgroup', colspan: '2', class: 'bs-span' }, 'Average')),
        el('tr', { class: 'bs-sub' }, el('th'), el('th', { scope: 'col' }, 'Sample'), el('th', { scope: 'col' }, 'Benchmark'))));
      var tb = el('tbody');
      [['Analyzed failed actions', 'failures'], ['Recovered within 10 actions (%)', 'within10'], ['Recovered by the end (%)', 'byEnd'],
       ['Episodes with a failure', 'episodes', 1], ['Their official success (%)', 'succ'],
       ['Successes with a failure (%)', 'withFail', 1], ['Success with 0 failures (%)', 'none'],
       ['Success with 1\u20132 failures (%)', 'oneTwo'], ['Success with 3+ failures (%)', 'threePlus']].filter(function (r) {
        /* skip a row that has no value in any shown column */
        return cols.some(function (c) { return c[r[1]] != null; });
      }).forEach(function (r) {
        var tr = el('tr', r[2] ? { class: 'bs-sep' } : null, el('th', { scope: 'row' }, r[0]));
        cols.forEach(function (c) {
          var v = c[r[1]], val = v == null ? (row ? '\u2013' : '') : (typeof v === 'string' ? v : v.v);
          var st = v && v.bg ? { background: v.bg, color: v.fg } : null;
          tr.appendChild(el('td', st ? { class: 'is-shaded', style: st } : null, val));
        });
        tb.appendChild(tr);
      });
      table.appendChild(tb);
      panel.replaceChildren(head, table, el('p', { class: 'bs-note' }, row
        ? 'Shading as in the paper\u2019s per-benchmark tables.' + (row.mark ? ' *Vision-only setting of a visuo-tactile benchmark.' : '') + (row.none && row.none.v === '\u2013' ? ' \u2013: no episode without a failed action.' : '')
        : 'Sample-wise average: all episodes or failed actions of the 12 benchmarks together. Benchmark-wise average: each of the 12 benchmarks weighted equally.'));
    }
    renderPanel();
    /* keep the panel as tall as the all-benchmarks view, so selecting a benchmark does not shift the page */
    requestAnimationFrame(function () { panel.style.minHeight = panel.offsetHeight + 'px'; });
    var order = ['robodojo', 'openvitac', 'liberomax', 'overall'];
    var PANEL_H = 215;

    /* (a) successes with a failure */
    responsive(pa, function (W) {
      var m = { l: 50, r: 10, t: 30, b: 40 };
      var slot = (W - m.l - m.r) / SERIES5.length, bw = Math.min(36, slot * 0.6);
      /* rotate the category labels, as in the paper, when they do not fit side by side */
      var rot = SERIES5.some(function (k) { return S[k].name.length * 6.8 > slot - 6; });
      if (rot) m.b = 62;
      var H = PANEL_H + (m.b - 40);
      var s = svgRoot(W, H, 'Share of successful episodes with at least one failed action');
      panelTitle(s, W, '(a) Successes with a failure');
      var Y = axesY(s, W, H, m, 0, 106, [0, 50, 100], 'Successful episodes (%)');
      SERIES5.forEach(function (k, i) {
        var d = F.a[k], cx = m.l + slot * (i + 0.5);
        var r = rect(s, cx - bw / 2, Y(d.v), bw, Y(0) - Y(d.v), S[k].color, { opacity: F.barOpacity });
        errbar(s, cx, Y(d.lo), Y(d.hi), CH.err, { width: 1.2, cap: 4 });
        if (rot) text(s, cx + 4, H - m.b + 12, S[k].name, { anchor: 'end', size: 12, fill: CH.tick, transform: 'rotate(-38 ' + (cx + 4) + ' ' + (H - m.b + 12) + ')' });
        else text(s, cx, H - m.b + 18, S[k].name, { anchor: 'middle', size: 12.5, fill: CH.tick });
        tip(r, function () { return ['(a) Successes with a failure', [{ value: fmt(d.v) + '%', label: S[k].name + ' (95% CI ' + fmt(d.lo) + '–' + fmt(d.hi) + ')', color: S[k].color }]]; });
      });
      pa.appendChild(s);
      if (rot) fitSvg(s, W, H);
    });

    /* (b) success by failure count */
    responsive(pb, function (W) {
      var H = PANEL_H, m = { l: 50, r: 14, t: 30, b: 40 };
      var s = svgRoot(W, H, 'Episode success by number of local failures');
      panelTitle(s, W, '(b) Success by failure count');
      var Y = axesY(s, W, H, m, 0, 106, [0, 50, 100], 'Episode success (%)');
      var cats = F.b.x, plotW = W - m.l - m.r;
      var X = function (i) { return m.l + plotW * (i + 0.35) / 2.7; };
      cats.forEach(function (c, i) { line(s, X(i), H - m.b, X(i), H - m.b + 4, { stroke: CH.tick }); text(s, X(i), H - m.b + 17, c, { anchor: 'middle', size: 12.5, fill: CH.tick }); });
      text(s, (m.l + W - m.r) / 2, H - 4, 'Local failures per episode', { anchor: 'middle', size: 13 });
      order.forEach(function (k) {
        F.b.series[k].forEach(function (d, i) { errbar(s, X(i), Y(d.lo), Y(d.hi), S[k].color, { opacity: k === 'overall' ? 0.65 : 0.38, cap: 3 }); });
      });
      order.forEach(function (k) {
        var ys = F.b.series[k];
        polyline(s, ys.map(function (d, i) { return [X(i), Y(d.v)]; }), S[k].color, S[k].width, S[k].dash);
        ys.forEach(function (d, i) {
          var mk = hoverMarker(s, S[k].marker, X(i), Y(d.v), 8, S[k].color);
          tip(mk, function () { return [S[k].name + ' · ' + cats[i] + ' local failures', [{ value: fmt(d.v) + '%', label: S[k].name + ' episode success (95% CI ' + fmt(d.lo) + '–' + fmt(d.hi) + ')', color: S[k].color }]]; });
        });
      });
      pb.appendChild(s);
    });

    /* (c) verified recovery over later actions */
    responsive(pc, function (W) {
      var H = PANEL_H, m = { l: 50, r: 38, t: 30, b: 40 };
      var s = svgRoot(W, H, 'Share of failed actions recovered within a number of later actions');
      panelTitle(s, W, '(c) Verified recovery');
      var Y = axesY(s, W, H, m, 0, 106, [0, 50, 100], 'Failures recovered (%)');
      var xs = F.c.x, n = xs.length, X = logX(xs, m, W);
      xs.forEach(function (v, i) { line(s, X(i), H - m.b, X(i), H - m.b + 4, { stroke: CH.tick }); text(s, X(i), H - m.b + 17, String(v), { anchor: 'middle', size: 12.5, fill: CH.tick }); });
      axisBreak(s, (X(n - 2) + X(n - 1)) / 2, H - m.b);
      text(s, (m.l + W - m.r) / 2, H - 4, 'Actions after failure', { anchor: 'middle', size: 13 });
      var ov = S.overall.color;
      /* Overall Wilson band */
      var band = F.c.band.overall;
      var poly = band.map(function (d, i) { return [X(i), Y(d.hi)]; }).concat(band.map(function (d, i) { return [X(i), Y(d.lo)]; }).reverse());
      s.appendChild(sv('polygon', { points: poly.map(function (p) { return p.join(','); }).join(' '), fill: ov, 'fill-opacity': F.c.bandOpacity, stroke: 'none' }));
      /* reference guide at 10 actions / 38.9 */
      var ri = xs.indexOf(F.c.ref.x);
      line(s, m.l, Y(F.c.ref.y), X(ri), Y(F.c.ref.y), { stroke: ov, dash: '1.5 2.5', opacity: 0.75 });
      line(s, X(ri), Y(F.c.ref.y), X(ri), Y(0), { stroke: ov, dash: '1.5 2.5', opacity: 0.75 });
      line(s, m.l - 4, Y(F.c.ref.y), m.l, Y(F.c.ref.y), { stroke: ov });
      text(s, m.l - 7, Y(F.c.ref.y) + 4.5, fmt(F.c.ref.y), { anchor: 'end', size: 12, fill: ov });
      ['robodojo', 'openvitac', 'liberomax'].forEach(function (k) {
        F.c.series[k].forEach(function (d, i) { errbar(s, X(i), Y(d.lo), Y(d.hi), S[k].color, { opacity: 0.4, cap: 2.5, width: 1 }); });
      });
      order.forEach(function (k) {
        var ys = F.c.series[k];
        polyline(s, ys.map(function (d, i) { return [X(i), Y(d.v)]; }), S[k].color, S[k].width, S[k].dash);
        ys.forEach(function (d, i) {
          var mk = hoverMarker(s, S[k].marker, X(i), Y(d.v), 7.5, S[k].color);
          tip(mk, function () { return [S[k].name + ' · recovered ' + within(xs[i]), [{ value: fmt(d.v) + '%', label: S[k].name, color: S[k].color }]]; });
        });
      });
      var endV = F.c.series.overall[n - 1].v;
      line(s, W - m.r, Y(endV), W - m.r + 4, Y(endV), { stroke: ov });
      text(s, W - m.r + 7, Y(endV) + 4.5, fmt(endV), { size: 12, fill: ov });
      pc.appendChild(s);
    });

    /* (d) recovery vs success, one point per benchmark */
    /* label offsets from the point, in em of the label font; 1 = draw a leader line */
    var placeD = {
      'UniVTAC': [0.85, 0.35, 'start'], 'StationeryBench': [0.85, 0.35, 'start'], 'ContactBench 1.0': [-0.15, -0.95, 'end'],
      'RoboDojo': [0.9, 0.35, 'start'], 'RoboTwin 2.0': [-0.85, 0.35, 'end'], 'Astranomy': [1.75, 0.85, 'start', 1],
      'RoboWits': [1.6, 1.95, 'start', 1], 'OpenViTac': [0.85, 0.7, 'start'], 'DexJoCo': [0, -1.05, 'middle'],
      'YAMLab': [-1.9, 0.6, 'end', 1], 'Meta-World+': [-2.1, -0.35, 'end', 1], 'LIBERO-MAX': [-2.3, -1.8, 'end', 1]
    };
    responsive(pd, function (W) {
      var narrow = W < 420, FS = narrow ? 11 : (W < 560 ? 13 : 14.5), TK = narrow ? 12 : 13.5;
      var PADX = narrow ? 3 : 5, PADY = narrow ? 1.5 : 3;
      var H = narrow ? 340 : Math.round(Math.max(300, Math.min(400, W * 0.63))), m = { l: 54, r: 12, t: 30, b: 44 };
      var s = svgRoot(W, H, 'Failures recovered by episode end against episode success, per benchmark');
      panelTitle(s, W, '(d) Recovery and task success');
      var D = F.d;
      var Y = axesY(s, W, H, m, D.yMin, D.yMax, D.yTicks, 'Episode success (%)', { tickSize: TK, labelSize: TK + 0.5 });
      var X = function (v) { return m.l + (W - m.l - m.r) * (v - D.xMin) / (D.xMax - D.xMin); };
      D.xTicks.forEach(function (t) {
        gridline(s, X(t), m.t, X(t), H - m.b);
        line(s, X(t), H - m.b, X(t), H - m.b + 4, { stroke: CH.tick });
        text(s, X(t), H - m.b + 18, String(t), { anchor: 'middle', size: TK, fill: CH.tick });
      });
      text(s, (m.l + W - m.r) / 2, H - 4, 'Failures recovered by episode end (%)', { anchor: 'middle', size: TK + 0.5 });
      line(s, X(D.fit.x0), Y(D.fit.y0), X(D.fit.x1), Y(D.fit.y1), { stroke: D.fitColor, width: 2 });
      line(s, m.l + 12, m.t + 13, m.l + 36, m.t + 13, { stroke: D.fitColor, width: 2 });
      var rt = text(s, m.l + 42, m.t + 18, '', { size: FS });
      rt.appendChild(sv('tspan', { 'font-style': 'italic' }, 'r'));
      rt.appendChild(document.createTextNode(' = ' + fmt(D.r, 2)));
      /* phone widths: explicit offsets in px for the crowded labels */
      var NARROW = { 'LIBERO-MAX': [-10, -7, 'end'], 'Meta-World+': [-9, 4, 'end'], 'YAMLab': [-8, 18, 'end'], 'DexJoCo': [9, 4, 'start'],
        'OpenViTac': [8, 4, 'start'], 'Astranomy': [8, 1, 'start'], 'RoboWits': [8, 9, 'start'] };
      D.points.forEach(function (p) {
        var cx = X(p.x), cy = Y(p.y), ser = p.series ? S[p.series] : null;
        var g = pointGroup(s, cx, cy);
        marker(g, ser ? ser.marker : 'circle', cx, cy, ser ? 11 : 10.5, ser ? ser.color : D.pointColor, '#ffffff').classList.add('pt');
        g.setAttribute('aria-label', p.name + ': select to show its statistics');
        g.addEventListener('pointerenter', dismissHint);
        g.addEventListener('focus', dismissHint);
        g.setAttribute('role', 'button');
        pointGroups[p.name] = g;
        g.addEventListener('click', function (e) { e.stopPropagation(); select(p.name); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(p.name); } });
        tip(g, function () { return [p.name, [{ value: fmt(p.x) + '%', label: 'failures recovered by episode end', color: ser ? ser.color : D.pointColor }, { value: fmt(p.y) + '%', label: 'success of episodes with a failure' }]]; }, true);
        var pl = placeD[p.name] || [0.6, 0.35, 'start'];
        var dx = pl[0] * FS, dy = pl[1] * FS, anchor = pl[2];
        if (narrow && NARROW[p.name]) { dx = NARROW[p.name][0]; dy = NARROW[p.name][1]; anchor = NARROW[p.name][2]; }
        else if (narrow && pl[3]) { dx = pl[2] === 'end' ? -8 : 8; dy = 4; }
        if (pl[3] && !narrow) line(g, cx + (dx > 0 ? 5 : -5), cy + (dy > 0 ? 3 : -3), cx + dx + (anchor === 'end' ? PADX : -PADX), cy + dy - FS * 0.33, { stroke: '#8a8a8a', width: 0.9, cap: 'round' });
        text(g, cx + dx, cy + dy, p.name, { anchor: anchor, size: FS }).setAttribute('pointer-events', 'auto');
      });
      s.addEventListener('click', function () { if (selName) select(selName); });
      pd.appendChild(s);
      /* a light chip behind each label: the label is a target as well as the point */
      $$('.pt-g', s).forEach(function (g) {
        var t = g.querySelector('text');
        if (!t) return;
        var b = t.getBBox();
        g.insertBefore(sv('rect', { class: 'chip', x: b.x - PADX, y: b.y - PADY, width: b.width + 2 * PADX, height: b.height + 2 * PADY, rx: 4 }), t);
      });
      applySel();
      if (!hintDone) addHint(s, X, Y, W, m, narrow);
    });
  }

  /* ================================================================ Figure 7 */
  function fig7(root) {
    if (!root) return;
    var F = ARC.fig7;
    var pa = el('div', { class: 'chart' }), pb = el('div', { class: 'chart' });
    root.append(pa, pb);
    function rotLabel(s, x, y, str, small) {
      text(s, x, y, str, { anchor: 'end', size: 12.5, transform: 'rotate(-40 ' + x + ' ' + y + ')', variant: small ? 'small-caps' : null });
    }
    responsive(pa, function (W) {
      var H = 310, m = { l: 48, r: 8, t: 30, b: 96 };
      var s = svgRoot(W, H, 'Recovery by failure mode');
      panelTitle(s, W, '(a) Recovery by failure mode');
      var Y = axesY(s, W, H, m, 0, 100, [0, 50, 100], 'Recovered (%)');
      var slot = (W - m.l - m.r) / F.a.length, bw = Math.min(36, slot * 0.66);
      F.a.forEach(function (d, i) {
        var cx = m.l + slot * (i + 0.5);
        var r = rect(s, cx - bw / 2, Y(d.v), bw, Y(0) - Y(d.v), d.color, { opacity: F.barOpacity });
        errbar(s, cx, Y(d.lo), Y(d.hi), CH.err, { width: 1.1, cap: 4 });
        text(s, cx, Y(d.hi) - 5, fmt(d.v), { anchor: 'middle', size: 12.5 });
        rotLabel(s, cx + 4, H - m.b + 14, d.name, true);
        tip(r, function () { return [d.name, [{ value: fmt(d.v) + '%', label: 'recovered, ' + d.k.toLocaleString('en-US') + ' of ' + d.n.toLocaleString('en-US') + ' (95% CI ' + fmt(d.lo) + '–' + fmt(d.hi) + ')', color: d.color }]]; });
      });
      pa.appendChild(s);
      fitSvg(s, W, H);
    });
    responsive(pb, function (W) {
      var H = 310, m = { l: 48, r: 8, t: 30, b: 96 };
      var s = svgRoot(W, H, 'Grasp sub-categories');
      var tt = text(s, W / 2, 16, '(b) ', { anchor: 'middle', size: 15, weight: 700, fill: CH.title });
      tt.appendChild(sv('tspan', { 'font-variant': 'small-caps' }, 'Grasp'));
      tt.appendChild(document.createTextNode(' sub-categories'));
      var Y = axesY(s, W, H, m, 0, F.bMax, [0, 10, 20, 30], 'Share (%)');
      var items = [];
      F.b.forEach(function (g) { g.items.forEach(function (it) { items.push({ g: g, it: it }); }); });
      var GAP = 0.45, slot = (W - m.l - m.r) / (items.length + GAP * (F.b.length - 1)), bw = Math.min(28, slot * 0.66);
      var left = [], gi = 0;
      F.b.forEach(function (g, k) { g.items.forEach(function () { left.push(m.l + slot * (left.length + GAP * k)); }); });
      F.b.forEach(function (g) {
        var first = gi, last = gi + g.items.length - 1;
        var xa = left[first] + 4, xb = left[last] + slot - 4, yb = m.t + 10;
        line(s, xa, yb, xb, yb, { stroke: F.bracket });
        line(s, xa, yb, xa, yb + 4, { stroke: F.bracket });
        line(s, xb, yb, xb, yb + 4, { stroke: F.bracket });
        text(s, (xa + xb) / 2, yb - 4, g.stage, { anchor: 'middle', size: 12, fill: CH.spine });
        gi += g.items.length;
      });
      items.forEach(function (o, i) {
        var cx = left[i] + slot / 2, d = o.it;
        var r = rect(s, cx - bw / 2, Y(d.v), bw, Y(0) - Y(d.v), F.bColor, { opacity: F.barOpacity });
        text(s, cx, Y(d.v) - 4, fmt(d.v), { anchor: 'middle', size: 12 });
        rotLabel(s, cx + 4, H - m.b + 14, d.name, false);
        tip(r, function () { return [o.g.stage, [{ value: fmt(d.v) + '%', label: d.name, color: F.bColor }]]; });
      });
      pb.appendChild(s);
      fitSvg(s, W, H);
    });
  }

  /* ================================================================ recovery over actions by failure mode */
  function recoveryModes(root) {
    var R = ARC.recoveryModes;
    if (!root || !R) return;
    var legend = el('div', { class: 'chart-legend' });
    R.series.forEach(function (sr) {
      var sw = sv('svg', { width: 28, height: 12, 'aria-hidden': 'true' });
      sw.appendChild(sv('line', { x1: 1, y1: 6, x2: 27, y2: 6, stroke: sr.color, 'stroke-width': 2, 'stroke-dasharray': sr.dash || null }));
      marker(sw, sr.marker, 14, 6, 8, sr.color);
      legend.appendChild(el('span', sr.dash ? { style: { 'font-variant-caps': 'normal' } } : null, sw, sr.name));
    });
    var area = el('div');
    root.append(legend, area);
    responsive(area, function (W) {
      var H = 290, m = { l: 50, r: 40, t: 12, b: 42 };
      var s = svgRoot(W, H, 'Recovery over actions by failure mode');
      var Y = axesY(s, W, H, m, 0, R.yMax, R.yTicks, R.yLabel);
      var xs = R.x, n = xs.length, X = logX(xs, m, W);
      xs.forEach(function (v, i) { line(s, X(i), H - m.b, X(i), H - m.b + 4, { stroke: CH.tick }); text(s, X(i), H - m.b + 17, String(v), { anchor: 'middle', size: 12.5, fill: CH.tick }); });
      axisBreak(s, (X(n - 2) + X(n - 1)) / 2, H - m.b);
      text(s, (m.l + W - m.r) / 2, H - 4, R.xLabel, { anchor: 'middle', size: 13 });
      R.series.forEach(function (sr) {
        polyline(s, sr.y.map(function (v, i) { return [X(i), Y(v)]; }), sr.color, sr.dash ? 2.2 : 1.9, sr.dash);
        sr.y.forEach(function (v, i) {
          var mk = hoverMarker(s, sr.marker, X(i), Y(v), sr.dash ? 6.5 : 7.5, sr.color);
          tip(mk, function () { return [sr.name, [{ value: fmt(v) + '%', label: 'recovered ' + within(xs[i]), color: sr.color }]]; });
        });
      });
      area.appendChild(s);
    });
  }

  /* ================================================================ equations */
  window.ARCRenderTex = function () {
    if (!window.katex) return;
    $$('.eq[data-tex]').forEach(function (node) {
      if (node.dataset.rendered) return;
      try {
        window.katex.render(node.getAttribute('data-tex'), node, {
          displayMode: true, throwOnError: false, strict: 'ignore',
          trust: function (ctx) { return ctx.command === '\\htmlClass'; }
        });
        node.dataset.rendered = '1';
      } catch (e) {}
    });
  };

  /* ================================================================ boot */
  initToc();
  initPendingLinks();
  buildTeaser($('#teaser .paperfig'));
  buildSlots($('#pipeline-slots'), ARC.pipelineSlots, 494.994, 149.998);
  $$('main .vid').forEach(function (w) { var v = $('video', w); if (v) addToggle(w, v); });
  buildFig3($('#fig3-grid'));
  buildFig6($('#fig6'));
  buildCovers($('#bench-strip'));
  fig4($('#fig4'));
  fig5($('#fig5'));
  fig7($('#fig7'));
  recoveryModes($('#appx-recovery-modes-chart'));
  initAutoplay();
  window.ARCRenderTex();
})();
