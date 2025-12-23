'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import BannerActions from './_components/BannerActions';

interface Banner {
  id: string;
  type: 'web' | 'mobile';
  imageUrl: string;
  altText: string;
  createdAt: Timestamp;
}

export default function BannersPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const bannersRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'banners') : null),
    [firestore]
  );
  
  const { data: banners, isLoading: bannersLoading } = useCollection<Banner>(bannersRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || bannersLoading;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
        <Button asChild>
            <Link href="/admin/banners/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Banner
            </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Homepage Banners</CardTitle>
          <CardDescription>
            Manage the banners displayed in the hero section of the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Alt Text</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-16 w-32 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : banners && banners.length > 0 ? (
                banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <Image 
                        src={banner.imageUrl}
                        alt={banner.altText}
                        width={128}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{banner.altText}</TableCell>
                    <TableCell>{banner.type}</TableCell>
                    <TableCell className="text-right">
                       <BannerActions bannerId={banner.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No banners found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}