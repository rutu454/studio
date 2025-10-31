'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '@/components/common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

const galleryCategories = ['Diwali', 'Holi', 'Events', 'Charity'];

const allGalleryItems = PlaceHolderImages.filter((img) =>
  img.id.startsWith('gallery')
).map((img, index) => ({
  ...img,
  type: 'image' as const,
  category: galleryCategories[index % galleryCategories.length],
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

// Intersperse videos with images
let itemsWithVideos = [...allGalleryItems];
itemsWithVideos.splice(2, 0, videoItems[0]);
itemsWithVideos.splice(5, 0, videoItems[1]);
itemsWithVideos.splice(8, 0, videoItems[2]);
itemsWithVideos.splice(11, 0, videoItems[3]);

export default function GalleryPage() {
  const [selectedVideo, setSelectedVideo] = useState<typeof videoItems[0] | null>(null);

  return (
    <div className="pt-24">
      <SectionWrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Gallery
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A collection of moments from our events, celebrations, and community
            work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {itemsWithVideos.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
            >
              {item.type === 'image' ? (
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
              ) : (
                <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
                  <DialogTrigger asChild onClick={() => setSelectedVideo(item)}>
                    <div className="cursor-pointer flex flex-col h-full">
                       <CardContent className="p-0 flex-grow flex flex-col">
                        <div className="relative w-full aspect-[4/3] bg-slate-900 flex items-center justify-center">
                           <div className="absolute inset-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.description}
                              fill
                              className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                              data-ai-hint={item.imageHint}
                            />
                          </div>
                           <div className="relative z-10 text-white group-hover:text-primary transition-colors">
                            <Youtube size={64} />
                          </div>
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
                    </div>
                  </DialogTrigger>
                  {selectedVideo && selectedVideo.id === item.id && (
                    <DialogContent className="max-w-3xl w-full p-0">
                       <DialogHeader className="p-4">
                        <DialogTitle>{selectedVideo.description}</DialogTitle>
                         <DialogDescription>
                          {selectedVideo.category}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="aspect-video">
                        <iframe
                          className="w-full h-full"
                          src={selectedVideo.videoUrl}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              )}
            </Card>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
}
