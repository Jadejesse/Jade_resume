import { useLofiPlayer } from '../../hooks/useLofiPlayer.js';

// City-pop / lo-fi player button from the original home-script.js (`cityPopPlayer`).
// Shares one Audio with Resume via useLofiPlayer so the two pages never overlap.
// Styling comes from the global `.home-music-control` rules in Home.css.
export default function HomeMusic() {
  const { isPlaying, toggle } = useLofiPlayer();

  return (
    <div
      className={isPlaying ? 'home-music-control playing' : 'home-music-control'}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') toggle();
      }}
    >
      <div className="home-music-icon">🎵</div>
      <div className="home-music-text">Lo-fi Music</div>
    </div>
  );
}
