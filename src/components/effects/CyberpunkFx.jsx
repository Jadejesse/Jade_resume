import { useEffect } from 'react';

// CRT scanline overlay + lerped cursor halo + spark particles, ported 1:1 from
// the original cyberpunk-particles.js. Overlay/halo styling comes from cyberpunk.css.
const COLORS = ['#00e5ff', '#e040fb', '#00e676', '#ffd740', '#00b8d4'];

export default function CyberpunkFx() {
  useEffect(() => {
    const crt = document.createElement('div');
    crt.id = 'cp-crt-overlay';
    document.body.appendChild(crt);

    const halo = document.createElement('div');
    halo.id = 'cp-cursor-halo';
    document.body.appendChild(halo);

    let haloX = 0;
    let haloY = 0;
    let targetX = 0;
    let targetY = 0;
    let haloFrame;
    const lerpHalo = () => {
      haloX += (targetX - haloX) * 0.16;
      haloY += (targetY - haloY) * 0.16;
      halo.style.left = `${haloX}px`;
      halo.style.top = `${haloY}px`;
      haloFrame = window.requestAnimationFrame(lerpHalo);
    };
    lerpHalo();

    const spawnParticle = (x, y, burst) => {
      const el = document.createElement('div');
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = burst ? Math.random() * 7 + 3 : Math.random() * 4 + 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? Math.random() * 70 + 30 : Math.random() * 40 + 15;
      const life = burst ? Math.random() * 800 + 400 : Math.random() * 600 + 250;
      el.style.cssText = [
        'position:fixed', 'border-radius:50%', 'pointer-events:none', 'z-index:999996',
        `background:${color}`,
        `box-shadow:0 0 ${size * 2}px ${color},0 0 ${size * 4}px ${color}`,
        `width:${size}px`, `height:${size}px`, `left:${x}px`, `top:${y}px`,
        'transform:translate(-50%,-50%)',
      ].join(';');
      document.body.appendChild(el);
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      const start = performance.now();
      const tick = (now) => {
        const t = (now - start) / life;
        if (t >= 1) { el.remove(); return; }
        const ease = 1 - t * t;
        el.style.left = `${x + dx * t}px`;
        el.style.top = `${y + dy * t}px`;
        el.style.opacity = ease;
        el.style.transform = `translate(-50%,-50%) scale(${ease * 0.8 + 0.1})`;
        window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    };

    let lastSpawn = 0;
    let lastMX = 0;
    let lastMY = 0;
    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const now = Date.now();
      const dist = Math.hypot(e.clientX - lastMX, e.clientY - lastMY);
      if (now - lastSpawn > 40 && dist > 5) {
        spawnParticle(e.clientX, e.clientY, false);
        lastSpawn = now;
        lastMX = e.clientX;
        lastMY = e.clientY;
      }
    };
    const onDown = (e) => {
      halo.style.width = '48px';
      halo.style.height = '48px';
      halo.style.borderColor = 'rgba(224,64,251,0.88)';
      halo.style.boxShadow = '0 0 22px rgba(224,64,251,0.60),inset 0 0 12px rgba(224,64,251,0.15)';
      for (let i = 0; i < 10; i += 1) spawnParticle(e.clientX, e.clientY, true);
    };
    const onUp = () => {
      halo.style.width = '28px';
      halo.style.height = '28px';
      halo.style.borderColor = 'rgba(0,229,255,0.65)';
      halo.style.boxShadow = '0 0 10px rgba(0,229,255,0.40),inset 0 0 8px rgba(0,229,255,0.08)';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      window.cancelAnimationFrame(haloFrame);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      crt.remove();
      halo.remove();
    };
  }, []);

  return null;
}
