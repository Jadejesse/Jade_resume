import { useEffect, useState } from 'react';

const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function useKonamiCode() {
  const [progress, setProgress] = useState(0);
  // Increments each time the full code is entered, so the consumer can re-trigger
  // the effect on every activation (a boolean would only fire once).
  const [activations, setActivations] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      setProgress((current) => {
        const next = key === sequence[current] ? current + 1 : key === sequence[0] ? 1 : 0;
        if (next === sequence.length) {
          setActivations((count) => count + 1);
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { progress, total: sequence.length, activations };
}
