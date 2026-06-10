import { useLofiPlayer } from '../../hooks/useLofiPlayer.js';

// Lo-fi player from the original enhanced-features.js (musicPlayer).
// Shares one Audio with Home via useLofiPlayer so the two pages never overlap.
// `.music-control` styling comes from enhanced-features.css.
export default function ResumeMusic() {
  const { isPlaying, toggle } = useLofiPlayer();

  return (
    <div
      className={isPlaying ? 'music-control playing' : 'music-control'}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') toggle();
      }}
    >
      <div className="music-icon">🎵</div>
      <div className="music-text">Lo-fi Music</div>
    </div>
  );
}
