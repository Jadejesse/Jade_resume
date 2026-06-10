# Jade Interactive Resume

Vite + React rebuild of the original vanilla HTML/CSS/JS resume. The rendered pages
stay pixel-identical to the original live site; only the codebase was modernized and
organized for future expansion. The untouched original is archived under `legacy/`.

## Structure

- `src/app` – `App.jsx` route table
- `src/pages` – route-level pages: `Home`, `Resume` (each owns its page CSS)
- `src/components/effects` – WebGL nebula background, cyberpunk FX, particles, music, dark-mode toggle, Konami easter egg
- `src/components/resume` – `SkillsRadar` (Chart.js radar)
- `src/data` – `profile`, `skills`, `experience` content (edit copy here, not in components)
- `src/hooks` – weather, clock, scroll-reveal, typewriter, Konami, avatar easter egg, and the `usePageStyles` CSS-isolation hook
- `src/styles` – `tokens`, `globals`, `animations` (bundled, app-wide)
- `public/assets/images` – deployed images (avatar, backgrounds)
- `public/legacy` – the original Resume stylesheets, loaded at runtime by the Resume page so its global `body/section/h2` selectors stay 1:1 without leaking to other routes
- `legacy/` – archived original vanilla site + docs, kept as the reference snapshot

## Commands

```bash
npm install
npm run dev      # http://localhost:5173/Jade_resume/
npm run build
npm run preview
npm run lint
```

## Deployment

GitHub Actions builds the Vite app and deploys `dist/` to GitHub Pages.
