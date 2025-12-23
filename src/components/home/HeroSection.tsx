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
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Banner {
  id: string;
  type: 'web' | 'mobile';
  imageUrl: string;
  altText: string;
}

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [currentMobile, setCurrentMobile] = useState(0);

  const firestore = useFirestore();

  const webBannersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'banners'), where('type', '==', 'web'))
        : null,
    [firestore]
  );
  const mobileBannersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'banners'), where('type', '==', 'mobile'))
        : null,
    [firestore]
  );

  const { data: webBanners, isLoading: webLoading } =
    useCollection<Banner>(webBannersQuery);
  const { data: mobileBanners, isLoading: mobileLoading } =
    useCollection<Banner>(mobileBannersQuery);

  useEffect(() => {
    if (!api) return undefined;

    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!mobileApi) return undefined; 

    setCurrentMobile(mobileApi.selectedScrollSnap());
    const onSelect = () => setCurrentMobile(mobileApi.selectedScrollSnap());
    mobileApi.on('select', onSelect);

    return () => {
      mobileApi.off('select', onSelect);
    };
  }, [mobileApi]);

  const scrollTo = (index: number) => api?.scrollTo(index);
  const scrollToMobile = (index: number) => mobileApi?.scrollTo(index);

  return (
    <>
      {/* Desktop + Medium Screens */}
      <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] hidden md:block pt-20">
        {webLoading || !webBanners ? (
           <Skeleton className="w-full h-full" />
        ) : (
          webBanners.length > 0 && (
            <>
              <Carousel
                setApi={setApi}
                className="w-full h-full"
                plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {webBanners.map((img) => (
                    <CarouselItem key={img.id}>
                      <div className="relative w-full h-full">
                        <Image
                          src={img.imageUrl}
                          alt={img.altText}
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
                {webBanners.map((_, i) => (
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
            </>
          )
        )}
      </section>

      {/* Mobile Screens */}
      <section className="relative w-full h-[60vh] block md:hidden pt-20">
        {mobileLoading || !mobileBanners ? (
          <Skeleton className="w-full h-full" />
        ) : (
          mobileBanners.length > 0 && (
            <>
              <Carousel
                setApi={setMobileApi}
                className="w-full h-full"
                plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {mobileBanners.map((img) => (
                    <CarouselItem key={img.id}>
                      <div className="relative w-full h-full">
                        <Image
                          src={img.imageUrl}
                          alt={img.altText}
                          fill
                          priority
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">
                {mobileBanners.map((_, i) => (
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
            </>
          )
        )}
      </section>
    </>
  );
};

export default HeroSection;
