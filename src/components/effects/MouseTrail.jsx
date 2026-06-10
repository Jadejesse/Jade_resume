import { useEffect } from 'react';

// Pastel mouse-trail particles from the original home-script.js (`homeParticles`).
// Styling comes from the global `.home-particle` rule in Home.css.
const COLORS = ['#aee9ff', '#65d6ff', '#0ea5d8', '#7dd3fc', '#ffc0cb', '#ffb6c1'];

export default function MouseTrail() {
  useEffect(() => {
    const handleMove = (event) => {
      const particle = document.createElement('div');
      particle.className = 'home-particle';
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      particle.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 1000);
    };

    document.addEventListener('mousemove', handleMove);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.querySelectorAll('.home-particle').forEach((node) => node.remove());
    };
  }, []);

  return null;
}
