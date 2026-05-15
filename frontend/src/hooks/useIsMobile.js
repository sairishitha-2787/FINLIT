import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    let raf;
    const handler = () => {
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handler, { passive: true });
    return () => {
      window.removeEventListener('resize', handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
  };
}
