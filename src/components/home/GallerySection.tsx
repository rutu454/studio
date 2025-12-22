'use client';

import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '../common/SectionWrapper';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

// ✅ Import local images
import img1 from '@/assets/1.png';
import img8 from '@/assets/8.png';
import img9 from '@/assets/9.png';
import img7 from '@/assets/7.png';

type GalleryItem = {
  id: string;
  description: string;
  category: string;
  images: {
    url: string;
    hint: string;
  }[];
};

// ✅ Use the same static local images
const galleryItemsData: GalleryItem[] = [
  {
    id: 'local-1',
    description: 'દિવાળી ઉજવણી',
    category: 'Diwali',
    images: [{ url: img1.src, hint: 'local image 1' }],
  },
  {
    id: 'local-2',
    description: '“સરદોત્સવ ૨૦૨૫”',
    category: 'Sarad Utsav',
    images: [{ url: img8.src, hint: 'local image 2' }],
  },
  {
    id: 'local-3',
    description: 'કલ્યાણકારી કાર્ય',
    category: 'Events',
    images: [{ url: img9.src, hint: 'local image 3' }],
  },
  {
    id: 'local-4',
    description: 'સાપ્તાહિક બેઠક',
    category: 'Events',
    images: [{ url: img7.src, hint: 'local image 4' }],
  },
];


const GallerySection = () => {
  return (
    <SectionWrapper id="gallery">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Moments that Inspire</h2>
        <p className="text-lg text-foreground/80 mt-2">
          Moments from our journey
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryItemsData.map((item) => (
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
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-white font-bold truncate">{item.description}</h3>
              </div>
            </Link>
        ))}
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
