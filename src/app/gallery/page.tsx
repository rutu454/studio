'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppShell from '@/components/common/AppShell';
import SectionWrapper from '@/components/common/SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
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

/* ===============================
   TYPES
================================ */
type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailBase64?: string;
};

/* ===============================
   PAGE
================================ */
export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<string>('All');

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    const db = getClientDB();

    const q = query(
      collection(db, 'galleryItems'),
      where('status', '==', true),
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

  /* ===============================
     DYNAMIC CATEGORIES
  ================================ */
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((i) => i.category).filter(Boolean))
    );
    return ['All', ...unique];
  }, [items]);

  /* ===============================
     FILTERED ITEMS
  ================================ */
  const filteredItems =
    filter === 'All'
      ? items
      : items.filter((i) => i.category === filter);

  return (
    <AppShell>
      <div className="pt-24">
        <SectionWrapper id="gallery">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Moments that Inspire
            </h1>
            <p className="text-muted-foreground">
              Events, celebrations & community work
            </p>
          </div>

          {/* 🔥 DYNAMIC CATEGORY FILTER */}
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? 'default' : 'outline'}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* 🖼 GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group">
                <CardContent className="p-0">
                  <Link href={`/gallery/${item.id}`}>
                    <div className="relative aspect-[4/3]">
                      {item.thumbnailBase64 ? (
                        <Image
                          src={item.thumbnailBase64}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-muted w-full h-full flex items-center justify-center text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <p className="font-semibold truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionWrapper>
      </div>
    </AppShell>
  );
}
