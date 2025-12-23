'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import HeroCarousel, { type Banner } from './HeroCarousel';

// This is the new Client Component
export default function HeroSection() {
  const firestore = useFirestore();

  const webBannersQuery = useMemoFirebase(
    () => (firestore 
      ? query(
          collection(firestore, 'webBanners'), 
          where('status', '==', true),
          where('isDeleted', '==', false),
          orderBy('position')
        )
      : null),
    [firestore]
  );
  
  const mobileBannersQuery = useMemoFirebase(
    () => (firestore 
      ? query(
          collection(firestore, 'mobileBanners'),
          where('status', '==', true),
          where('isDeleted', '==', false),
          orderBy('position')
        )
      : null),
    [firestore]
  );

  const { data: webBanners, isLoading: webBannersLoading } = useCollection<Banner>(webBannersQuery);
  const { data: mobileBanners, isLoading: mobileBannersLoading } = useCollection<Banner>(mobileBannersQuery);

  return (
    <>
      {/* Desktop + Medium Screens */}
      <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] hidden md:block pt-20">
        <HeroCarousel
            banners={webBanners}
            isLoading={webBannersLoading}
        />
      </section>

      {/* Mobile Screens */}
      <section className="relative w-full h-[60vh] block md:hidden pt-20">
         <HeroCarousel
            banners={mobileBanners}
            isLoading={mobileBannersLoading}
        />
      </section>
    </>
  );
}
