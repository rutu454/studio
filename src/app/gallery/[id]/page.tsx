'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useParams, notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';


const galleryCategories = ['Diwali', 'Holi', 'Events', 'Charity'];

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

const allGalleryImageItems = PlaceHolderImages.filter((p) =>
  p.id.startsWith('gallery')
).reduce((acc, current) => {
  let item = acc.find((it) => it.description === current.description);
  if (!item) {
    const categoryIndex = acc.length % (galleryCategories.length);
    item = {
      id: current.id,
      description: current.description,
      category: galleryCategories[categoryIndex],
      type: 'image',
      images: [],
    };
    acc.push(item);
  }
  item.images.push({ url: current.imageUrl, hint: current.imageHint });
  return acc;
}, [] as GalleryImageItem[]);


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
      images: [{url: 'https://picsum.photos/seed/vid2/600/400', hint: 'community work'}],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'video-3',
      type: 'video' as const,
      description: 'Diwali Gala',
      category: 'Diwali',
      images: [{url: 'https://picsum.photos/seed/vid3/600/400', hint: 'celebration festival'}],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 'video-4',
      type: 'video' as const,
      description: 'Holi Highlights',
      category: 'Holi',
      images: [{url: 'https://picsum.photos/seed/vid4/600/400', hint: 'color festival'}],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
  ];

const allItems = [...allGalleryImageItems, ...videoItems];


export default function GalleryDetailPage() {
  const params = useParams();
  const { id } = params;

  const item = allItems.find((itm) => itm.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="pt-24 bg-background">
      <div className="max-w-4xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4">
          <Link href="/gallery" className="flex items-center hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Gallery
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-primary truncate">{item.description}</span>
        </nav>

        <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground max-w-3xl">{item.description}</h1>
        </div>
        
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-6">{item.category}</p>

        {item.type === 'image' ? (
          item.images.length > 1 ? (
             <Carousel 
                className="w-full mb-8 rounded-lg overflow-hidden shadow-lg group"
                plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
                opts={{ loop: true }}
              >
                <CarouselContent>
                    {item.images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="relative aspect-[3/2]">
                            <Image
                                src={image.url}
                                alt={`${item.description} ${index + 1}`}
                                fill
                                className="object-cover"
                                data-ai-hint={image.hint}
                            />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
          ) : (
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg aspect-[3/2]">
              <Image
                src={item.images[0].url}
                alt={item.description}
                fill
                className="object-cover"
                data-ai-hint={item.images[0].hint}
              />
            </div>
          )
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
        
        <div className="prose prose-lg max-w-none text-foreground/80">
            <p>
                This is a placeholder description for the gallery item. You can replace this text with a detailed story about the event, the people in the photo, or the significance of the moment captured.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>

      </div>
    </div>
  );
}
