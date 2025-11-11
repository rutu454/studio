'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '@/components/common/SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Image as ImageIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'image' | 'video';
  urls: string[];
  thumbnailUrl?: string;
  createdAt: any;
};

type GalleryCategory = { id: string; name: string };

const GalleryCarousel = ({ item }: { item: GalleryItem }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

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
    <div className="relative w-full aspect-[4/3]">
      <Carousel
          setApi={setApi}
          className="w-full h-full"
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
          opts={{ loop: true }}
      >
          <CarouselContent>
          {item.urls.map((url, index) => (
              <CarouselItem key={index}>
                  <Link href={`/gallery/${item.id}`} className="block relative w-full aspect-[4/3] cursor-pointer">
                      <Image
                      src={url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      data-ai-hint={item.title}
                      />
                  </Link>
              </CarouselItem>
          ))}
          </CarouselContent>
      </Carousel>
      {item.urls.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-1">
          {item.urls.map((_, i) => (
              <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                      'h-1.5 w-1.5 rounded-full transition-all duration-300',
                      'bg-white/50 backdrop-blur-sm group-hover:bg-white/80',
                      current === i ? 'w-3 bg-white' : 'hover:bg-white'
                  )}
                  aria-label={`Go to slide ${i + 1}`}
              />
          ))}
          </div>
      )}
    </div>
  );
}


export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const firestore = useFirestore();

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'galleryCategories'), orderBy('name', 'asc'));
  }, [firestore]);
  
  const itemsQuery = useMemoFirebase(() => {
    if(!firestore) return null;
    return query(collection(firestore, 'galleryItems'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: categories, isLoading: isLoadingCategories } = useCollection<GalleryCategory>(categoriesQuery);
  const { data: allItems, isLoading: isLoadingItems } = useCollection<GalleryItem>(itemsQuery);

  const galleryCategories = ['All', ...(categories?.map(c => c.name) || [])];

  const filteredItems = filter === 'All'
    ? allItems
    : allItems?.filter(item => item.category === filter);

  const isLoading = isLoadingCategories || isLoadingItems;

  return (
    <div className="pt-14 md:pt-0">
      <SectionWrapper className="pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Moments that Inspire
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A collection of moments from our events, celebrations, and community
            work.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {isLoadingCategories ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            galleryCategories.map(category => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          )))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoadingItems ? (
            Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-0">
                        <Skeleton className="w-full aspect-[4/3]" />
                        <div className="p-4 space-y-2">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-3 w-1/4" />
                        </div>
                    </CardContent>
                </Card>
            ))
          ) : filteredItems && filteredItems.length > 0 ? (
            filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
            >
              <CardContent className="p-0 flex-grow flex flex-col">
                <div className="relative w-full aspect-[4/3]">
                  {item.type === 'video' ? (
                     <Link href={`/gallery/${item.id}`} className="flex flex-col h-full">
                        {item.thumbnailUrl ? (
                            <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                data-ai-hint={item.title}
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Youtube size={64} className="text-muted-foreground" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <div className="relative z-10 text-white group-hover:text-primary transition-colors">
                                <Youtube size={64} />
                            </div>
                        </div>
                     </Link>
                  ) : item.urls && item.urls.length > 1 ? (
                    <GalleryCarousel item={item} />
                  ) : item.urls && item.urls.length === 1 ? (
                    <Link href={`/gallery/${item.id}`} className="block relative w-full h-full cursor-pointer">
                        <Image
                            src={item.urls[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                            data-ai-hint={item.title}
                        />
                    </Link>
                  ) : (
                     <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon size={64} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Link href={`/gallery/${item.id}`}>
                    <div className="p-4 mt-auto bg-card">
                        <p className="text-md font-semibold text-foreground truncate">
                        {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                        {item.category}
                        </p>
                    </div>
                </Link>
              </CardContent>
            </Card>
            ))
          ) : (
             <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No items found for this category.</p>
             </div>
          )}
        </div>
      </SectionWrapper>
    </div>
  );
}
