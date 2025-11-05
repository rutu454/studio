'use client';

import { useAuth } from '@/firebase/auth/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { user, isAdmin, isUserLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Wait until the initial user loading is complete.
      if (isUserLoading) {
        return;
      }
      
      // If loading is done and there's no user, or if the user is not an admin,
      // redirect to the login page. The `isAdmin === false` check is crucial
      // to wait for the admin status to be resolved from `undefined`.
      if (!user || isAdmin === false) {
        router.replace('/admin/login');
      }

    }, [user, isAdmin, isUserLoading, router]);

    // While loading user data or checking admin status, show a loading indicator.
    // This prevents rendering the component for non-admins or before auth is ready.
    if (isUserLoading || isAdmin === undefined) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // If the user is an admin, render the wrapped component.
    // If not, the useEffect above will have already initiated a redirect.
    if (isAdmin) {
      return <WrappedComponent {...props} />;
    }
    
    // Fallback loading indicator during redirection.
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  };
  
  WithAuthComponent.displayName = `withAuth(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

  return WithAuthComponent;
}
