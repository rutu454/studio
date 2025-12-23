'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BannerActionsProps {
    bannerId: string;
    imageUrl: string;
}

export default function BannerActions({ bannerId, imageUrl }: BannerActionsProps) {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        if (!firestore) {
             toast({ variant: 'destructive', title: 'Error', description: 'Firestore not available' });
             setIsDeleting(false);
             return;
        }

        try {
            // Delete the image from Firebase Storage first
            if (imageUrl) {
                const storage = getStorage();
                const imageRef = ref(storage, imageUrl);
                await deleteObject(imageRef);
            }

            // Then delete the document from Firestore
            await deleteDoc(doc(firestore, 'banners', bannerId));
            
            toast({ title: 'Success', description: 'Banner deleted successfully.' });
            router.refresh();

        } catch (error: any) {
            // If deleting from storage fails, we still try to delete from Firestore
            // but log the storage error.
            if(error.code === 'storage/object-not-found'){
                console.warn("Image not found in storage, but proceeding to delete Firestore document.");
                await deleteDoc(doc(firestore, 'banners', bannerId));
                toast({ title: 'Success', description: 'Banner deleted. Image was not found in storage.' });
            } else {
                toast({ variant: 'destructive', title: 'Error deleting banner', description: error.message });
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/admin/banners/edit/${bannerId}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the banner
                and remove its image from storage.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Continue"}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
