'use client';

import { useAuth } from '@/firebase/auth/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType, useState } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { user, isAdmin, isUserLoading } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<'checking' | 'admin' | 'redirecting'>('checking');

    useEffect(() => {
      // Don't do anything until Firebase has loaded the user state
      if (isUserLoading) {
        return;
      }
      
      // If there is no user, redirect to login
      if (!user) {
        setStatus('redirecting');
        router.replace('/admin/login');
        return;
      }

      // If there is a user, but we are still checking for admin status, wait.
      // isAdmin is `undefined` while the check is in progress.
      if (isAdmin === undefined) {
        setStatus('checking');
        return;
      }
      
      // If user is not an admin, redirect to login.
      if (!isAdmin) {
        setStatus('redirecting');
        router.replace('/admin/login');
        return;
      }

      // If user is an admin, allow access.
      if (isAdmin) {
        setStatus('admin');
      }

    }, [user, isAdmin, isUserLoading, router]);

    if (status !== 'admin') {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
  
  WithAuthComponent.displayName = `withAuth(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

  return WithAuthComponent;
}
