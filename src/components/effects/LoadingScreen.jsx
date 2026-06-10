import { useEffect, useState } from 'react';
import { scrollToHash } from '../../utils/scrollToHash.js';

const loadingScreenStyle = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, #0a1929, #1a2332, #0d1b2a)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999999,
  transition: 'opacity 0.6s ease, visibility 0.6s ease',
};

const hiddenStyle = {
  opacity: 0,
  visibility: 'hidden',
};

// Resume-page entrance loader, ported from advanced-effects.js (loadingScreen):
// "JADE" + progress bar + "Loading Amazing Experience..." shown for 2.5s, then a
// 0.6s fade-out before it unmounts. `.loading-screen` (a full-screen z-index
// 9999999 overlay) styling comes from advanced-effects.css. Scroll is locked
// while it shows; once it clears, it scrolls to the section the visitor arrived
// at (#about / #skills / …), matching the original.
export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const targetHash = window.location.hash; // captured once at mount
    document.body.style.overflow = 'hidden';

    const timers = [];
    timers.push(window.setTimeout(() => setHidden(true), 2500));
    timers.push(window.setTimeout(() => {
      setRemoved(true);
      document.body.style.overflow = '';
      // let the restored scroll/layout settle, then bring the section into view
      timers.push(window.setTimeout(() => scrollToHash(targetHash), 120));
    }, 3100)); // 2.5s hold + 0.6s CSS fade

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflow = '';
    };
  }, []);

  if (removed) return null;
  return (
    <div
      className={hidden ? 'loading-screen hidden' : 'loading-screen'}
      style={hidden ? { ...loadingScreenStyle, ...hiddenStyle } : loadingScreenStyle}
    >
      <div className="loading-logo">JADE</div>
      <div className="loading-bar-container">
        <div className="loading-bar" />
      </div>
      <div className="loading-text">Loading Amazing Experience...</div>
    </div>
  );
}
