'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import AppShell from '@/components/common/AppShell';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

/* ===============================
   FIREBASE CONFIG
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

/* ===============================
   TYPES
================================ */
type GalleryItem = {
  id: string;
  description: string;
  category?: string;
  title: string;
  thumbnailBase64: string;
  images?: {
    url?: string;
    hint?: string;
  }[];
};

/* ===============================
   PAGE
================================ */
export default function GalleryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH FIRESTORE DOC
  ================================ */
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const db = getClientDB();
        const ref = doc(db, 'galleryItems', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          notFound();
          return;
        }

        setItem({
          id: snap.id,
          ...(snap.data() as Omit<GalleryItem, 'id'>),
        });
      } catch (error) {
        console.error('Gallery fetch error:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return null;
  if (!item) return null;

  /* ===============================
     SAFE IMAGE URL
  ================================ */
  const imageUrl =
    item.images?.[0]?.url && item.images[0].url.trim() !== ''
      ? item.images[0].url
      : '/placeholder.jpg';

  return (
    <AppShell>
      <div className="pt-24 pb-16  bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-24">

          {/* 🔙 Back */}
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Link
              href="/gallery"
              className="inline-flex items-center hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Gallery
            </Link>

            <span className='text-xl'>›</span>

            <span className="text-primary font-medium">
              {item.title}
            </span>
          </div>


          {/* 🏷 Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {item.title}
          </h1>

          {/* 🖼 Image */}
          <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-lg mb-8">
            <Image
              src={item.thumbnailBase64}
              alt={item.description || 'Gallery image'}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 📂 Category */}
          {/* {item.category && (
            <p className="text-sm text-muted-foreground mb-4">
              Category:{' '}
              <span className="font-medium">{item.category}</span>
            </p>
          )} */}

          {/* 📝 Description */}
          <div className="text-base text-foreground/80 leading-relaxed space-y-4">
            {item.description.split('\n\n').map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
