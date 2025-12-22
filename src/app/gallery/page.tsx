'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '@/components/common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';

// ✅ Import local images
import img1 from '@/assets/1.png';
import img8 from '@/assets/8.png';
import img9 from '@/assets/9.png';
import img7 from '@/assets/7.png';

const galleryCategories = ['All', 'Diwali', 'Sarad Utsav', 'Events', 'Charity', 'Holi'];

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

// ✅ Add 4 static local image items
const staticLocalImages: GalleryImageItem[] = [
  {
    id: 'local-1',
    description: 'દિવાળી ઉજવણી - દિવ્યાંગ અને મેન્ટલી ડિસેબલ સાથે પ્રસ્થાન ગ્રુપની અનોખી ઉજવણી',
    category: 'Diwali',
    type: 'image',
    images: [{ url: img1.src, hint: 'local image 1' }],
  },
  {
    id: 'local-2',
    description: 'પ્રસ્થાન ગ્રુપ દ્વારા આયોજિત “સરદોત્સવ ૨૦૨૫” - એકતા, સંસ્કૃતિ અને ઉત્સવનો મેળો',
    category: 'Sarad Utsav',
    type: 'image',
    images: [{ url: img8.src, hint: 'local image 2' }],
  },
  {
    id: 'local-3',
    description: 'દેશ અને સમાજ માટે પ્રસ્થાન ગ્રુપનું કલ્યાણકારી કાર્ય - દ્રષ્ટાંત અને પ્રતિબદ્ધતા',
    category: 'Events',
    type: 'image',
    images: [{ url: img9.src, hint: 'local image 3' }],
  },
  {
    id: 'local-4',
    description: 'સાપ્તાહિક બેઠક અને નવી વિચારસરણી - સતત મंथન અને અમલ માટેનું માધ્યમ',
    category: 'Events',
    type: 'image',
    images: [{ url: img7.src, hint: 'local image 4' }],
  },
];

// ✅ Existing gallery images from placeholder JSON
const allGalleryImageItems: GalleryImageItem[] = PlaceHolderImages.filter((p) =>
  p.id.startsWith('gallery')
).map((p, index) => {
  const categoryIndex = index % (galleryCategories.length - 1);
  return {
    id: p.id,
    description: p.imageHint || `Gallery Image ${index + 1}`,
    category: galleryCategories[categoryIndex + 1],
    type: 'image',
    images: [
      {
        url: p.imageUrl,
        hint: p.imageHint || 'gallery photo',
      },
    ],
  };
});

// ✅ Dummy video items
const videoItems = [
  {
    id: 'video-1',
    type: 'video' as const,
    description: 'Our Journey',
    category: 'Events',
    images: [
      {
        url: PlaceHolderImages.find((p) => p.id === 'video-thumbnail')?.imageUrl || '',
        hint: 'video abstract',
      },
    ],
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

// ✅ Combine all items (local images + JSON images + videos)
const allItems = [...staticLocalImages, ...allGalleryImageItems, ...videoItems].sort((a, b) =>
  a.id.localeCompare(b.id)
);

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');

  const filteredItems =
    filter === 'All'
      ? allItems
      : allItems.filter((item) => item.category === filter);

  return (
    <div className="pt-14 md:pt-0">
      <SectionWrapper className="pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Moments that Inspire
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A collection of moments from our events, celebrations, and community work.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {galleryCategories.map((category) => (
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
                      />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                        <Youtube size={64} className="text-white group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href={`/gallery/${item.id}`}
                      className="block relative w-full h-full cursor-pointer"
                    >
                      <Image
                        src={item.images[0].url}
                        alt={item.description}
                        fill
                        className="object-cover"
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