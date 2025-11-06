'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, Handshake, CalendarDays } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';

interface CounterProps {
  icon: React.ElementType;
  endValue: number;
  label: string;
}

const Counter: React.FC<CounterProps> = ({ icon: Icon, endValue, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const duration = 2000;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [endValue]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
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
  { icon: CalendarDays, endValue: 100, label: 'Events Organized' },
  { icon: Users, endValue: 8000, label: 'People Helped' },
  { icon: Handshake, endValue: 50, label: 'Helping Hands' },
];

const CounterSection = () => {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StaticCounter icon={CalendarDays} value="2012" label="Since" />
        {counters.map((counter, index) => (
          <Counter key={index} {...counter} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default CounterSection;
