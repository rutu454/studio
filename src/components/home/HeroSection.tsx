'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

const HeroSection = () => {
  const heroImages = PlaceHolderImages.filter(p => p.id.startsWith('hero'));

  return (
    <section className="relative h-[90vh] w-full">
      <Carousel
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
    </section>
  );
};

export default HeroSection;
