'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SmoothScrollHandler = () => {
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs when the user navigates to a new page.
    // If the URL has a hash, it means we want to scroll to a section.
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      // We use a small timeout to ensure the page has had a moment to render
      // before we try to find the element.
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname]); // The effect re-runs every time the path changes.

  return null; // This component doesn't render anything.
};

export default SmoothScrollHandler;
