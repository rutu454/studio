'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const formSchema = z.object({
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')).optional(),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  position: z.coerce.number().int().positive({ message: 'Position must be a positive number.' }),
  status: z.boolean().default(false),
  imageFile: z.instanceof(File).optional(),
});

type MobileBanner = z.infer<typeof formSchema> & { id: string; imageUrl: string };

export default function MobileBannerPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [banners, setBanners] = useState<MobileBanner[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBanner, setEditingBanner] = useState<MobileBanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: '',
      title: '',
      position: 1,
      status: true,
    },
  });

  useEffect(() => {
    if (!firestore) return;

    const bannersCollection = collection(firestore, 'mobileBanners');
    const bannersQuery = query(bannersCollection, orderBy('position', 'asc'));

    const unsubscribe = onSnapshot(bannersQuery, (snapshot) => {
      const bannersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MobileBanner));
      setBanners(bannersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching banners:", error);
      toast({
        variant: 'destructive',
        title: 'Failed to load banners.',
        description: 'There was a problem fetching the banner list.',
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, toast]);
  
  useEffect(() => {
    if (editingBanner) {
      form.reset({
        ...editingBanner,
        imageFile: undefined, // Clear file input on edit
      });
    } else {
      form.reset({
        imageUrl: '',
        title: '',
        position: banners ? banners.length + 1 : 1,
        status: true,
        imageFile: undefined,
      });
    }
     if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [editingBanner, form, banners]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }
    
    setIsSubmitting(true);
    let finalImageUrl = values.imageUrl;

    try {
       if (values.imageFile) {
        const storage = getStorage();
        const imageRef = ref(storage, `mobileBanners/${uuidv4()}-${values.imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, values.imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const bannerData = {
        title: values.title,
        position: values.position,
        status: values.status,
        imageUrl: finalImageUrl,
      };

      if (editingBanner) {
        const bannerRef = doc(firestore, 'mobileBanners', editingBanner.id);
        await updateDoc(bannerRef, bannerData);
        toast({ title: 'Banner Updated', description: 'The banner has been updated successfully.' });
      } else {
        const bannersCollection = collection(firestore, 'mobileBanners');
        await addDoc(bannersCollection, { ...bannerData, createdAt: serverTimestamp() });
        toast({ title: 'Banner Created', description: 'The new mobile banner has been saved.' });
      }
      
      setEditingBanner(null);

    } catch (error) {
      console.error('Error saving banner: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving the banner. Please try again.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDelete = async (bannerId: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'mobileBanners', bannerId));
        toast({
            title: 'Banner Deleted',
            description: 'The banner has been removed.',
        });
    } catch (error) {
        console.error('Error deleting banner: ', error);
        toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Could not delete the banner. Please try again.',
        });
    }
  };

  const seedDummyBanners = async () => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
    const dummyBanners = [
        { title: 'Special Discount 50% OFF', position: 1, status: true, imageUrl: 'https://picsum.photos/seed/banner1/1080/1080' },
        { title: 'New Summer Collection Arrived', position: 2, status: true, imageUrl: 'https://picsum.photos/seed/banner2/1080/1080' },
        { title: 'Flash Sale - Limited Time', position: 3, status: false, imageUrl: 'https://picsum.photos/seed/banner3/1080/1080' },
        { title: 'Join Our Community Events', position: 4, status: true, imageUrl: 'https://picsum.photos/seed/banner4/1080/1080' },
    ];

    try {
        dummyBanners.forEach(banner => {
            const bannerRef = doc(collection(firestore, 'mobileBanners'));
            batch.set(bannerRef, { ...banner, createdAt: serverTimestamp() });
        });
        await batch.commit();
        toast({
            title: 'Dummy Data Seeded',
            description: '4 dummy banners have been created.',
        });
    } catch (error) {
        console.error('Error seeding dummy banners: ', error);
        toast({
            variant: 'destructive',
            title: 'Seeding Failed',
            description: 'Could not create dummy banners.',
        });
    }
  };

  const isValidUrl = (url: string | undefined | null): url is string => {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-primary mb-6">Mobile Banners</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editingBanner ? 'Edit Banner' : 'Create New Banner'}</CardTitle>
              <CardDescription>
                {editingBanner ? 'Update the details for this banner.' : 'Add a new banner for the mobile site.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                           <Input type="file" ref={fileInputRef} onChange={(e) => field.onChange(e.target.files?.[0])} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or Enter Image URL</FormLabel>
                        <FormControl>
                           <Input
                                type="text"
                                placeholder="https://example.com/image.png"
                                {...field}
                                value={field.value ?? ''}
                              />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Summer Sale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Status</FormLabel>
                           <p className="text-sm text-muted-foreground">
                             Enable to display the banner.
                           </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" disabled={isSubmitting}>{editingBanner ? 'Update Banner' : 'Save Banner'}</Button>
                    {editingBanner && (
                        <Button variant="outline" onClick={() => setEditingBanner(null)}>Cancel</Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Existing Banners</CardTitle>
                    <CardDescription>A list of all banners currently in the system.</CardDescription>
                </div>
                {!isLoading && banners && banners.length === 0 && (
                    <Button onClick={seedDummyBanners} variant="secondary">Seed Data</Button>
                )}
             </CardHeader>
             <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-12 w-24 rounded-md" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                      ))
                    ) : banners && banners.length > 0 ? (
                      banners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell>
                            {isValidUrl(banner.imageUrl) ? (
                              <Image
                                src={banner.imageUrl}
                                alt={banner.title}
                                width={100}
                                height={50}
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-12 w-24 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{banner.title}</TableCell>
                          <TableCell>{banner.position}</TableCell>
                          <TableCell>
                            <Badge variant={banner.status ? 'default' : 'secondary'}>
                              {banner.status ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setEditingBanner(banner)}>Edit</DropdownMenuItem>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the banner.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(banner.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
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
              </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </>
  );
}
