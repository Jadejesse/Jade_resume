import { useEffect } from 'react';

// Fades sections in as they enter the viewport, fills skill bars, and counts the
// percentage up — ported from the original script.js / advanced-effects.js reveal.
// The Resume page scrolls on <body> (html overflow:hidden makes body the scroll
// container), so a window-only 'scroll' listener never fires and the lower
// sections used to stay stuck at opacity:0. This uses an IntersectionObserver
// (viewport root — works regardless of which element scrolls) as the primary
// mechanism, plus window+body scroll listeners as a backup.
export function useScrollReveal() {
  useEffect(() => {
    const sections = [...document.querySelectorAll('section')];
    const skills = [...document.querySelectorAll('.skill')];
    const timers = [];

    const animateNumber = (el, target) => {
      if (!el) return;
      let current = 0;
      const increment = target / 50;
      const timer = window.setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          window.clearInterval(timer);
        }
        el.textContent = `${Math.round(current)}%`;
      }, 20);
      timers.push(timer);
    };

    skills.forEach((skill) => {
      const fill = skill.querySelector('.fill');
      const percentEl = skill.querySelector('.percent');
      if (fill) {
        fill.style.width = '0%';
        fill.classList.remove('animating');
      }
      if (percentEl) percentEl.textContent = '0%';
    });

    const animateSkill = (skill, delay = 0) => {
      if (!skill) return;
      if (skill.dataset.animated) return;
      skill.dataset.animated = '1';

      const timer = window.setTimeout(() => {
        const bar = skill.querySelector('.bar');
        const fill = skill.querySelector('.fill');
        const percentEl = skill.querySelector('.percent');
        const pct = Number(bar?.getAttribute('data-percent') || 70);

        skill.classList.add('animate');
        animateNumber(percentEl, pct);

        const fillTimer = window.setTimeout(() => {
          if (!fill) return;
          fill.style.width = `${pct}%`;
          fill.classList.add('animating');
        }, 100);
        timers.push(fillTimer);
      }, delay);
      timers.push(timer);
    };

    const inView = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight - 80 && rect.bottom > 0;
    };

    const skillInView = (el) => {
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return visible >= rect.height * 0.5;
    };

    const revealVisible = () => {
      sections.forEach((section) => {
        if (inView(section)) section.classList.add('in-view');
      });
      skills.forEach((skill, index) => {
        if (skillInView(skill)) animateSkill(skill, index * 100);
      });
    };

    // Primary: IntersectionObserver, scroll-container-agnostic.
    let sectionObserver;
    let skillObserver;
    if ('IntersectionObserver' in window) {
      sectionObserver = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
          });
        },
        { rootMargin: '0px 0px -80px 0px', threshold: 0.01 },
      );
      skillObserver = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = skills.indexOf(entry.target);
            animateSkill(entry.target, Math.max(index, 0) * 100);
          });
        },
        { threshold: 0.5 },
      );
      sections.forEach((section) => sectionObserver.observe(section));
      skills.forEach((skill) => skillObserver.observe(skill));
    }

    // Backup: reveal what is already visible, then on every scroll (body or window).
    revealVisible();
    window.addEventListener('scroll', revealVisible, { passive: true });
    document.body.addEventListener('scroll', revealVisible, { passive: true });

    return () => {
      if (sectionObserver) sectionObserver.disconnect();
      if (skillObserver) skillObserver.disconnect();
      timers.forEach((timer) => {
        window.clearTimeout(timer);
        window.clearInterval(timer);
      });
      window.removeEventListener('scroll', revealVisible);
      document.body.removeEventListener('scroll', revealVisible);
    };
  }, []);
}
