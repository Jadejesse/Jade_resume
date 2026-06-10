import { useEffect } from 'react';

// Loads page-scoped stylesheets on mount and removes them on unmount, so the
// original Resume CSS (which uses body/section/h2 selectors) only applies while
// the Resume page is mounted and never leaks into other routes.
export function usePageStyles(hrefs) {
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const links = hrefs.map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${base}${href}`;
      link.dataset.pageStyle = href;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((link) => link.remove());
  }, [hrefs]);
}
