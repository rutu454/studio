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
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'image' | 'video';
  url: string;
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

    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
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

  // A single item can have multiple images if it's a carousel. For now, we assume one URL.
  // This logic can be expanded if an item can have multiple URLs.
  const images = [{ url: item.url, hint: item.title }];

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

        {item.type === 'image' ? (
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg aspect-[3/2]">
            <Image
              src={item.url}
              alt={item.title}
              fill
              className="object-cover"
              data-ai-hint={item.title}
            />
          </div>
        ) : (
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg aspect-video">
             <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={item.url.replace('watch?v=', 'embed/')}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
          </div>
        )}
        
        <div className="prose prose-lg max-w-none text-foreground/80">
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
