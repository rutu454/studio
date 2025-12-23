'use client';

import { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import HeroCarousel from '@/components/home/HeroCarousel';

// 1. Setup Firebase Client Configuration (using your existing ENV variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton to ensure we don't initialize twice
function getClientDB() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

export default function HeroSection() {
  const [webBanners, setWebBanners] = useState<any[]>([]);
  const [mobileBanners, setMobileBanners] = useState<any[]>([]);
  // Start loading as true so the carousel knows to show a skeleton/spinner
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const db = getClientDB();

        // 2. Fetch both collections in parallel for speed
        // We fetch ordered by 'position' and filter status in JS (matching your previous logic)
        const [webSnap, mobileSnap] = await Promise.all([
          getDocs(query(collection(db, 'webBanners'), orderBy('position'))),
          getDocs(query(collection(db, 'mobileBanners'), orderBy('position')))
        ]);

        // Process Web Banners
        // Process Web Banners
const webData = webSnap.docs
.map((doc) => ({ id: doc.id, ...doc.data() }))
.filter((b: any) => b.status === true && b.isDeleted !== true);

// Process Mobile Banners
const mobileData = mobileSnap.docs
.map((doc) => ({ id: doc.id, ...doc.data() }))
.filter((b: any) => b.status === true && b.isDeleted !== true);


        setWebBanners(webData);
        setMobileBanners(mobileData);
      } catch (error) {
        console.error('Error fetching banners client-side:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBanners();
  }, []);

  return (
    <>
      {/* Desktop + Medium Screens */}
      <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] hidden md:block pt-20">
        <HeroCarousel
            banners={webBanners}
            isLoading={isLoading}
        />
      </section>

      {/* Mobile Screens */}
      <section className="relative w-full h-[60vh] block md:hidden pt-20">
         <HeroCarousel
            banners={mobileBanners}
            isLoading={isLoading}
        />
      </section>
    </>
  );
}