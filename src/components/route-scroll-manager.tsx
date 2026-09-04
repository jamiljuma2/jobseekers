'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function RouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;

    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'auto' }));
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]);

  return null;
}
