import { useEffect } from 'react';

// Full-page pastel mouse-trail from the original enhanced-features.js (particleSystem).
// Uses pageX/pageY so trails land correctly over scrolled content. `.particle`
// styling comes from enhanced-features.css.
const COLORS = ['#aee9ff', '#65d6ff', '#0ea5d8', '#7dd3fc'];

export default function ResumeParticles() {
  useEffect(() => {
    const handleMove = (event) => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${event.pageX}px`;
      particle.style.top = `${event.pageY}px`;
      particle.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 1000);
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.querySelectorAll('.particle').forEach((node) => node.remove());
    };
  }, []);

  return null;
}
