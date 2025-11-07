'use client';

import Image from 'next/image';
import b1 from '../../assets/prasthan group banner (3).png';
import b2 from '../../assets/prasthan group banner (4).png';
import b3 from '../../assets/prasthan group banner (6).png';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // ✅ Use your own banners
  const heroImages = [
    { id: 1, src: b1, alt: 'Banner 1' },
    { id: 2, src: b2, alt: 'Banner 2' },
    { id: 3, src: b3, alt: 'Banner 3' },
  ];

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="relative w-full h-[90vh] hidden lg:block">
      <Carousel
        setApi={setApi}
        className="w-full h-full pt-20"
        plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {heroImages.map((img, index) => (
            <CarouselItem key={img.id}>
              <div className="relative w-auto h-[75vh]">
              <Image
  src={img.src}
  alt={img.alt}
  fill
  unoptimized
  quality={100}
  className="object-cover object-center"
/>
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              'bg-white/50 backdrop-blur-sm',
              current === i ? 'w-4 bg-white' : 'hover:bg-white/80'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
