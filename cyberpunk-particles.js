// ================================================================
//  CYBERPUNK PARTICLE EFFECTS  /  赛博朋克粒子效果
//  resume.html only.
//  Injects: CRT overlay div, cursor halo div, particle sparks.
// ================================================================

(function () {
  'use strict';

  // ── CRT Scanline overlay ──────────────────────────────────────
  var crt = document.createElement('div');
  crt.id = 'cp-crt-overlay';
  document.body.appendChild(crt);

  // ── Cursor halo ──────────────────────────────────────────────
  var halo = document.createElement('div');
  halo.id = 'cp-cursor-halo';
  document.body.appendChild(halo);

  var haloX = 0, haloY = 0;
  var targetX = 0, targetY = 0;

  function lerpHalo() {
    haloX += (targetX - haloX) * 0.16;
    haloY += (targetY - haloY) * 0.16;
    halo.style.left = haloX + 'px';
    halo.style.top  = haloY + 'px';
    requestAnimationFrame(lerpHalo);
  }
  lerpHalo();

  // ── Particle colors ───────────────────────────────────────────
  var COLORS = ['#00e5ff', '#e040fb', '#00e676', '#ffd740', '#00b8d4'];

  // ── Spawn a single particle ──────────────────────────────────
  function spawnParticle(x, y, burst) {
    var el    = document.createElement('div');
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var size  = burst ? (Math.random() * 7 + 3) : (Math.random() * 4 + 2);
    var angle = Math.random() * Math.PI * 2;
    var speed = burst ? (Math.random() * 70 + 30) : (Math.random() * 40 + 15);
    var life  = burst ? (Math.random() * 800 + 400) : (Math.random() * 600 + 250);

    el.style.cssText = [
      'position:fixed',
      'border-radius:50%',
      'pointer-events:none',
      'z-index:999996',
      'background:' + color,
      'box-shadow:0 0 ' + (size * 2) + 'px ' + color + ',0 0 ' + (size * 4) + 'px ' + color,
      'width:'  + size + 'px',
      'height:' + size + 'px',
      'left:'   + x + 'px',
      'top:'    + y + 'px',
      'transform:translate(-50%,-50%)',
    ].join(';');
    document.body.appendChild(el);

    var dx    = Math.cos(angle) * speed;
    var dy    = Math.sin(angle) * speed;
    var start = performance.now();

    function tick(now) {
      var t = (now - start) / life;
      if (t >= 1) { el.remove(); return; }
      var ease = 1 - t * t;
      el.style.left      = (x + dx * t) + 'px';
      el.style.top       = (y + dy * t) + 'px';
      el.style.opacity   = ease;
      el.style.transform = 'translate(-50%,-50%) scale(' + (ease * 0.8 + 0.1) + ')';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ── Mouse move — trail particles ─────────────────────────────
  var lastSpawn = 0;
  var lastMX = 0, lastMY = 0;

  document.addEventListener('mousemove', function (e) {
    targetX = e.clientX;
    targetY = e.clientY;

    var now  = Date.now();
    var dist = Math.hypot(e.clientX - lastMX, e.clientY - lastMY);

    if (now - lastSpawn > 40 && dist > 5) {
      spawnParticle(e.clientX, e.clientY, false);
      lastSpawn = now;
      lastMX    = e.clientX;
      lastMY    = e.clientY;
    }
  });

  // ── Click burst ───────────────────────────────────────────────
  document.addEventListener('mousedown', function (e) {
    halo.style.width       = '48px';
    halo.style.height      = '48px';
    halo.style.borderColor = 'rgba(224,64,251,0.88)';
    halo.style.boxShadow   = '0 0 22px rgba(224,64,251,0.60),inset 0 0 12px rgba(224,64,251,0.15)';
    for (var i = 0; i < 10; i++) spawnParticle(e.clientX, e.clientY, true);
  });

  document.addEventListener('mouseup', function () {
    halo.style.width       = '28px';
    halo.style.height      = '28px';
    halo.style.borderColor = 'rgba(0,229,255,0.65)';
    halo.style.boxShadow   = '0 0 10px rgba(0,229,255,0.40),inset 0 0 8px rgba(0,229,255,0.08)';
  });

})();
