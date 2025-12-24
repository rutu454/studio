'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { PlusCircle, Video, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import GalleryActions from './_components/GalleryActions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from "@/components/ui/switch";

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  imageUrl?: string;
  videoUrl?: string;
  status: boolean;
  isDeleted: boolean;
  createdAt: Timestamp;
}

export default function GalleryItemsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  const galleryItemsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'galleryItems'), orderBy('createdAt', 'desc')) : null),
    [firestore]
  );
  
  const { data: galleryItems, isLoading: itemsLoading } = useCollection<GalleryItem>(galleryItemsQuery);

  const isLoading = isUserLoading || itemsLoading;

  const filteredItems = useMemo(() => {
    return galleryItems?.filter(item => item.isDeleted === showDeleted) || [];
  }, [galleryItems, showDeleted]);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gallery Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gallery Items</CardTitle>
          <CardDescription>
            Manage images and videos for your website gallery.
          </CardDescription>
          <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="show-deleted" className="text-sm font-medium">Show Deleted</label>
                <Switch id="show-deleted" checked={showDeleted} onCheckedChange={setShowDeleted} />
              </div>
              <Button asChild>
                <Link href="/admin/gallery/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Gallery Item
                </Link>
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-16 w-16 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className={cn(item.isDeleted && 'bg-muted/50')}>
                    <TableCell>
                      {item.type === 'image' && item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="rounded-md object-cover h-16 w-16"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{item.title}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="capitalize">
                            {item.type === 'image' ? <ImageIcon className="mr-1 h-3 w-3" /> : <Video className="mr-1 h-3 w-3" />}
                            {item.type}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={item.status && !item.isDeleted ? 'default' : 'secondary'}>
                            {item.isDeleted ? 'Deleted' : (item.status ? 'Active' : 'Inactive')}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <GalleryActions itemId={item.id} isDeleted={item.isDeleted} imageUrl={item.imageUrl}/>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No gallery items found.
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