'use client';

import Image from 'next/image';
import b1 from '../../assets/prasthan group banner (3).png';
import b2 from '../../assets/prasthan group banner (4).png';
import b3 from '../../assets/prasthan group banner (6).png';
import b4 from '../../assets/prasthan group responsive banner (2).png';
import b5 from '../../assets/prasthan group responsive banner (1).png';
import b6 from '../../assets/prasthan group responsive banner.png';

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
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [currentMobile, setCurrentMobile] = useState(0);

  // ✅ Desktop banners (medium & large screens)
  const heroImages = [
    { id: 1, src: b1, alt: 'Banner 1' },
    { id: 2, src: b2, alt: 'Banner 2' },
    { id: 3, src: b3, alt: 'Banner 3' },
  ];

  // ✅ Mobile banners (small screens)
  const mobileImages = [
    { id: 4, src: b4, alt: 'Mobile Banner 1' },
    { id: 5, src: b5, alt: 'Mobile Banner 2' },
    { id: 6, src: b6, alt: 'Mobile Banner 3' },
  ];

  // ✅ Desktop carousel behavior
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => api.off('select', onSelect);
  }, [api]);

  // ✅ Mobile carousel behavior
  useEffect(() => {
    if (!mobileApi) return;
    setCurrentMobile(mobileApi.selectedScrollSnap());
    const onSelect = () => setCurrentMobile(mobileApi.selectedScrollSnap());
    mobileApi.on('select', onSelect);
    return () => mobileApi.off('select', onSelect);
  }, [mobileApi]);

  const scrollTo = (index: number) => api?.scrollTo(index);
  const scrollToMobile = (index: number) => mobileApi?.scrollTo(index);

  return (
    <>
      {/* ✅ Desktop + Medium Screens */}
      <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] hidden md:block">
        <Carousel
          setApi={setApi}
          className="w-full h-full pt-20"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {heroImages.map((img) => (
              <CarouselItem key={img.id}>
              <div className="relative w-full h-[65vh] md:h-[80vh] lg:h-[85vh] items-center">
  <Image
    src={img.src}
    alt={img.alt}
    width={1920}
    height={1080}
    priority
    unoptimized
    quality={100}
    className=" object-contain"
  />
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

      {/* ✅ Mobile Screens */}
      <section className="relative w-full h-[60vh] block md:hidden">
        <Carousel
          setApi={setMobileApi}
          className="w-full h-full pt-20"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {mobileImages.map((img) => (
              <CarouselItem key={img.id}>
                <div className="relative w-full h-[60vh]  flex justify-center items-center">
  <Image
    src={img.src}
    alt={img.alt}
    width={1080}
    height={1080}
    priority
    unoptimized
    quality={100}
    className="max-w-full max-h-full object-contain"
  />
</div>

              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Mobile Navigation Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2">
          {mobileImages.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToMobile(i)}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                'bg-white/50 backdrop-blur-sm',
                currentMobile === i ? 'w-4 bg-white' : 'hover:bg-white/80'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroSection;
