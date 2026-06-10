import { useCallback, useEffect, useState } from 'react';

// One shared lo-fi player for the WHOLE app. Home and Resume both drive this
// single Audio instance, so client-side navigation can never stack two tracks.
// (The old static site avoided overlap only because each page was a full reload;
// in the SPA the previous page's audio used to keep playing under the next one.)
const PRIMARY_SRC = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3';
const FALLBACK_SRC = 'https://cdn.pixabay.com/audio/2022/03/10/audio_12b0c7443c.mp3';

let audio = null;
let autoStarted = false;

function getAudio() {
  if (audio) return audio;
  audio = new Audio(PRIMARY_SRC);
  audio.loop = true;
  audio.volume = 0.15;
  audio.addEventListener('error', () => {
    if (audio.src !== FALLBACK_SRC) {
      audio.src = FALLBACK_SRC;
      audio.load();
    }
  });
  return audio;
}

export function useLofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(() => (audio ? !audio.paused : false));

  useEffect(() => {
    const a = getAudio();
    const sync = () => setIsPlaying(!a.paused);
    a.addEventListener('play', sync);
    a.addEventListener('pause', sync);
    sync();

    // One-time auto-start (first mount ever): try autoplay, then fall back to the
    // first user interaction. Later mounts must NOT restart it, so a user's manual
    // pause is respected when navigating between routes, and listeners never stack.
    if (!autoStarted) {
      autoStarted = true;
      a.play().then(sync).catch(() => {
        const start = () => a.play().then(sync).catch(() => {});
        document.addEventListener('click', start, { once: true });
        document.addEventListener('keydown', start, { once: true });
      });
    }

    // Do NOT pause on unmount — the singleton plays continuously across routes
    // (every route renders a music control, so it always has an owner).
    return () => {
      a.removeEventListener('play', sync);
      a.removeEventListener('pause', sync);
    };
  }, []);

  const toggle = useCallback(() => {
    const a = getAudio();
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }, []);

  return { isPlaying, toggle };
}
