'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, Timestamp, query, orderBy } from 'firebase/firestore';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";
interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  status: boolean;
  position: number;
  isDeleted: boolean;
  createdAt: Timestamp;
}

const BannerTable = ({
    banners,
    isLoading,
    bannerType,
    showDeleted
}: {
    banners: Banner[] | null,
    isLoading: boolean,
    bannerType: 'webBanners' | 'mobileBanners',
    showDeleted: boolean,
}) => {
    const filteredBanners = useMemo(() => {
        // return banners?.filter(b => b.isDeleted === showDeleted) || [];
        return banners || [];
    }, [banners, showDeleted]);

    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Position</TableHead>
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
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredBanners.length > 0 ? (
                filteredBanners.map((banner) => (
                  <TableRow key={banner.id} className={cn(banner.isDeleted && 'bg-muted/50')}>
                    <TableCell>
                      {/* <img 
                        src={banner.imageUrl}
                        alt={banner.title}
                        // width={128}
                        // height={64}
                        className="rounded-md object-cover"
                      /> */}
                      {banner.imageUrl && (  <Image
    src={banner.imageUrl}
    alt={banner.title}
    width={200}
    height={100}
    priority
    unoptimized
    quality={100}
    className=" object-contain"
  />)}
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>
                        <Badge variant={banner.status && !banner.isDeleted ? 'default' : 'secondary'}>
                            {banner.isDeleted ? 'Deleted' : (banner.status ? 'Active' : 'Inactive')}
                        </Badge>
                    </TableCell>
                    <TableCell>{banner.position}</TableCell>
                    <TableCell className="text-right">
                       <BannerActions bannerId={banner.id} isDeleted={banner.isDeleted} bannerType={bannerType} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No banners found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
    );
}


export default function BannersPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  const webBannersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'webBanners'), orderBy('position')) : null),
    [firestore]
  );
  
  const mobileBannersQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'mobileBanners'), orderBy('position')) : null),
    [firestore]
  );
  
  const { data: webBanners, isLoading: webBannersLoading } = useCollection<Banner>(webBannersQuery);
  const { data: mobileBanners, isLoading: mobileBannersLoading } = useCollection<Banner>(mobileBannersQuery);

  const isLoading = isUserLoading || webBannersLoading || mobileBannersLoading;

  console.log(mobileBanners)

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
      </div>
      <Tabs defaultValue="web">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="web">Web Banners</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Banners</TabsTrigger>
        </TabsList>
        <TabsContent value="web">
             <Card>
                <CardHeader>
                  <CardTitle>Desktop Banners</CardTitle>
                  <CardDescription>
                    Manage banners for screen sizes larger than mobile.
                  </CardDescription>
                  <div className="flex items-center justify-between pt-4">
                     <div className="flex items-center space-x-2">
                        <label htmlFor="show-deleted-web" className="text-sm font-medium">Show Deleted</label>
                        <Switch id="show-deleted-web" checked={showDeleted} onCheckedChange={setShowDeleted} />
                    </div>
                    <Button asChild>
                        <Link href="/admin/banners/new?type=webBanners">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Web Banner
                        </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <BannerTable banners={webBanners} isLoading={isLoading} bannerType="webBanners" showDeleted={showDeleted} />
                </CardContent>
              </Card>
        </TabsContent>
        <TabsContent value="mobile">
             <Card>
                <CardHeader>
                  <CardTitle>Mobile Banners</CardTitle>
                  <CardDescription>
                    Manage banners specifically for mobile devices.
                  </CardDescription>
                   <div className="flex items-center justify-between pt-4">
                     <div className="flex items-center space-x-2">
                        <label htmlFor="show-deleted-mobile" className="text-sm font-medium">Show Deleted</label>
                        <Switch id="show-deleted-mobile" checked={showDeleted} onCheckedChange={setShowDeleted} />
                    </div>
                    <Button asChild>
                        <Link href="/admin/banners/new?type=mobileBanners">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Mobile Banner
                        </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <BannerTable banners={mobileBanners} isLoading={isLoading} bannerType="mobileBanners" showDeleted={showDeleted} />
                </CardContent>
              </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
