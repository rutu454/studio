'use client';

import { useUser } from '@/firebase/auth/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      // If loading is finished and there's no user, redirect to login.
      if (!isUserLoading && !user) {
        router.replace('/admin/login');
      }
    }, [user, isUserLoading, router]);

    // While loading, you can show a loader or nothing.
    if (isUserLoading || !user) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // If user is logged in, render the component.
    return <WrappedComponent {...props} />;
  };
  
  WithAuthComponent.displayName = `withAuth(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

  return WithAuthComponent;
}
