'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash, Edit, Undo } from 'lucide-react';
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
    isDeleted: boolean;
    bannerType: 'webBanners' | 'mobileBanners';
}

export default function BannerActions({ bannerId, isDeleted, bannerType }: BannerActionsProps) {
    const router = useRouter();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    
    const operation = isDeleted ? 'restore' : 'delete';
    const OperationIcon = isDeleted ? Undo : Trash;

    const handleAction = async () => {
        setIsPending(true);
        if (!firestore) {
             toast({ variant: 'destructive', title: 'Error', description: 'Firestore not available' });
             setIsPending(false);
             return;
        }

        try {
            const bannerRef = doc(firestore, bannerType, bannerId);
            await updateDoc(bannerRef, { isDeleted: !isDeleted });
            
            toast({ title: 'Success', description: `Banner ${operation}d successfully.` });
            router.refresh();

        } catch (error: any) {
            toast({ variant: 'destructive', title: `Error ${operation}ing banner`, description: error.message });
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
            <DropdownMenuItem onClick={() => router.push(`/admin/banners/edit/${bannerType}/${bannerId}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => setIsAlertOpen(true)} className={cn(isDeleted ? '' : 'text-destructive')}>
          <OperationIcon className="mr-2 h-4 w-4" />
          {isDeleted ? 'Restore' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action will {operation} the banner. {isDeleted ? 'It will become available to be shown on the website again if active.' : 'It will be hidden from the website.'}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} disabled={isPending}>
                {isPending ? 'Processing...' : 'Continue'}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
