'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
      if (!isAuthenticated) {
        router.replace('/admin');
      }
    }
  }, [isClient, router]);

  if (!isClient || localStorage.getItem('isAdminAuthenticated') !== 'true') {
    return null; 
  }

  return <>{children}</>;
}
