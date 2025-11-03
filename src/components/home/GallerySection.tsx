'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SectionWrapper from '../common/SectionWrapper';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

type GalleryItem = {
  id: string;
  description: string;
  category: string;
  images: {
    url: string;
    hint: string;
  }[];
};

const categories = ['All', 'Diwali', 'Holi', 'Events', 'Charity'];

// Group images by description to create gallery items
const galleryItemsData = PlaceHolderImages.filter((p) =>
  p.id.startsWith('gallery')
).reduce((acc, current) => {
  let item = acc.find((it) => it.description === current.description);
  if (!item) {
    item = {
      id: current.id,
      description: current.description,
      // Assign category cyclically, but make sure description groups have the same category
      category:
        categories[
          (acc.length % (categories.length - 1)) + 1
        ],
      images: [],
    };
    acc.push(item);
  }
  item.images.push({ url: current.imageUrl, hint: current.imageHint });
  return acc;
}, [] as GalleryItem[]);


const GallerySection = () => {
  const [filter, setFilter] = useState('All');

  const filteredItems =
    filter === 'All'
      ? galleryItemsData.slice(0, 8) // Limit to 8 items for the homepage
      : galleryItemsData.filter((item) => item.category === filter);

  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Gallery</h2>
        <p className="text-lg text-foreground/80 mt-2">
          Moments from our journey
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            onClick={() => setFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredItems.map((item) =>
          item.images.length > 1 ? (
            <Carousel
              key={item.id}
              className="w-full aspect-square group"
              plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
              opts={{ loop: true }}
            >
              <CarouselContent>
                {item.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Link href={`/gallery/${item.id}`} className="block relative w-full aspect-square rounded-lg overflow-hidden cursor-pointer">
                      <Image
                        src={image.url}
                        alt={item.description}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        data-ai-hint={image.hint}
                      />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Carousel>
          ) : (
            <Link
              href={`/gallery/${item.id}`}
              key={item.id}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            >
              <Image
                src={item.images[0].url}
                alt={item.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                data-ai-hint={item.images[0].hint}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            </Link>
          )
        )}
      </div>

      <div className="text-center mt-12">
        <Button asChild size="lg" className="rounded-md">
          <Link href="/gallery">View More</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
};

export default GallerySection;
