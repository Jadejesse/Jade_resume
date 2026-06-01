// content-fx.js — Cyberpunk content visual layer
// Adds: HUD canvas (corner brackets, circuit traces, scan lines, data labels),
//       bokeh orb field, falling data rain on side columns, section colour auras.
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  // 1.  SHARED STYLES
  // ═══════════════════════════════════════════════════════════════════
  var cssEl = document.createElement('style');
  cssEl.textContent = [
    /* cards must sit above the fx canvas (z-index 2) */
    '.card,.hero,.easter-egg-hints,.music-control,.dark-mode-toggle,.konami-progress{',
    '  position:relative!important;z-index:3!important;}',

    /* section aura — hidden until IntersectionObserver fires */
    '.cfx-aura{',
    '  position:absolute;inset:-30px;border-radius:inherit;',
    '  pointer-events:none;z-index:0;opacity:0;',
    '  transition:opacity 1.4s ease;}',
    '.cfx-aura.cfx-on{opacity:1;}',
  ].join('');
  document.head.appendChild(cssEl);

  // ═══════════════════════════════════════════════════════════════════
  // 2.  MAIN FX CANVAS  (HUD + circuit + data-rain)
  // ═══════════════════════════════════════════════════════════════════
  var Canvas = (function () {
    var cv, ctx, W, H;

    /* ── data-rain state ─────────────────────────── */
    var RAIN_CHARS = '01アイウカキABCDEF0369ΩΨΦ∑∞█▓▒';
    var rainCols   = [];   // { x, y, speed, alpha, hue:'cyan'|'mag' }

    /* ── circuit-trace state ─────────────────────── */
    var traces = [];       // { pts[], color, pulseT, pulsing }

    /* ── HUD data-label update ───────────────────── */
    var labelTimer = 0;
    var syncVal    = 98.4;
    var nodeCount  = 1247;

    /* ── scan-line ───────────────────────────────── */
    var SCAN_SPEED = 0.022; // viewport-heights per second

    function init() {
      cv = document.createElement('canvas');
      cv.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'z-index:2;pointer-events:none;';
      document.body.appendChild(cv);

      onResize();
      window.addEventListener('resize', onResize);
      requestAnimationFrame(tick);
    }

    function onResize() {
      W = cv.width  = window.innerWidth;
      H = cv.height = window.innerHeight;
      buildRainCols();
      buildTraces();
    }

    /* ── data-rain columns ─────────────────────────── */
    function buildRainCols() {
      rainCols = [];
      var sideW = (W - 1060) / 2;
      if (sideW < 60) return;

      var colPx = 15;
      var lCols = Math.floor(sideW * 0.55 / colPx);
      var rCols = Math.floor(sideW * 0.55 / colPx);

      for (var i = 0; i < lCols; i++) {
        rainCols.push({
          x: 8 + i * colPx,
          y: Math.random() * H,
          speed: 1.2 + Math.random() * 1.8,
          alpha: 0.07 + Math.random() * 0.08,
          hue: 'cyan'
        });
      }
      var rx0 = W - sideW * 0.58;
      for (var j = 0; j < rCols; j++) {
        rainCols.push({
          x: rx0 + j * colPx,
          y: Math.random() * H,
          speed: 1.2 + Math.random() * 1.8,
          alpha: 0.06 + Math.random() * 0.07,
          hue: 'mag'
        });
      }
    }

    /* ── circuit traces ────────────────────────────── */
    function buildTraces() {
      traces = [];
      var sw = (W - 1060) / 2;
      if (sw < 100) return;

      // Left trace
      traces.push({
        pts: [
          [sw * 0.20, H * 0.18],
          [sw * 0.55, H * 0.18],
          [sw * 0.55, H * 0.36],
          [sw * 0.75, H * 0.36],
          [sw * 0.75, H * 0.56],
          [sw * 0.40, H * 0.56],
          [sw * 0.40, H * 0.76],
          [sw * 0.70, H * 0.76],
        ],
        color: [0, 229, 255],
        pulseT: 0, pulsing: false, speed: 220,
        totalLen: 0, segLens: []
      });

      // Right trace
      var rx = W - sw;
      traces.push({
        pts: [
          [rx - sw * 0.20, H * 0.22],
          [rx - sw * 0.55, H * 0.22],
          [rx - sw * 0.55, H * 0.42],
          [rx - sw * 0.30, H * 0.42],
          [rx - sw * 0.30, H * 0.62],
          [rx - sw * 0.65, H * 0.62],
          [rx - sw * 0.65, H * 0.80],
        ],
        color: [224, 64, 251],
        pulseT: 0, pulsing: false, speed: 200,
        totalLen: 0, segLens: []
      });

      traces.forEach(function (tr) { computeLen(tr); });
    }

    function computeLen(tr) {
      tr.segLens = [];
      tr.totalLen = 0;
      for (var i = 1; i < tr.pts.length; i++) {
        var dx = tr.pts[i][0] - tr.pts[i-1][0];
        var dy = tr.pts[i][1] - tr.pts[i-1][1];
        var l  = Math.sqrt(dx*dx + dy*dy);
        tr.segLens.push(l);
        tr.totalLen += l;
      }
    }

    /* ── main tick ─────────────────────────────────── */
    var lastTs = 0;
    function tick(ts) {
      requestAnimationFrame(tick);
      ctx = ctx || cv.getContext('2d');
      var dt = Math.min((ts - lastTs) / 1000, 0.05); // seconds, capped
      lastTs = ts;

      ctx.clearRect(0, 0, W, H);

      drawHUDLines();
      drawScanLine(ts);
      drawCornerBrackets();
      drawTraces(dt, ts);
      drawDataRain();
      drawSideLabels(ts);
    }

    /* ── HUD horizontal reference lines ──────────────── */
    function drawHUDLines() {
      [0.28, 0.54, 0.80].forEach(function (p) {
        var y = H * p;
        var g = ctx.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0,    'rgba(0,229,255,0)');
        g.addColorStop(0.08, 'rgba(0,229,255,0.06)');
        g.addColorStop(0.50, 'rgba(0,229,255,0.03)');
        g.addColorStop(0.92, 'rgba(0,229,255,0.06)');
        g.addColorStop(1,    'rgba(0,229,255,0)');
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });
    }

    /* ── moving scan line ─────────────────────────────── */
    function drawScanLine(ts) {
      var y = (ts * SCAN_SPEED * 0.001 * H) % H;
      var g = ctx.createLinearGradient(0, y - 3, 0, y + 3);
      g.addColorStop(0,   'rgba(0,229,255,0)');
      g.addColorStop(0.5, 'rgba(0,229,255,0.09)');
      g.addColorStop(1,   'rgba(0,229,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, y - 3, W, 6);
    }

    /* ── corner brackets ──────────────────────────────── */
    function drawCornerBrackets() {
      var s = 26, m = 18;
      [
        [m,   m,    1,  1],
        [W-m, m,   -1,  1],
        [m,   H-m,  1, -1],
        [W-m, H-m, -1, -1],
      ].forEach(function (c) {
        var x = c[0], y = c[1], sx = c[2], sy = c[3];
        ctx.beginPath();
        ctx.moveTo(x + sx*s, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + sy*s);
        ctx.strokeStyle = 'rgba(0,229,255,0.45)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,229,255,0.70)';
        ctx.fill();
      });
    }

    /* ── circuit traces + pulse dots ─────────────────── */
    function drawTraces(dt, ts) {
      traces.forEach(function (tr) {
        if (!tr.pts.length) return;
        var r = tr.color[0], g = tr.color[1], b = tr.color[2];

        // Static path
        ctx.beginPath();
        ctx.moveTo(tr.pts[0][0], tr.pts[0][1]);
        for (var i = 1; i < tr.pts.length; i++)
          ctx.lineTo(tr.pts[i][0], tr.pts[i][1]);
        ctx.strokeStyle = 'rgba('+r+','+g+','+b+',0.14)';
        ctx.lineWidth   = 1;
        ctx.stroke();

        // Node dots
        tr.pts.forEach(function (pt) {
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 2, 0, Math.PI*2);
          ctx.fillStyle = 'rgba('+r+','+g+','+b+',0.28)';
          ctx.fill();
        });

        // Randomly start a new pulse
        if (!tr.pulsing && Math.random() < 0.008) {
          tr.pulsing = true;
          tr.pulseT  = 0;
        }

        if (tr.pulsing) {
          tr.pulseT += tr.speed * dt;
          if (tr.pulseT >= tr.totalLen) {
            tr.pulsing = false;
          } else {
            var px = pointAlongTrace(tr, tr.pulseT);
            if (px) {
              // Glow halo
              var grd = ctx.createRadialGradient(px[0], px[1], 0, px[0], px[1], 14);
              grd.addColorStop(0, 'rgba('+r+','+g+','+b+',0.55)');
              grd.addColorStop(1, 'rgba('+r+','+g+','+b+',0)');
              ctx.beginPath();
              ctx.arc(px[0], px[1], 14, 0, Math.PI*2);
              ctx.fillStyle = grd;
              ctx.fill();

              // Bright dot
              ctx.beginPath();
              ctx.arc(px[0], px[1], 3.5, 0, Math.PI*2);
              ctx.fillStyle = 'rgba('+r+','+g+','+b+',1)';
              ctx.fill();
            }
          }
        }
      });
    }

    function pointAlongTrace(tr, dist) {
      var cum = 0;
      for (var i = 0; i < tr.segLens.length; i++) {
        if (dist <= cum + tr.segLens[i]) {
          var t  = (dist - cum) / tr.segLens[i];
          var p0 = tr.pts[i], p1 = tr.pts[i+1];
          return [p0[0] + t*(p1[0]-p0[0]), p0[1] + t*(p1[1]-p0[1])];
        }
        cum += tr.segLens[i];
      }
      return null;
    }

    /* ── data rain ────────────────────────────────────── */
    function drawDataRain() {
      ctx.font = '11px "Courier New",monospace';
      rainCols.forEach(function (col) {
        col.y += col.speed;
        if (col.y > H + 20) col.y = -20;

        var ch = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
        var isCyan = col.hue === 'cyan';
        var rgb = isCyan ? '0,229,255' : '224,64,251';

        for (var k = 0; k <= 4; k++) {
          var a = col.alpha * (1 - k * 0.18);
          if (a <= 0) continue;
          ctx.fillStyle = 'rgba('+rgb+','+a+')';
          var c2 = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          ctx.fillText(k === 0 ? ch : c2, col.x, col.y - k * 14);
        }
      });
    }

    /* ── side HUD text labels ─────────────────────────── */
    function drawSideLabels(ts) {
      var sw = (W - 1060) / 2;
      if (sw < 130) return;

      // Drift labels slowly
      if (ts - labelTimer > 2200) {
        syncVal   = 95 + Math.random() * 5;
        nodeCount = 1200 + Math.floor(Math.random() * 200);
        labelTimer = ts;
      }

      ctx.font = '9px "Courier New",monospace';

      // Left column labels
      ctx.fillStyle = 'rgba(0,229,255,0.26)';
      var lx = sw * 0.08;
      [
        [0.14, 'SYNC_RATE: ' + syncVal.toFixed(1) + '%'],
        [0.32, 'PROTOCOL: ACTIVE'],
        [0.50, 'NODE_ID: JC-01'],
        [0.68, 'DEFENDER: LIVE'],
        [0.84, 'KQL: RUNNING'],
      ].forEach(function (l) { ctx.fillText(l[1], lx, H * l[0]); });

      // Right column labels
      ctx.fillStyle = 'rgba(224,64,251,0.22)';
      var rx = W - sw * 0.92;
      [
        [0.18, 'AZURE_SEC'],
        [0.36, 'ENTRA_ID'],
        [0.54, 'NODES:' + nodeCount],
        [0.72, 'M365: OK'],
        [0.88, 'INCIDENT: 0'],
      ].forEach(function (l) { ctx.fillText(l[1], rx, H * l[0]); });
    }

    return { init: init };
  }());

  // ═══════════════════════════════════════════════════════════════════
  // 3.  BOKEH ORB FIELD  (CSS, GPU-accelerated)
  // ═══════════════════════════════════════════════════════════════════
  var Bokeh = (function () {
    // [size, left%, top%, color, blurPx, opacity, durationS]
    var DEFS = [
      [100,  4,  28, '#00e5ff', 32, 0.055, 24],
      [140,  7,  62, '#7c4dff', 52, 0.040, 31],
      [ 65, 11,  82, '#00e5ff', 22, 0.065, 17],
      [ 80,  2,  50, '#e040fb', 28, 0.050, 21],
      [120, 90,  18, '#e040fb', 46, 0.042, 27],
      [ 70, 93,  52, '#00e5ff', 26, 0.060, 19],
      [160, 87,  74, '#7c4dff', 60, 0.035, 34],
      [ 55, 96,  38, '#00e676', 20, 0.055, 16],
      [110, 48,   8, '#00e5ff', 42, 0.038, 29],
      [ 75, 52,  92, '#e040fb', 28, 0.055, 22],
      [ 90, 18,  15, '#7c4dff', 35, 0.045, 25],
      [ 60, 78,  88, '#00e5ff', 22, 0.060, 18],
    ];

    function init() {
      var keyframes = '';
      DEFS.forEach(function (d, i) {
        var dx1 = ((Math.random() - .5) * 70).toFixed(1);
        var dy1 = ((Math.random() - .5) * 50).toFixed(1);
        var dx2 = ((Math.random() - .5) * 90).toFixed(1);
        var dy2 = ((Math.random() - .5) * 70).toFixed(1);
        var a1  = d[5], a2 = Math.min(d[5] * 1.9, 0.18);

        keyframes += '@keyframes cfxB'+i+'{';
        keyframes += '0%{transform:translate(0,0)scale(1);opacity:'+a1+'}';
        keyframes += '33%{transform:translate('+dx1+'px,'+dy1+'px)scale(1.12);opacity:'+a2+'}';
        keyframes += '66%{transform:translate('+dx2+'px,'+dy2+'px)scale(0.88);opacity:'+a1+'}';
        keyframes += '100%{transform:translate(0,0)scale(1);opacity:'+a2+'}}';

        var el = document.createElement('div');
        el.style.cssText = [
          'position:fixed',
          'border-radius:50%',
          'pointer-events:none',
          'z-index:2',
          'width:'+d[0]+'px',
          'height:'+d[0]+'px',
          'left:'+d[1]+'%',
          'top:'+d[2]+'%',
          'background:'+d[3],
          'filter:blur('+d[4]+'px)',
          'mix-blend-mode:screen',
          'animation:cfxB'+i+' '+d[6]+'s ease-in-out infinite',
          'animation-delay:'+(-(i*2.3)).toFixed(1)+'s',
        ].join(';');
        document.body.appendChild(el);
      });

      var kfEl = document.createElement('style');
      kfEl.textContent = keyframes;
      document.head.appendChild(kfEl);
    }

    return { init: init };
  }());

  // ═══════════════════════════════════════════════════════════════════
  // 4.  SECTION COLOUR AURAS  (radial glow behind each .card)
  // ═══════════════════════════════════════════════════════════════════
  var SectionAuras = (function () {
    var MAP = {
      about:      'radial-gradient(ellipse at 50% 50%,rgba(0,229,255,0.09),transparent 70%)',
      skills:     'radial-gradient(ellipse at 50% 50%,rgba(124,77,255,0.11),transparent 70%)',
      experience: 'radial-gradient(ellipse at 30% 50%,rgba(0,80,220,0.10),transparent 70%)',
      contact:    'radial-gradient(ellipse at 50% 50%,rgba(0,230,118,0.09),transparent 70%)',
      education:  'radial-gradient(ellipse at 70% 50%,rgba(224,64,251,0.08),transparent 70%)',
    };

    function init() {
      Object.keys(MAP).forEach(function (id) {
        var sec = document.getElementById(id);
        if (!sec) return;

        var aura = document.createElement('div');
        aura.className = 'cfx-aura';
        aura.style.background = MAP[id];

        if (getComputedStyle(sec).position === 'static')
          sec.style.position = 'relative';
        sec.insertBefore(aura, sec.firstChild);

        new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) aura.classList.add('cfx-on');
        }, { threshold: 0.15 }).observe(sec);
      });
    }

    return { init: init };
  }());

  // ═══════════════════════════════════════════════════════════════════
  // BOOT
  // ═══════════════════════════════════════════════════════════════════
  function boot() {
    Canvas.init();
    Bokeh.init();
    SectionAuras.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
