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
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

interface Banner {
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


const HeroSection = () => {
    const [webBanners, setWebBanners] = useState<Banner[]>([]);
    const [mobileBanners, setMobileBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const firestore = useFirestore();

    useEffect(() => {
        const fetchBanners = async () => {
            if (!firestore) return;
            setIsLoading(true);
            try {
                // Fetch Web Banners
                const webBannersQuery = query(
                    collection(firestore, 'webBanners'),
                    where('status', '==', true),
                    where('isDeleted', '==', false),
                    orderBy('position')
                );
                const webBannersSnapshot = await getDocs(webBannersQuery);
                const webBannersData = webBannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
                setWebBanners(webBannersData);

                // Fetch Mobile Banners
                const mobileBannersQuery = query(
                    collection(firestore, 'mobileBanners'),
                    where('status', '==', true),
                    where('isDeleted', '==', false),
                    orderBy('position')
                );
                const mobileBannersSnapshot = await getDocs(mobileBannersQuery);
                const mobileBannersData = mobileBannersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
                setMobileBanners(mobileBannersData);

            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanners();
    }, [firestore]);


  return (
    <>
      {/* Desktop + Medium Screens */}
      <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] hidden md:block pt-20">
        <HeroCarousel
            banners={webBanners}
            isLoading={isLoading}
        />
      </section>

      {/* Mobile Screens */}
      <section className="relative w-full h-[60vh] block md:hidden pt-20">
         <HeroCarousel
            banners={mobileBanners}
            isLoading={isLoading}
        />
      </section>
    </>
  );
};

export default HeroSection;
