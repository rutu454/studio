'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import GalleryItemForm from '../../_components/GalleryItemForm';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryItemData {
  id: string;
  type: 'image' | 'video';
  title: string;
  imageUrl?: string;
  videoUrl?: string;
  status: boolean;
  isDeleted: boolean;
  createdAt: Timestamp;
}

export default function EditGalleryItemPage() {
  const params = useParams();
  const itemId = params.id as string;

  const firestore = useFirestore();
  const itemRef = useMemoFirebase(
    () => (firestore && itemId ? doc(firestore, 'galleryItems', itemId) : null),
    [firestore, itemId]
  );

  const { data: item, isLoading } = useDoc<GalleryItemData>(itemRef);

  if (isLoading) {
    return (
        <div className="space-y-4 p-4 md:p-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="space-y-8 rounded-lg border bg-card p-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-24 w-full" />
                 <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                 </div>
            </div>
        </div>
    );
  }

  if (!item) {
    return <div>Gallery item not found.</div>;
  }
  
  if (item.isDeleted) {
    return <div>This item has been deleted and cannot be edited. Please restore it first.</div>;
  }

  const initialData = {
      id: item.id,
      title: item.title,
      type: item.type,
      status: item.status,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl
  }

  return (
    <div>
      <GalleryItemForm initialData={initialData} />
    </div>
  );
}
