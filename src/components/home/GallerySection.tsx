'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SectionWrapper from '../common/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const categories = ['All', 'Diwali', 'Holi', 'Events', 'Charity'];
const galleryItemsData = PlaceHolderImages.filter(p => p.id.startsWith('gallery')).slice(0, 8).map((img, index) => ({
  ...img,
  category: categories[(index % (categories.length - 1)) + 1],
}));

const GallerySection = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems = filter === 'All'
    ? galleryItemsData
    : galleryItemsData.filter(item => item.category === filter);

  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Gallery</h2>
        <p className="text-lg text-foreground/80 mt-2">Moments from our journey</p>
      </div>
      
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {categories.map(category => (
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
        {filteredItems.map(item => (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group">
                <Image
                  src={item.imageUrl}
                  alt={item.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint={item.imageHint}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 border-0">
               <Image
                  src={item.imageUrl.replace('/600/400', '/1200/800').replace('/400/600', '/800/1200')}
                  alt={item.description}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain rounded-lg"
                  data-ai-hint={item.imageHint}
                />
            </DialogContent>
          </Dialog>
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
