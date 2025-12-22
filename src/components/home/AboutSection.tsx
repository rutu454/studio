'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionWrapper from '../common/SectionWrapper';
import aboutImage from '../../assets/aboutimage.jpg';
import { cn } from '@/lib/utils';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="about "ref={sectionRef} className='container mx:auto md:px-14 '>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* TEXT CONTENT */}
        <div
          className={cn(
            'space-y-6 transition-all duration-700 ease-out',
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            About Us
          </h2>

          <p className="text-lg text-foreground/80 leading-relaxed">
            Along with social service and various scientific experiences,
            Prasthan Group works in different creative fields. Through its
            social and problem-solving initiatives, the group helps people
            in need and spreads awareness. The main aim of Prasthan Group
            is to bring together youth interested in social service and
            creative activities, giving them a common platform to work
            for social betterment.
          </p>

          <Button asChild>
            <Link href="/about">Read More</Link>
          </Button>
        </div>

        {/* IMAGE */}
        <div
          className={cn(
            'relative h-80 w-full rounded-xl overflow-hidden shadow-xl transition-all duration-700 ease-out delay-200',
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          )}
        >
          <Image
            src={aboutImage}
            alt="Prasthan Group members holding Indian flags"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
