
import { initializeAdminApp } from '@/firebase/admin-init';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import HeroCarousel, { type Banner } from './HeroCarousel';

// This function now runs on the server.
async function getBanners(collectionName: 'webBanners' | 'mobileBanners'): Promise<Banner[]> {
  try {
    await initializeAdminApp();
    const db = getAdminFirestore();
    
    const bannersRef = db.collection(collectionName);
    const snapshot = await bannersRef.orderBy('position').get();

    if (snapshot.empty) {
      return [];
    }
    
    const banners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));

    // Filter in code to avoid complex queries that require indexes.
    return banners.filter(banner => banner.status === true && banner.isDeleted === false);
  } catch (error: any) {
    console.error(`Error fetching ${collectionName}:`, error.message || 'An unknown error occurred.');
    // Don't re-throw the error, just return an empty array to avoid crashing the page.
    if (error.code === 'failed-precondition' && error.message.includes('requires an index')) {
        console.error("Firestore index missing. Please create it in the Firebase console if you wish to optimize this query.");
    }
    return [];
  }
}

// This is the new Server Component
export default async function HeroSectionServerWrapper() {
  const webBanners = await getBanners('webBanners');
  const mobileBanners = await getBanners('mobileBanners');
  
  return (
    <>
      {/* Desktop + Medium Screens */}
      <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] hidden md:block pt-20">
        <HeroCarousel
            banners={webBanners}
            isLoading={false}
        />
      </section>

      {/* Mobile Screens */}
      <section className="relative w-full h-[60vh] block md:hidden pt-20">
         <HeroCarousel
            banners={mobileBanners}
            isLoading={false}
        />
      </section>
    </>
  );
}
