'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);


  if (isUserLoading || !user) {
    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Card>
            <CardHeader>
            <CardTitle>Welcome, {user.displayName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <p>This is your dashboard. You can manage your site from here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
