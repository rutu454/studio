'use client';

import { useState } from 'react';
import Image from 'next/image';
import SectionWrapper from '@/components/common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

const galleryCategories = [
  'Diwali', 'Holi', 'Events', 'Charity'
];

const allGalleryItems = PlaceHolderImages.filter(img => img.id.startsWith('gallery')).map((img, index) => ({
  ...img,
  category: galleryCategories[index % galleryCategories.length],
}));

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<(typeof allGalleryItems)[0] | null>(null);

  return (
    <div className="pt-24">
      <SectionWrapper>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Gallery</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            A collection of moments from our events, celebrations, and community work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allGalleryItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden cursor-pointer group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-0">
                    <div className="aspect-w-4 aspect-h-3">
                      <Image
                        src={item.imageUrl}
                        alt={item.description}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full"
                        data-ai-hint={item.imageHint}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-foreground truncate">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 border-0">
                <Image
                  src={item.imageUrl.replace('/600/400', '/1200/800')}
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
      </SectionWrapper>
    </div>
  );
}
