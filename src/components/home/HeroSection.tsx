
'use server';
import { initializeAdminApp, getAdminFirestore } from '@/firebase/admin-init';
import HeroCarousel from '@/components/home/HeroCarousel';

async function getBanners(collectionName: 'webBanners' | 'mobileBanners'): Promise<any[]> {
    try {
        const adminApp = initializeAdminApp();
        const firestore = getAdminFirestore(adminApp);
        
        const bannersSnapshot = await firestore.collection(collectionName).orderBy('position').get();

        if (bannersSnapshot.empty) {
            return [];
        }

        const banners = bannersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        
        // Filter in code to avoid complex queries needing indexes
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


// This is a Server Component that fetches data and passes it to a Client Component.
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
