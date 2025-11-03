'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const heroImages = PlaceHolderImages.filter(p => p.id.startsWith('hero'));
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section className="relative h-[90vh] w-full">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {heroImages.map((heroImage) => (
            <CarouselItem key={heroImage.id}>
              <div className="relative h-[90vh] w-full">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  priority={heroImages.indexOf(heroImage) === 0}
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
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
