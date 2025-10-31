'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import SectionWrapper from '@/components/common/SectionWrapper';
import { useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function GalleryDetailPage() {
  const params = useParams();
  const { id } = params;

  const item = PlaceHolderImages.find((img) => img.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="pt-24">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline" className="mb-8">
              <Link href="/gallery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gallery
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{item.description}</h1>
            <p className="text-lg text-muted-foreground">{item.category}</p>
          </div>
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={item.imageUrl.replace('/600/400', '/1200/800')}
              alt={item.description}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              data-ai-hint={item.imageHint}
            />
          </div>
          <div className="prose prose-lg max-w-none">
            <p>{item.description}. This image captures a special moment from our {item.category} activities.</p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
