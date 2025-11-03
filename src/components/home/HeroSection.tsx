'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-4">
            <CarouselPrevious className="relative translate-x-0 translate-y-0 left-0 top-0 static border-white text-white bg-black/20 hover:bg-white hover:text-primary" />
            <CarouselNext className="relative translate-x-0 translate-y-0 right-0 top-0 static border-white text-white bg-black/20 hover:bg-white hover:text-primary" />
        </div>
      </Carousel>
      <div className="absolute z-10 text-center text-white p-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg">Prasthan Group</h1>
        <p className="text-lg md:text-xl mt-4 font-body drop-shadow-md">Together we rise, together we grow.</p>
      </div>
    </section>
  );
};

export default HeroSection;
