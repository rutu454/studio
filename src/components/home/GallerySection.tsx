'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionWrapper from '../common/SectionWrapper';
import { Button } from '@/components/ui/button';

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

/* ===============================
   FIREBASE
================================ */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

function getClientDB() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  thumbnailBase64?: string;
  isDeleted?: boolean;
};

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const db = getClientDB();

    const q = query(
      collection(db, 'galleryItems'),
      where('status', '==', true,),
      limit(4), //  ONLY 4 IMAGES
      where('isDeleted', '==', false),
    );

    const unsub = onSnapshot(q, (snap) => {
      setItems(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<GalleryItem, 'id'>),
        }))
      );
    });

    return () => unsub();
  }, []);

  return (
    <SectionWrapper id="gallery">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          Moments that Inspire
        </h2>
        <p className="text-lg text-foreground/80 mt-2">
          Moments from our journey
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/gallery/${item.id}`}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            {item.thumbnailBase64 ? (
              <Image
                src={item.thumbnailBase64}
                alt={item.title}
                fill
                className="object-content"
              />
            ) : (
              <div className="bg-muted w-full h-full flex items-center justify-center text-xs">
                No Image
              </div>
            )}

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40" />
            <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
              <h3 className="text-white font-bold truncate">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild size="lg">
          <Link href="/gallery">View More</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
