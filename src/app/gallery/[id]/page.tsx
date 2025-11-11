'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'image' | 'video';
  urls: string[];
  thumbnailUrl?: string;
};

export default function GalleryDetailPage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const docRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'galleryItems', id as string);
  }, [firestore, id]);

  const { data: item, isLoading } = useDoc<GalleryItem>(docRef);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (isLoading) {
    return (
      <div className="pt-24 bg-background">
        <div className="max-w-4xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-4 w-24 mb-6" />
            <Skeleton className="aspect-video w-full rounded-lg mb-8" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    );
  }

  if (!item) {
    notFound();
  }

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };


  return (
    <div className="pt-24 bg-background">
      <div className="max-w-4xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4">
          <Link href="/gallery" className="flex items-center hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Gallery
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-primary truncate">{item.title}</span>
        </nav>

        <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground max-w-3xl">{item.title}</h1>
        </div>
        
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">{item.category}</p>

        {item.type === 'image' && item.urls.length > 0 ? (
          <div className="relative mb-8">
            <Carousel
              setApi={setApi}
              className="w-full"
              plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
              opts={{ loop: true }}
            >
              <CarouselContent>
                {item.urls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={url}
                        alt={`${item.title} - ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={item.title}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {item.urls.length > 1 && (
                <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-2">
                    {item.urls.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={cn(
                        'h-2 w-2 rounded-full transition-all duration-300',
                        'bg-muted-foreground/50',
                        current === i + 1 ? 'w-4 bg-primary' : 'hover:bg-muted-foreground'
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                    ))}
                </div>
            )}
          </div>
        ) : item.type === 'video' && item.urls.length > 0 ? (
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg aspect-video">
             <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={item.urls[0].replace('watch?v=', 'embed/')}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
          </div>
        ) : (
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg aspect-[3/2] bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No media available.</p>
            </div>
        )}
        
        <div className="prose prose-lg max-w-none text-foreground/80 mt-12">
            {item.description ? (
                <p>{item.description}</p>
            ) : (
                <p>No description provided for this item.</p>
            )}
        </div>

      </div>
    </div>
  );
}
