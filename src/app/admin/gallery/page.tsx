'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
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
import { PlusCircle, Video, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import GalleryActions from './_components/GalleryActions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

/* ===============================
   TYPES (MATCH FIRESTORE)
================================ */
interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  category?: string;
  thumbnailBase64?: string; // image
  url?: string; // video url
  status?: boolean;
  isDeleted?: boolean;
  createdAt?: Timestamp;
}

/* ===============================
   COMPONENT
================================ */
export default function GalleryItemsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [showDeleted, setShowDeleted] = useState(false);

  /* ===============================
     AUTH GUARD
  =============================== */
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  /* ===============================
     FIRESTORE QUERY
  =============================== */
  const galleryItemsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'galleryItems') : null),
    [firestore]
  );

  const { data: galleryItems, isLoading } =
    useCollection<GalleryItem>(galleryItemsQuery);

  /* ===============================
     FILTER
  =============================== */
  const filteredItems = useMemo(() => {
    return (
      galleryItems?.filter(
        (item) => (item.isDeleted ?? false) === showDeleted
      ) || []
    );
  }, [galleryItems, showDeleted]);

  /* ===============================
     THUMBNAIL RENDERER
  =============================== */
  const renderThumbnail = (item: GalleryItem) => {
    // 🖼 IMAGE (BASE64)
    if (item.type === 'image' && item.thumbnailBase64) {
      return (
        <Image
          src={item.thumbnailBase64}
          alt={item.title}
          width={64}
          height={64}
          unoptimized
          className="h-16 w-16 rounded-md object-cover"
        />
      );
    }

    // 🎥 VIDEO (YOUTUBE THUMBNAIL URL)
    if (item.type === 'video' && item.thumbnailBase64) {
      return (
        <Image
          src={item.thumbnailBase64}
          alt={item.title}
          width={64}
          height={64}
          className="h-16 w-16 rounded-md object-cover"
        />
      );
    }

    // ❌ FALLBACK
    return (
      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
        {item.type === 'image' ? (
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        ) : (
          <Video className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
    );
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Gallery Management
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Items</CardTitle>
          <CardDescription>
            Manage images and videos for your website gallery.
          </CardDescription>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">
                Show Deleted
              </label>
              <Switch
                checked={showDeleted}
                onCheckedChange={setShowDeleted}
              />
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
                <TableHead className="w-[100px]">
                  Thumbnail
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-16 w-16 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length ? (
                filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      item.isDeleted && 'bg-muted/50'
                    )}
                  >
                    <TableCell>
                      {renderThumbnail(item)}
                    </TableCell>

                    <TableCell className="font-medium truncate max-w-xs">
                      {item.title}
                    </TableCell>

                    <TableCell>
                      {item.category || '-'}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex gap-1 w-fit"
                      >
                        {item.type === 'image' ? (
                          <ImageIcon className="h-3 w-3" />
                        ) : (
                          <Video className="h-3 w-3" />
                        )}
                        {item.type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          item.isDeleted
                            ? 'secondary'
                            : item.status
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {item.isDeleted
                          ? 'Deleted'
                          : item.status
                          ? 'Active'
                          : 'Inactive'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <GalleryActions
                        itemId={item.id}
                        isDeleted={item.isDeleted ?? false}
                        imageUrl={item.thumbnailBase64}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24"
                  >
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
