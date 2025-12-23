'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import BannerForm from '../../_components/BannerForm';
import { Skeleton } from '@/components/ui/skeleton';

interface BannerData {
  id: string;
  altText: string;
  type: 'web' | 'mobile';
  imageUrl: string; 
  createdAt: Timestamp;
}

export default function EditBannerPage() {
  const { id } = useParams();
  const bannerId = Array.isArray(id) ? id[0] : id;

  const firestore = useFirestore();
  const bannerRef = useMemoFirebase(
    () => (firestore && bannerId ? doc(firestore, 'banners', bannerId) : null),
    [firestore, bannerId]
  );

  const { data: banner, isLoading } = useDoc<BannerData>(bannerRef);

  if (isLoading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  if (!banner) {
    return <div>Banner not found.</div>;
  }

  const initialData = {
      id: banner.id,
      altText: banner.altText,
      type: banner.type,
      imageUrl: banner.imageUrl 
  }

  return (
    <div>
      <BannerForm initialData={initialData} />
    </div>
  );
}
