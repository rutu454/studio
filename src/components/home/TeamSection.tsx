'use client';

import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const teamMembers = [
  { name: 'Rutu M.', role: 'Founder & CEO', imageId: 'team1' },
  { name: 'Alex Johnson', role: 'Project Director', imageId: 'team2' },
  { name: 'Priya Sharma', role: 'Community Manager', imageId: 'team3' },
  { name: 'David Chen', role: 'Lead Volunteer', imageId: 'team4' },
  { name: 'Emily White', role: 'Event Coordinator', imageId: 'team5' },
  { name: 'Michael Brown', role: 'Treasurer', imageId: 'team6' },
  { name: 'Sarah Lee', role: 'Marketing Head', imageId: 'team7' },
  { name: 'Chris Green', role: 'IT Support', imageId: 'team8' },
];

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <SectionWrapper ref={sectionRef} id="team" className="bg-muted">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Team</h2>
        <p className="text-lg text-foreground/80 mt-2">
          The faces behind Prasthan Group’s vision and strength.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 justify-center">
        {teamMembers.map((member, index) => {
          const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
          return (
            <div
              key={member.name}
              className={cn(
                'text-center group flex flex-col items-center transition-all duration-700 transform',
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative w-36 h-36 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                {memberImage && (
                  <Image
                    src={memberImage.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    data-ai-hint={memberImage.imageHint}
                  />
                )}
              </div>
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default TeamSection;
