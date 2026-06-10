import { useEffect, useState } from 'react';

// Dark-mode toggle from the original enhanced-features.js (darkMode).
// `.dark-mode-toggle` + `body.dark-mode` styling comes from style.css / enhanced-features.css.
export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', String(isDark));
    return () => document.body.classList.remove('dark-mode');
  }, [isDark]);

  return (
    <div
      className="dark-mode-toggle"
      onClick={() => setIsDark((value) => !value)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') setIsDark((value) => !value);
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </div>
  );
}
