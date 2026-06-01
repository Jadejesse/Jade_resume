// cmd-dashboard.js — AI Infrastructure Command Center logic
// Modules: Clock, TopologyCanvas, MetricsAnimate, LogStream
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 1.  LIVE CLOCK
  // ═══════════════════════════════════════════════════════════════
  function initClock() {
    var el = document.getElementById('cmd-clock');
    if (!el) return;
    function tick() {
      var now = new Date();
      var h = String(now.getUTCHours()).padStart(2, '0');
      var m = String(now.getUTCMinutes()).padStart(2, '0');
      var s = String(now.getUTCSeconds()).padStart(2, '0');
      el.textContent = h + ':' + m + ':' + s + ' UTC';
    }
    tick();
    setInterval(tick, 1000);
  }

  // ═══════════════════════════════════════════════════════════════
  // 2.  TOPOLOGY CANVAS
  // ═══════════════════════════════════════════════════════════════
  var Topology = (function () {
    var cv, ctx, W, H;

    // Node definitions: [id, label, icon, xRatio, yRatio, color, radius]
    var NODES = [
      { id: 'azure',   label: 'AZURE',    icon: '⬡', x: .50, y: .44, color: [0,229,255],   r: 20 },
      { id: 'm365',    label: 'M365',     icon: '✉', x: .26, y: .20, color: [100,180,255],  r: 13 },
      { id: 'defndr',  label: 'DEFENDER', icon: '⬡', x: .74, y: .18, color: [0,230,118],    r: 13 },
      { id: 'entra',   label: 'ENTRA ID', icon: '⬡', x: .84, y: .50, color: [224,64,251],   r: 13 },
      { id: 'aws',     label: 'AWS',      icon: '⬡', x: .14, y: .52, color: [255,180,0],    r: 13 },
      { id: 'github',  label: 'GITHUB',   icon: '⬡', x: .28, y: .78, color: [180,136,255],  r: 11 },
      { id: 'python',  label: 'PYTHON',   icon: '⬡', x: .70, y: .80, color: [100,220,100],  r: 11 },
      { id: 'kql',     label: 'KQL',      icon: '⬡', x: .50, y: .84, color: [0,210,220],    r: 11 },
    ];

    // Edge definitions: [from, to] — pulses travel from → to
    var EDGES = [
      ['azure','m365'], ['azure','defndr'], ['azure','entra'],
      ['azure','aws'],  ['azure','github'], ['azure','python'],
      ['azure','kql'],  ['defndr','m365'],  ['entra','defndr'],
    ];

    // Pulse state per edge
    var pulses = [];

    function rnd(min, max) { return min + Math.random() * (max - min); }

    function initPulses() {
      pulses = EDGES.map(function (e) {
        return {
          from: e[0], to: e[1],
          t: Math.random(),          // position [0..1] along edge
          speed: rnd(0.18, 0.36),   // units/sec
          active: Math.random() > 0.4,
          nextActivate: rnd(0, 2),
        };
      });
    }

    function nodePos(id) {
      for (var i = 0; i < NODES.length; i++) {
        if (NODES[i].id === id)
          return { x: NODES[i].x * W, y: NODES[i].y * H };
      }
    }

    function init() {
      cv = document.getElementById('cmd-topo');
      if (!cv) return;

      onResize();
      var ro = new ResizeObserver(onResize);
      ro.observe(cv.parentElement);
      initPulses();
      requestAnimationFrame(tick);
    }

    function onResize() {
      if (!cv) return;
      var rect = cv.parentElement.getBoundingClientRect();
      W = cv.width  = rect.width  || 600;
      H = cv.height = rect.height || 300;
      ctx = cv.getContext('2d');
    }

    var lastTs = 0;
    function tick(ts) {
      requestAnimationFrame(tick);
      if (!ctx) return;
      var dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      ctx.clearRect(0, 0, W, H);

      // Background subtle grid
      drawGrid();

      // Edges
      EDGES.forEach(function (e) { drawEdge(e[0], e[1]); });

      // Pulses
      pulses.forEach(function (p) { updatePulse(p, dt); drawPulse(p); });

      // Nodes
      NODES.forEach(function (n) { drawNode(n, ts); });
    }

    function drawGrid() {
      var step = 28;
      ctx.strokeStyle = 'rgba(0,229,255,0.04)';
      ctx.lineWidth = 0.5;
      for (var x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (var y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    }

    function drawEdge(fromId, toId) {
      var f = nodePos(fromId), t = nodePos(toId);
      if (!f || !t) return;

      var grd = ctx.createLinearGradient(f.x, f.y, t.x, t.y);
      grd.addColorStop(0, 'rgba(0,229,255,0.22)');
      grd.addColorStop(1, 'rgba(0,229,255,0.08)');

      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function updatePulse(p, dt) {
      if (!p.active) {
        p.nextActivate -= dt;
        if (p.nextActivate <= 0) {
          p.active = true;
          p.t = 0;
          p.nextActivate = rnd(1.5, 5);
        }
        return;
      }
      p.t += p.speed * dt;
      if (p.t >= 1) {
        p.active = false;
        p.t = 0;
        p.nextActivate = rnd(0.5, 3);
      }
    }

    function drawPulse(p) {
      if (!p.active) return;
      var f = nodePos(p.from), t = nodePos(p.to);
      if (!f || !t) return;

      var px = f.x + (t.x - f.x) * p.t;
      var py = f.y + (t.y - f.y) * p.t;

      // Glow halo
      var grd = ctx.createRadialGradient(px, py, 0, px, py, 10);
      grd.addColorStop(0, 'rgba(0,229,255,0.70)');
      grd.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    function drawNode(n, ts) {
      var x = n.x * W, y = n.y * H;
      var r = n.r;
      var c = n.color;
      var breath = Math.sin(ts * 0.001 * 1.2 + n.x * 10) * 0.5 + 0.5;
      var glowA = 0.35 + breath * 0.25;

      // Outer glow
      var grd = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.8);
      grd.addColorStop(0, 'rgba('+c[0]+','+c[1]+','+c[2]+','+glowA+')');
      grd.addColorStop(1, 'rgba('+c[0]+','+c[1]+','+c[2]+',0)');
      ctx.beginPath();
      ctx.arc(x, y, r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Node ring
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+',0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node fill
      ctx.beginPath();
      ctx.arc(x, y, r - 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+',0.10)';
      ctx.fill();

      // Status dot (top-right)
      ctx.beginPath();
      ctx.arc(x + r * 0.7, y - r * 0.7, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00e676';
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba('+c[0]+','+c[1]+','+c[2]+',0.90)';
      ctx.font = 'bold ' + (n.r > 14 ? '8' : '7') + 'px "Orbitron",monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, x, y + r + 10);

      // Center text for main node
      if (n.id === 'azure') {
        ctx.fillStyle = 'rgba(0,229,255,0.85)';
        ctx.font = 'bold 8px "Orbitron",monospace';
        ctx.fillText('HUB', x, y);
      }
    }

    return { init: init };
  }());

  // ═══════════════════════════════════════════════════════════════
  // 3.  METRIC BAR ANIMATION
  // ═══════════════════════════════════════════════════════════════
  function initMetrics() {
    // Animate all .cmd-mbar-fill elements to their target width
    var fills = document.querySelectorAll('.cmd-mbar-fill[data-pct]');
    // Trigger on next frame so CSS transition fires
    requestAnimationFrame(function () {
      fills.forEach(function (el) {
        el.style.width = el.getAttribute('data-pct') + '%';
      });
    });

    // Drift sync rate
    var syncEl = document.getElementById('cmd-sync-rate');
    if (syncEl) {
      setInterval(function () {
        var v = (97 + Math.random() * 2.8).toFixed(1);
        syncEl.textContent = v + '%';
      }, 3500);
    }

    // Animate fluctuating metric values
    var flucEls = document.querySelectorAll('[data-fluc]');
    flucEls.forEach(function (el) {
      var base = parseFloat(el.getAttribute('data-fluc'));
      var unit = el.getAttribute('data-unit') || '';
      setInterval(function () {
        var v = base + (Math.random() - 0.5) * base * 0.04;
        el.textContent = v.toFixed(el.getAttribute('data-dec') || 0) + unit;
      }, 2800);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 4.  LOG STREAM
  // ═══════════════════════════════════════════════════════════════
  var LogStream = (function () {
    var container;
    var MAX_LINES = 3;

    var ENTRIES = [
      { src: 'AZURE',   cls: 'cmd-log-src-azure',  msgs: [
        'KQL query executed: ExchangeAdmin | where TimeGenerated > ago(1h)',
        'Conditional Access policy evaluated — ALLOWED',
        'Alert triggered: Anomalous sign-in pattern detected',
        'Defender ATP incident #4821 — status: CONTAINED',
        'M365 mail-flow health check: PASSED',
        'Resource group audit: 0 non-compliant policies',
      ]},
      { src: 'DEFENDER', cls: 'cmd-log-src-defndr', msgs: [
        'Phishing email quarantined — threat.score: 0.97',
        'Safe Links detonated URL — verdict: MALICIOUS',
        'Attachment blocked: macro-enabled .xlsm',
        'Advanced Hunting query returned 847 events',
        'Incident auto-triage complete — severity: MEDIUM',
        'ATP Safe Attachments scan: CLEAN',
      ]},
      { src: 'ENTRA',   cls: 'cmd-log-src-entra',  msgs: [
        'MFA challenge issued — user: svc-account@corp',
        'PIM role activation: Security Reader — approved',
        'SSPR request processed — verification: SMS',
        'Sign-in risk evaluated: LOW — session allowed',
        'Identity Protection alert cleared',
        'Conditional Access: compliant device verified',
      ]},
      { src: 'AWS',     cls: 'cmd-log-src-aws',    msgs: [
        'SEV-2 incident acknowledged — response: 3.2min',
        'EC2 fleet health check: 1247/1247 healthy',
        'S3 replication lag: 0.8s — within SLA',
        'CloudWatch alarm cleared: high-CPU',
        'IAM policy audit: no drift detected',
      ]},
      { src: 'KQL',     cls: 'cmd-log-src-kql',    msgs: [
        'Scheduled query: SigninLogs | where ResultType != 0',
        'Hunt query returned 0 hits — no IOC matches',
        'Anomaly detection: baseline recalculated',
        'UEBA model updated — 14 new behavioural signatures',
      ]},
      { src: 'PYTHON',  cls: 'cmd-log-src-python',  msgs: [
        'Automation runbook executed — 42 alerts triaged',
        'API batch: 1,200 graph API calls — 0 errors',
        'Incident report generated: PDF → SharePoint',
        'Telemetry aggregator: 98k events processed',
      ]},
    ];

    function ts() {
      var n = new Date();
      var h = String(n.getUTCHours()).padStart(2,'0');
      var m = String(n.getUTCMinutes()).padStart(2,'0');
      var s = String(n.getUTCSeconds()).padStart(2,'0');
      return h+':'+m+':'+s;
    }

    function pushLine() {
      if (!container) return;
      var src  = ENTRIES[Math.floor(Math.random() * ENTRIES.length)];
      var msg  = src.msgs[Math.floor(Math.random() * src.msgs.length)];

      var line = document.createElement('div');
      line.className = 'cmd-log-line';
      line.innerHTML =
        '<span class="cmd-log-ts">['+ts()+']</span> ' +
        '<span class="'+src.cls+'">'+src.src+'</span> ' +
        '<span>› '+msg+'</span>';

      container.appendChild(line);

      // Keep only last N lines
      while (container.children.length > MAX_LINES) {
        container.removeChild(container.firstChild);
      }
    }

    function init() {
      container = document.getElementById('cmd-log-scroll');
      if (!container) return;
      // Pre-fill
      for (var i = 0; i < MAX_LINES; i++) pushLine();
      setInterval(pushLine, 3200);
    }

    return { init: init };
  }());

  // ═══════════════════════════════════════════════════════════════
  // BOOT
  // ═══════════════════════════════════════════════════════════════
  function boot() {
    initClock();
    Topology.init();
    initMetrics();
    LogStream.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
