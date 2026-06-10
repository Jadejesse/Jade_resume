// Smooth-scrolls a hash target (e.g. "#skills") into view after the Resume loader.
// Works because Resume.jsx sets html overflow:hidden, which makes <body> the real
// scroll container (otherwise the legacy height:100% pinning traps the page and
// scrollIntoView can't move it).
export function scrollToHash(hash) {
  if (!hash || hash === '#') return;

  let target;
  try {
    target = document.querySelector(hash);
  } catch {
    return; // not a valid selector
  }
  if (!target) return;

  // Instant scroll: a smooth scroll started right as the loader unmounts gets
  // cancelled by the relayout, so it would never land. The loader fade already
  // covers the jump.
  target.scrollIntoView({ behavior: 'auto', block: 'start' });
}
