'use client';

import { useAuth } from '@/firebase/auth/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { isManuallySignedIn, isUserLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If auth state is not loading and the user is not manually signed in, redirect.
      if (!isUserLoading && !isManuallySignedIn) {
        router.replace('/admin/login');
      }
    }, [isManuallySignedIn, isUserLoading, router]);

    // While loading or if not signed in, show a loader.
    if (isUserLoading || !isManuallySignedIn) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // If user is manually signed in, render the component.
    return <WrappedComponent {...props} />;
  };
  
  WithAuthComponent.displayName = `withAuth(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

  return WithAuthComponent;
}
