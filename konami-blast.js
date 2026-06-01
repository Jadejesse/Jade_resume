// konami-blast.js — Explosive Konami Code visual effect
(function () {
  'use strict';

  var style = document.createElement('style');
  style.textContent = `
    @keyframes kbShake {
      0%,100%{transform:translate(0,0) rotate(0)}
      10%{transform:translate(-10px,-5px) rotate(-.6deg)}
      20%{transform:translate(10px,5px) rotate(.6deg)}
      30%{transform:translate(-8px,8px) rotate(-.4deg)}
      40%{transform:translate(8px,-8px) rotate(.4deg)}
      55%{transform:translate(-5px,5px) rotate(-.2deg)}
      70%{transform:translate(5px,-4px) rotate(.2deg)}
      85%{transform:translate(-2px,2px)}
    }
    .kb-shake { animation: kbShake 0.65s ease-in-out !important; }

    @keyframes kbFlash {
      0%{opacity:1} 25%{opacity:.7} 100%{opacity:0}
    }
    #kb-flash {
      position:fixed;inset:0;z-index:9999999;pointer-events:none;
      background:white;
      animation:kbFlash 1.0s ease-out forwards;
    }

    #kb-overlay {
      position:fixed;inset:0;z-index:9999995;
      background:rgba(0,0,0,.92);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      pointer-events:none;
      opacity:0;transition:opacity .35s ease;
      font-family:'Orbitron','Courier New',monospace;
    }
    #kb-overlay.kb-on { opacity:1; pointer-events:all; }

    @keyframes kbBlink { 0%,100%{opacity:1} 50%{opacity:0} }
    .kb-warn {
      border:2px solid #ff1744;color:#ff1744;
      padding:7px 28px;font-size:10px;letter-spacing:5px;
      margin-bottom:18px;
      animation:kbBlink .45s step-end infinite;
    }

    @keyframes kbPop {
      from{transform:scale(.3) skewX(-8deg);opacity:0}
      to  {transform:scale(1)  skewX(0deg); opacity:1}
    }
    .kb-title {
      font-size:clamp(26px,5.5vw,60px);font-weight:900;
      letter-spacing:10px;text-transform:uppercase;margin:14px 0 8px;
      background:linear-gradient(90deg,#00e5ff 0%,#e040fb 50%,#00e5ff 100%);
      background-size:200%;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      animation:kbPop .45s cubic-bezier(.2,1.6,.4,1) forwards,
                kbShimmer 1.8s linear infinite;
    }
    @keyframes kbShimmer{0%{background-position:0%}100%{background-position:200%}}

    .kb-sub {
      color:#00e5ff;font-size:13px;letter-spacing:7px;
      margin-bottom:30px;
      opacity:0;animation:kbFadeUp .4s ease forwards .55s;
    }
    @keyframes kbFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

    .kb-stats {
      display:grid;grid-template-columns:repeat(3,1fr);gap:10px;
      opacity:0;animation:kbFadeUp .4s ease forwards .85s;
    }
    .kb-stat {
      border:1px solid rgba(0,229,255,.35);padding:12px 18px;text-align:center;
      backdrop-filter:blur(4px);
    }
    .kb-stat-lbl {
      color:rgba(0,229,255,.55);font-size:9px;letter-spacing:4px;margin-bottom:5px;
    }
    .kb-stat-val { color:#00e5ff;font-size:22px;font-weight:700; }

    .kb-hint {
      position:absolute;bottom:36px;
      color:rgba(255,255,255,.35);font-size:11px;letter-spacing:4px;
      opacity:0;animation:kbFadeUp .4s ease forwards 2.2s;
    }

    @keyframes kbRainbow {
      0%  {filter:hue-rotate(0deg)   brightness(1.3) saturate(2.0)}
      50% {filter:hue-rotate(200deg) brightness(1.55) saturate(2.6)}
      100%{filter:hue-rotate(360deg) brightness(1.3) saturate(2.0)}
    }
    body.kb-rainbow { animation:kbRainbow 1.6s linear 3 !important; }

    @keyframes kbCardFlare {
      0%,100%{box-shadow:0 0 14px rgba(0,229,255,.35)}
      50%{box-shadow:0 0 60px #00e5ff,0 0 120px #e040fb,0 0 200px rgba(0,229,255,.5)!important}
    }
    body.kb-rainbow .card,
    body.kb-rainbow .card-cute {
      animation:kbCardFlare .8s ease-in-out 6 !important;
    }
  `;
  document.head.appendChild(style);

  var COLS = ['#00e5ff','#e040fb','#ff1744','#ffd740','#00e676','#ffffff','#b388ff','#18ffff'];

  function spawnParticle(x, y, angle, speed, color, life) {
    var el = document.createElement('div');
    var sz = Math.random() * 7 + 2;
    el.style.cssText = [
      'position:fixed','border-radius:50%','pointer-events:none',
      'z-index:9999996',
      'width:'+sz+'px','height:'+sz+'px',
      'left:'+x+'px','top:'+y+'px',
      'background:'+color,
      'box-shadow:0 0 '+(sz*3)+'px '+color+',0 0 '+(sz*7)+'px '+color,
      'transform:translate(-50%,-50%)'
    ].join(';');
    document.body.appendChild(el);

    var dx = Math.cos(angle) * speed;
    var dy = Math.sin(angle) * speed;
    var t0 = performance.now();
    (function tick(now) {
      var p = (now - t0) / life;
      if (p >= 1) { el.remove(); return; }
      var e = 1 - p * p;
      el.style.left    = (x + dx * p) + 'px';
      el.style.top     = (y + dy * p + 200 * p * p) + 'px';
      el.style.opacity = e;
      el.style.transform = 'translate(-50%,-50%) scale('+(e*1.3)+')';
      requestAnimationFrame(tick);
    }(performance.now()));
  }

  function burst(cx, cy, count, speedMin, speedMax, delay) {
    for (var i = 0; i < count; i++) {
      (function (i) {
        setTimeout(function () {
          var angle = (i / count) * Math.PI * 2 + (Math.random() - .5) * .5;
          var speed = speedMin + Math.random() * (speedMax - speedMin);
          var color = COLS[Math.floor(Math.random() * COLS.length)];
          var life  = 900 + Math.random() * 900;
          spawnParticle(cx, cy, angle, speed, color, life);
        }, delay + Math.random() * 180);
      }(i));
    }
  }

  function cornerBursts() {
    var W = window.innerWidth, H = window.innerHeight;
    [[0,0],[W,0],[0,H],[W,H],[W/2,0],[W/2,H],[0,H/2],[W,H/2]].forEach(function(p) {
      for (var j = 0; j < 30; j++) {
        setTimeout(function(px, py) {
          var a = Math.random() * Math.PI * 2;
          var s = 200 + Math.random() * 350;
          var c = COLS[Math.floor(Math.random() * COLS.length)];
          spawnParticle(px, py, a, s, c, 700 + Math.random() * 700);
        }.bind(null, p[0], p[1]), Math.random() * 500);
      }
    });
  }

  function buildOverlay() {
    var ov = document.getElementById('kb-overlay');
    if (ov) ov.remove();

    ov = document.createElement('div');
    ov.id = 'kb-overlay';
    ov.innerHTML =
      '<div class="kb-warn">⚠ &nbsp; NERV CENTRAL DOGMA — SECURITY BREACH &nbsp; ⚠</div>' +
      '<div class="kb-title">KONAMI ACTIVATED</div>' +
      '<div class="kb-sub">∥ &nbsp; CLASSIFIED ACCESS GRANTED &nbsp; ∥</div>' +
      '<div class="kb-stats">' +
        '<div class="kb-stat"><div class="kb-stat-lbl">SYNC RATE</div><div class="kb-stat-val" id="kb-sync">00%</div></div>' +
        '<div class="kb-stat"><div class="kb-stat-lbl">THREAT LVL</div><div class="kb-stat-val" style="color:#ff1744">OMEGA</div></div>' +
        '<div class="kb-stat"><div class="kb-stat-lbl">UNIT-01</div><div class="kb-stat-val" style="color:#00e676">ONLINE</div></div>' +
      '</div>' +
      '<div class="kb-hint">[ PRESS ANY KEY OR CLICK TO DISMISS ]</div>';
    document.body.appendChild(ov);

    // Sync rate counter
    var syncEl = ov.querySelector('#kb-sync');
    var val = 0;
    var timer = setInterval(function () {
      val = Math.min(val + Math.floor(Math.random() * 14) + 4, 100);
      syncEl.textContent = (val < 10 ? '0' : '') + val + '%';
      if (val >= 100) clearInterval(timer);
    }, 55);

    requestAnimationFrame(function () { ov.classList.add('kb-on'); });

    function dismiss() {
      ov.style.opacity = '0';
      setTimeout(function () { ov.remove(); }, 450);
      document.removeEventListener('keydown', dismiss);
      ov.removeEventListener('click', dismiss);
    }
    document.addEventListener('keydown', dismiss);
    ov.addEventListener('click', dismiss);
    setTimeout(dismiss, 7000);
  }

  window.__konamiBlast = function () {
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;

    // 1. White flash
    var flash = document.createElement('div');
    flash.id = 'kb-flash';
    document.body.appendChild(flash);
    setTimeout(function () { flash.remove(); }, 1100);

    // 2. Screen shake
    document.body.classList.add('kb-shake');
    setTimeout(function () { document.body.classList.remove('kb-shake'); }, 700);

    // 3. Centre megaburst
    burst(cx, cy, 320, 180, 700, 0);

    // 4. Second wave
    setTimeout(function () { burst(cx, cy, 200, 120, 500, 0); }, 700);

    // 5. Corner & edge bursts
    setTimeout(cornerBursts, 200);

    // 6. EVA overlay
    setTimeout(buildOverlay, 350);

    // 7. Rainbow + card flare
    document.body.classList.add('kb-rainbow');
    setTimeout(function () { document.body.classList.remove('kb-rainbow'); }, 4900);
  };

}());
