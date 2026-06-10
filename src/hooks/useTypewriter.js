import { useEffect } from 'react';

// Title typewriter effect from the original advanced-effects.js / enhanced-features.js.
// The full `text` is passed in explicitly (from the data layer) instead of being read
// from the DOM, so a re-run (StrictMode, HMR, fast re-nav) can never capture an
// already-cleared element and "type" an empty string — which is what intermittently
// left the subtitle blank. The cleanup always restores the COMPLETE text.
export function useTypewriter(selector, text, speed = 100) {
  useEffect(() => {
    const el = document.querySelector(selector);
    const full = text != null ? text : el?.textContent ?? '';
    if (!el || !full) return undefined;

    let index = 0;
    let timer;
    el.textContent = '';
    const type = () => {
      index += 1;
      el.textContent = full.slice(0, index);
      if (index < full.length) timer = window.setTimeout(type, speed);
    };
    timer = window.setTimeout(type, 500);

    return () => {
      window.clearTimeout(timer);
      el.textContent = full; // never leave the title blank
    };
  }, [selector, text, speed]);
}
