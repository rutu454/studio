
'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  status: boolean;
  position: number;
  isDeleted: boolean;
}

const HeroCarousel = ({
  banners,
  isLoading,
}: {
  banners: Banner[] | null;
  isLoading: boolean;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => { api.off('select', onSelect) };
  }, [api]);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!banners || banners.length === 0) {
    return (
        <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No active banners found.</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              'h-2 w-2 rounded-full transition-all duration-300',
              'bg-white/50 backdrop-blur-sm',
              current === i ? 'w-4 bg-white' : 'hover:bg-white/80'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
