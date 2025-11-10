'use client';

import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import b from '../../assets/prasthan group banner (8).png';
import b1 from '../../assets/prasthan group responsive banner (6).png';

const TeamSection = () => {
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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper
      id="team"
      className="bg-[#CC0000] sm:py-4" // reduced padding (was py-0 sm:py-0)
    >
      <div
        ref={sectionRef}
        className={cn(
          'w-full flex justify-center transition-all duration-700 transform',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        )}
      >
        {/* Banner for medium and large screens */}
        <div className="hidden sm:block w-full">
          <Image
            src={b}
            alt="Prasthan Group Banner"
            width={1920}
            height={1080}
            priority
            unoptimized
            quality={100}
            className="object-contain w-full h-auto"
          />
        </div>

        {/* Banner for small screens */}
        <div className="block sm:hidden w-full">
          <Image
            src={b1}
            alt="Prasthan Group Mobile Banner"
            width={1080}
            height={1080}
            priority
            unoptimized
            quality={100}
            className="object-contain w-full h-auto"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TeamSection;
