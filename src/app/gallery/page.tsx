'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '@/components/common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';

const galleryCategories = ['All', 'Diwali', 'Holi', 'Events', 'Charity'];

const allGalleryImageItems = PlaceHolderImages.filter((img) =>
  img.id.startsWith('gallery')
).map((img, index) => ({
  ...img,
  type: 'image' as const,
  category: galleryCategories[(index % (galleryCategories.length -1)) + 1],
}));

// Add dummy video items
const videoItems = [
  {
    id: 'video-1',
    type: 'video' as const,
    description: 'Our Journey',
    category: 'Events',
    imageUrl:
      PlaceHolderImages.find((p) => p.id === 'video-thumbnail')?.imageUrl || '',
    imageHint: 'video abstract',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'video-2',
    type: 'video' as const,
    description: 'Community Outreach',
    category: 'Charity',
    imageUrl: 'https://picsum.photos/seed/vid2/600/400',
    imageHint: 'community work',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'video-3',
    type: 'video' as const,
    description: 'Diwali Gala',
    category: 'Diwali',
    imageUrl: 'https://picsum.photos/seed/vid3/600/400',
    imageHint: 'celebration festival',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 'video-4',
    type: 'video' as const,
    description: 'Holi Highlights',
    category: 'Holi',
    imageUrl: 'https://picsum.photos/seed/vid4/600/400',
    imageHint: 'color festival',
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
    <div className="pt-24">
      <SectionWrapper className="pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A collection of moments from our events, celebrations, and community
            work.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
            >
              <Link
                  href={`/gallery/${item.id}`}
                  className="flex flex-col h-full"
                >
                <CardContent className="p-0 flex-grow flex flex-col">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={item.imageUrl}
                      alt={item.description}
                      fill
                      className="object-cover"
                      data-ai-hint={item.imageHint}
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                        <div className="relative z-10 text-white group-hover:text-primary transition-colors">
                          <Youtube size={64} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 mt-auto bg-card">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}
