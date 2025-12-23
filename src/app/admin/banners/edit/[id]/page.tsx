'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import BannerForm from '../../_components/BannerForm';
import { Skeleton } from '@/components/ui/skeleton';

interface BannerData {
  id: string;
  title: string;
  position: number;
  status: boolean;
  imageUrl: string; 
  isDeleted: boolean;
  createdAt: Timestamp;
}

export default function EditBannerPage() {
  const params = useParams();
  // id is now an array: [bannerType, bannerId]
  const bannerType = params.id?.[0] as 'webBanners' | 'mobileBanners';
  const bannerId = params.id?.[1] as string;

  const firestore = useFirestore();
  const bannerRef = useMemoFirebase(
    () => (firestore && bannerType && bannerId ? doc(firestore, bannerType, bannerId) : null),
    [firestore, bannerType, bannerId]
  );

  const { data: banner, isLoading } = useDoc<BannerData>(bannerRef);

  if (!bannerType || !bannerId) {
    return <div>Invalid URL.</div>;
  }

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
  
  if (banner.isDeleted) {
    return <div>This banner has been deleted and cannot be edited. Please restore it first.</div>;
  }

  const initialData = {
      id: banner.id,
      title: banner.title,
      position: banner.position,
      status: banner.status,
      imageUrl: banner.imageUrl 
  }

  return (
    <div>
      <BannerForm initialData={initialData} bannerType={bannerType} />
    </div>
  );
}
