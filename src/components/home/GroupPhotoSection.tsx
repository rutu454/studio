'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import groupPhoto from '../../assets/groupimage.jpg';
import { cn } from '@/lib/utils';

const GroupPhotoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
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
    <SectionWrapper ref={sectionRef}>
      <div
        className={cn(
          'flex justify-center items-center transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
      >
        <div className="relative w-full md:w-4/5 lg:w-4/5 overflow-hidden rounded-lg shadow-xl">
          <Image
            src={groupPhoto}
            alt="Group photo of the Prasthan team"
            width={1200}
            height={800}
            className="object-contain w-full h-auto md:max-h-screen"
            priority
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GroupPhotoSection;
