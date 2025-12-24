'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { deleteImage } from '@/firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Edit, Undo } from 'lucide-react';
import { cn } from '@/lib/utils';
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
} from "@/components/ui/alert-dialog";

interface GalleryActionsProps {
    itemId: string;
    isDeleted: boolean;
    imageUrl?: string;
}

export default function GalleryActions({ itemId, isDeleted, imageUrl }: GalleryActionsProps) {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    
    const operation = isDeleted ? 'restore' : 'delete';
    const OperationIcon = isDeleted ? Undo : Trash;
    const isPermanentDelete = isDeleted;

    const handleAction = async () => {
        setIsPending(true);
        if (!firestore) {
             toast({ variant: 'destructive', title: 'Error', description: 'Firestore not available' });
             setIsPending(false);
             return;
        }

        try {
            const itemRef = doc(firestore, 'galleryItems', itemId);
            if (isPermanentDelete) {
              if (imageUrl) {
                await deleteImage(imageUrl);
              }
              await deleteDoc(itemRef);
            } else {
              await updateDoc(itemRef, { isDeleted: !isDeleted });
            }
            
            toast({ title: 'Success', description: `Item ${isPermanentDelete ? 'deleted permanently' : operation + 'd'} successfully.` });
            router.refresh();

        } catch (error: any) {
            toast({ variant: 'destructive', title: `Error processing request`, description: error.message });
        } finally {
            setIsPending(false);
            setIsAlertOpen(false);
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
        {!isDeleted && (
            <DropdownMenuItem onClick={() => router.push(`/admin/gallery/edit/${itemId}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => setIsAlertOpen(true)} className={cn(isDeleted ? '' : 'text-destructive')}>
          <OperationIcon className="mr-2 h-4 w-4" />
          {isDeleted ? 'Delete Permanently' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                {isPermanentDelete 
                ? 'This action will permanently delete the gallery item and its associated image from storage. This cannot be undone.'
                : 'This action will mark the item as deleted and hide it from the gallery.'}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} disabled={isPending} className={isPermanentDelete ? 'bg-destructive hover:bg-destructive/90' : ''}>
                {isPending ? 'Processing...' : 'Continue'}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
