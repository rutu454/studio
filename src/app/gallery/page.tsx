'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '@/components/common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const galleryCategories = ['All', 'Diwali', 'Holi', 'Events', 'Charity'];

type GalleryImageItem = {
  id: string;
  description: string;
  category: string;
  type: 'image';
  images: {
    url: string;
    hint: string;
  }[];
};

// Group images by description to create gallery items
const allGalleryImageItems = PlaceHolderImages.filter((p) =>
  p.id.startsWith('gallery')
).reduce((acc, current) => {
  let item = acc.find((it) => it.description === current.description);
  if (!item) {
    const categoryIndex = acc.length % (galleryCategories.length - 1);
    item = {
      id: current.id, // Use the first image's ID as the group ID
      description: current.description,
      category: galleryCategories[categoryIndex + 1],
      type: 'image',
      images: [],
    };
    acc.push(item);
  }
  item.images.push({ url: current.imageUrl, hint: current.imageHint });
  return acc;
}, [] as GalleryImageItem[]);


// Add dummy video items
const videoItems = [
  {
    id: 'video-1',
    type: 'video' as const,
    description: 'Our Journey',
    category: 'Events',
    images: [{
      url: PlaceHolderImages.find((p) => p.id === 'video-thumbnail')?.imageUrl || '',
      hint: 'video abstract',
    }],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'video-2',
    type: 'video' as const,
    description: 'Community Outreach',
    category: 'Charity',
    images: [{ url: 'https://picsum.photos/seed/vid2/600/400', hint: 'community work' }],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'video-3',
    type: 'video' as const,
    description: 'Diwali Gala',
    category: 'Diwali',
    images: [{ url: 'https://picsum.photos/seed/vid3/600/400', hint: 'celebration festival' }],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'video-4',
    type: 'video' as const,
    description: 'Holi Highlights',
    category: 'Holi',
    images: [{ url: 'https://picsum.photos/seed/vid4/600/400', hint: 'color festival' }],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

const allItems = [...allGalleryImageItems, ...videoItems].sort((a, b) => a.id.localeCompare(b.id));

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');

  const filteredItems = filter === 'All'
    ? allItems
    : allItems.filter(item => item.category === filter);

  return (
    <div className="pt-14 md:pt-0">
      <SectionWrapper className="pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A collection of moments from our events, celebrations, and community
            work.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {galleryCategories.map(category => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
            >
              <CardContent className="p-0 flex-grow flex flex-col">
                <div className="relative w-full aspect-[4/3]">
                  {item.type === 'video' ? (
                     <Link href={`/gallery/${item.id}`} className="flex flex-col h-full">
                        <Image
                            src={item.images[0].url}
                            alt={item.description}
                            fill
                            className="object-cover"
                            data-ai-hint={item.images[0].hint}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                            <div className="relative z-10 text-white group-hover:text-primary transition-colors">
                                <Youtube size={64} />
                            </div>
                        </div>
                     </Link>
                  ) : item.images.length > 1 ? (
                    <Carousel
                        className="w-full h-full"
                        plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
                        opts={{ loop: true }}
                    >
                        <CarouselContent>
                        {item.images.map((image, index) => (
                            <CarouselItem key={index}>
                                <Link href={`/gallery/${item.id}`} className="block relative w-full aspect-[4/3] cursor-pointer">
                                    <Image
                                    src={image.url}
                                    alt={item.description}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={image.hint}
                                    />
                                </Link>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Carousel>
                  ) : (
                    <Link href={`/gallery/${item.id}`} className="block relative w-full h-full cursor-pointer">
                        <Image
                            src={item.images[0].url}
                            alt={item.description}
                            fill
                            className="object-cover"
                            data-ai-hint={item.images[0].hint}
                        />
                    </Link>
                  )}
                </div>
                <Link href={`/gallery/${item.id}`}>
                    <div className="p-4 mt-auto bg-card">
                        <p className="text-md font-semibold text-foreground truncate">
                        {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                        {item.category}
                        </p>
                    </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}