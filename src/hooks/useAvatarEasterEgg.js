import { useEffect } from 'react';

// "Click the avatar 10 times" easter egg from the original enhanced-features.js
// (avatarEasterEgg): party mode + image overlay + theme song for 5 seconds.
// `.party-image-overlay` / `body.party-mode` styling comes from enhanced-features.css.
export function useAvatarEasterEgg() {
  useEffect(() => {
    const avatar = document.querySelector('.avatar');
    if (!avatar) return undefined;

    avatar.style.cursor = 'pointer';
    avatar.title = 'Click 10 times for surprise!';

    let clicks = 0;
    let overlay = null;
    let audio = null;
    let timer;

    const handleClick = () => {
      clicks += 1;
      if (clicks < 10) return;
      clicks = 0;

      document.body.classList.add('party-mode');
      overlay = document.createElement('div');
      overlay.className = 'party-image-overlay';
      overlay.innerHTML = `<img src="${import.meta.env.BASE_URL}assets/images/back_image.jpg" alt="Special" class="party-image">`;
      document.body.appendChild(overlay);

      audio = new Audio('https://cdn.pixabay.com/audio/2022/11/22/audio_3d52a1d6cc.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});

      timer = window.setTimeout(() => {
        document.body.classList.remove('party-mode');
        if (overlay) overlay.remove();
        if (audio) { audio.pause(); audio = null; }
      }, 5000);
    };

    avatar.addEventListener('click', handleClick);
    return () => {
      window.clearTimeout(timer);
      avatar.removeEventListener('click', handleClick);
      document.body.classList.remove('party-mode');
      if (overlay) overlay.remove();
      if (audio) audio.pause();
    };
  }, []);
}
