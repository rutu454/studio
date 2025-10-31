'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SectionWrapper from '@/components/common/SectionWrapper';
import { useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
    <div className="pt-24">
      <SectionWrapper className="pt-0 sm:pt-0">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4 pl-0">
              <Link href="/gallery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{item.description}</h1>
            <p className="text-lg text-muted-foreground">{item.category}</p>
          </div>
          
          {item.type === 'image' ? (
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={(item.imageUrl || '').replace('/600/400', '/800/600')}
                alt={item.description}
                width={800}
                height={600}
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

          <div className="prose prose-lg max-w-none">
            <p>{item.description}. This {item.type} captures a special moment from our {item.category} activities.</p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
