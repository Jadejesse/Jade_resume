import { useEffect, useRef, useState } from 'react';
import { useKonamiCode } from '../../hooks/useKonamiCode.js';

// Konami code -> rainbow mode + on-screen key-progress hint, from the original
// enhanced-features.js (konamiCode). `.konami-progress` (centered popup) and
// `body.konami-mode` styling come from enhanced-features.css.
const SYMBOLS = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'];

export default function KonamiEasterEgg() {
  const { progress, total, activations } = useKonamiCode();
  const [showHint, setShowHint] = useState(false);
  const hideTimer = useRef();

  // Show the progress hint as keys are pressed; auto-hide 2s after the last one.
  useEffect(() => {
    if (progress === 0) {
      setShowHint(false);
      return undefined;
    }
    setShowHint(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowHint(false), 2000);
    return () => window.clearTimeout(hideTimer.current);
  }, [progress]);

  // Activate rainbow mode each time the full code is entered.
  useEffect(() => {
    if (activations === 0) return;
    document.body.classList.add('konami-mode');
    const audio = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
    window.alert('🎮 KONAMI CODE ACTIVATED! 🎉\n\nYou found the secret! Enjoy the rainbow mode! 🌈');
  }, [activations]);

  useEffect(() => () => document.body.classList.remove('konami-mode'), []);

  if (!showHint) return null;
  return (
    <div className="konami-progress">
      {`🎮 ${progress}/${total} - ${SYMBOLS.slice(0, progress).join(' ')}`}
    </div>
  );
}
