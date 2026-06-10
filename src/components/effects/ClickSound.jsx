import { useEffect } from 'react';

// Global click "tile" sound, ported 1:1 from the original home-script.js
// (`homeClickSound`) and enhanced-features.js (`soundEffects`): every click in
// the capture phase plays a short mixkit SFX. This is the sound you hear when
// clicking the avatar (and everything else).
const CLICK_SRC = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';

export default function ClickSound() {
  useEffect(() => {
    // Warm the browser cache so the very first click isn't delayed.
    new Audio(CLICK_SRC).load();

    const handleClick = () => {
      const sound = new Audio(CLICK_SRC);
      sound.volume = 0.3;
      sound.play().catch(() => {});
    };

    // Capture phase so it fires before any stopPropagation on inner handlers.
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
