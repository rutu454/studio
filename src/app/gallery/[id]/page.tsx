// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, notFound } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ArrowLeft } from 'lucide-react';

// import AppShell from '@/components/common/AppShell';

// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';

// /* ===============================
//    FIREBASE CONFIG
// ================================ */
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
// };

// function getClientDB() {
//   const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
//   return getFirestore(app);
// }

// /* ===============================
//    TYPES
// ================================ */
// type GalleryItem = {
//   id: string;
//   description: string;
//   category?: string;
//   title: string;
//   thumbnailBase64: string;
//   images?: {
//     url?: string;
//     hint?: string;
//   }[];
// };

// /* ===============================
//    PAGE
// ================================ */
// export default function GalleryDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const [item, setItem] = useState<GalleryItem | null>(null);
//   const [loading, setLoading] = useState(true);

//   /* ===============================
//      FETCH FIRESTORE DOC
//   ================================ */
//   useEffect(() => {
//     const fetchItem = async () => {
//       try {
//         const db = getClientDB();
//         const ref = doc(db, 'galleryItems', id);
//         const snap = await getDoc(ref);

//         if (!snap.exists()) {
//           notFound();
//           return;
//         }

//         setItem({
//           id: snap.id,
//           ...(snap.data() as Omit<GalleryItem, 'id'>),
//         });
//       } catch (error) {
//         console.error('Gallery fetch error:', error);
//         notFound();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItem();
//   }, [id]);

//   if (loading) return null;
//   if (!item) return null;

//   /* ===============================
//      SAFE IMAGE URL
//   ================================ */
//   const imageUrl =
//     item.images?.[0]?.url && item.images[0].url.trim() !== ''
//       ? item.images[0].url
//       : '/placeholder.jpg';

//   return (
//     <AppShell>
//       <div className="pt-24 pb-16  bg-background">
//         <div className="max-w-5xl mx-auto px-4 md:px-24">

//           {/* 🔙 Back */}
//           <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
//             <Link
//               href="/gallery"
//               className="inline-flex items-center hover:text-primary"
//             >
//               <ArrowLeft className="w-4 h-4 mr-1" />
//               Gallery
//             </Link>

//             <span className='text-xl'>›</span>

//             <span className="text-primary font-medium">
//               {item.title}
//             </span>
//           </div>


//           {/* 🏷 Title */}
//           <h1 className="text-3xl md:text-4xl font-bold mb-6">
//             {item.title}
//           </h1>

//           {/* 🖼 Image */}
//           <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-lg mb-8">
//             <Image
//               src={item.thumbnailBase64}
//               alt={item.description || 'Gallery image'}
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           {/* 📂 Category */}
//           {/* {item.category && (
//             <p className="text-sm text-muted-foreground mb-4">
//               Category:{' '}
//               <span className="font-medium">{item.category}</span>
//             </p>
//           )} */}

//           {/* 📝 Description */}
//           <div className="text-base text-foreground/80 leading-relaxed space-y-4">
//             {item.description.split('\n\n').map((para, index) => (
//               <p key={index}>{para}</p>
//             ))}
//           </div>
//         </div>
//       </div>
//     </AppShell>
//   );
// }





'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AppShell from '@/components/common/AppShell';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

/* FIREBASE */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

function getClientDB() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/* TYPE */
type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category?: string;
  thumbnailBase64?: string;
  images?: string[];
};

export default function GalleryDetailPage() {
  const { id } = useParams<{ id: string }>();

  // ✅ ALWAYS RUN — HOOK ORDER FIXED
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔥 Fetch data (always executes, no conditional return inside)
  useEffect(() => {
    const fetchData = async () => {
      const app = getClientDB();
      const db = getFirestore(app);

      const ref = doc(db, 'galleryItems', id);
      const snap = await getDoc(ref);

      setItem(snap.exists() ? ({ id: snap.id, ...snap.data() } as GalleryItem) : null);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // 🔁 Auto slider (runs always, even if no images)
  const images = item?.images ?? [];
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % images.length),
      2000
    );
    return () => clearInterval(timer);
  }, [images.length]);

  // 🚫 DON'T RETURN BEFORE HOOKS — HANDLE HERE
  if (loading) {
    return (
      <AppShell>
        <div className="pt-28 text-center text-muted-foreground text-2xl">Loading...</div>
      </AppShell>
    );
  }

  // ❗SAFE PLACE TO TRIGGER notFound()
  if (!item) {
    notFound();
    return null; // required after notFound()
  }

  return (
    <AppShell>
      <div className="pt-24 pb-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-24">

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

          <h1 className="text-3xl font-bold mb-6">{item.title}</h1>

          {/* 🖼 Single or Multiple Image Logic */}
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg shadow-lg mb-8">
            {images.length > 1 ? (
              <Image
                key={currentSlide}
                src={images[currentSlide]}
                alt={item.title}
                fill
                className="object-cover transition-all duration-700"
                unoptimized
              />
            ) : images.length === 1 ? (
              <Image
                src={images[0]}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : item.thumbnailBase64 ? (
              <Image
                src={item.thumbnailBase64}
                alt={item.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted text-xs">
                No Image Available
              </div>
            )}
          </div>

          {/* 📄 Description */}
          <p className="text-foreground/80 whitespace-pre-line">{item.description}</p>
        </div>
      </div>
    </AppShell>
  );
}
