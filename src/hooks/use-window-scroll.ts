'use client';

import { useState, useEffect } from 'react';

export function useWindowScroll() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // This code will only run on the client
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}
