'use client';

import { useEffect, useState, useRef } from 'react';
import { Users2, Handshake, CalendarDays } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import { cn } from '@/lib/utils';

const CalendarStar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="m12 14-1.5 3 3-2-3 2 1.5 3" />
    <path d="M12 17.5l-1.5 3-1.04-.96" />
    <path d="M12 17.5l1.5 3 1.04-.96" />
    <path d="M12 14v3.5" />
    <path d="m10.5 17-3-2" />
    <path d="m13.5 17 3-2" />
  </svg>
);

interface CounterProps {
  icon: React.ElementType;
  endValue: number;
  label: string;
  isVisible: boolean;
}

const Counter: React.FC<CounterProps> = ({ icon: Icon, endValue, label, isVisible }) => {
  const [count, setCount] = useState(0);
  const duration = 2000;

  useEffect(() => {
    if (isVisible) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * endValue));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isVisible, endValue]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <p className="text-4xl font-bold font-headline">{count}+</p>
      <p className="text-lg text-muted-foreground">{label}</p>
    </div>
  );
};

const StaticCounter: React.FC<{ icon: React.ElementType; value: string; label: string }> = ({ icon: Icon, value, label }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <p className="text-4xl font-bold font-headline">{value}</p>
      <p className="text-lg text-muted-foreground">{label}</p>
    </div>
  );
};

const counters = [
  { icon: CalendarStar, endValue: 100, label: 'Events Organized' },
  { icon: Users2, endValue: 8000, label: 'People Helped' },
  { icon: Handshake, endValue: 50, label: 'Helping Hands' },
];

const allCounters = [
    { component: StaticCounter, props: { icon: CalendarDays, value: "2012", label: "Since" } },
    ...counters.map(c => ({ component: Counter, props: c }))
];

const CounterSection = () => {
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
    <SectionWrapper ref={sectionRef} className="bg-primary/10 py-0 sm:py-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
        {allCounters.map((item, index) => (
            <div 
                key={index}
                className={cn(
                    'transition-all duration-700 transform',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
            >
                <item.component {...item.props as any} isVisible={isVisible} />
            </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default CounterSection;
