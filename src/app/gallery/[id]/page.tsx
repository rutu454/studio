'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParams, notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const galleryCategories = ['Diwali', 'Holi', 'Events', 'Charity'];

const allGalleryItems = PlaceHolderImages.filter((img) =>
  img.id.startsWith('gallery')
).map((img, index) => ({
  ...img,
  type: 'image' as const,
  category: galleryCategories[index % galleryCategories.length],
}));

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

const allItems = [...allGalleryItems, ...videoItems];


export default function GalleryDetailPage() {
  const params = useParams();
  const { id } = params;

  const item = allItems.find((itm) => itm.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="pt-24 bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center text-sm font-medium text-muted-foreground mb-6">
          <Link href="/gallery" className="flex items-center hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Gallery
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-primary truncate">{item.description}</span>
        </nav>

        <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground max-w-3xl">{item.description}</h1>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
            </Button>
        </div>
        
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-8">{item.category}</p>

        {item.type === 'image' ? (
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={(item.imageUrl || '').replace('/600/400', '/1200/800')}
              alt={item.description}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              data-ai-hint={item.imageHint}
            />
          </div>
        ) : (
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg aspect-video">
             <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={(item as any).videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
          </div>
        )}

      </div>
    </div>
  );
}
