'use client';

import { useState, useEffect, useRef } from 'react';
import SectionWrapper from '../common/SectionWrapper';
import { cn } from '@/lib/utils';

const BehindSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <SectionWrapper ref={sectionRef} className="bg-[#CC0000]">
      <div
        className={cn(
          'text-center max-w-3xl mx-auto transition-all duration-1000 ease-in-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Vision</h2>
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
          To unite and empower youth through social service and creative initiatives, fostering awareness, compassion, and innovation for a progressive and harmonious society.
        </p>
      </div>
    </SectionWrapper>
  );
};

export default BehindSection;
