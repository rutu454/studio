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
  // With a catch-all route [...id], `params.id` will be an array of the segments.
  // e.g., for /edit/webBanners/xyz, params.id will be ['webBanners', 'xyz']
  const idSegments = params.id as string[];
  const bannerType = idSegments?.[0] as 'webBanners' | 'mobileBanners';
  const bannerId = idSegments?.[1] as string;

  const firestore = useFirestore();
  const bannerRef = useMemoFirebase(
    () => (firestore && bannerType && bannerId ? doc(firestore, bannerType, bannerId) : null),
    [firestore, bannerType, bannerId]
  );

  const { data: banner, isLoading } = useDoc<BannerData>(bannerRef);

  if (!bannerType || !bannerId) {
    return <div>Invalid URL. Banner type or ID is missing.</div>;
  }

  if (isLoading) {
    return (
        <div className="space-y-4 p-4 md:p-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="space-y-8 rounded-lg border bg-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
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
