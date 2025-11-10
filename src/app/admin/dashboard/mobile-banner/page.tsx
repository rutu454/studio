'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, onSnapshot, query, orderBy, DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

const formSchema = z.object({
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  position: z.coerce.number().int().positive({ message: 'Position must be a positive number.' }),
  status: z.boolean().default(false),
});

type MobileBanner = z.infer<typeof formSchema> & { id: string };

export default function MobileBannerPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [banners, setBanners] = useState<MobileBanner[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not initialized.',
      });
      return;
    }

    try {
      const bannersCollection = collection(firestore, 'mobileBanners');
      await addDoc(bannersCollection, {
        ...values,
        createdAt: new Date(),
      });

      toast({
        title: 'Banner Created',
        description: 'The new mobile banner has been saved successfully.',
      });
      form.reset();
    } catch (error) {
      console.error('Error creating banner: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving the banner. Please try again.',
      });
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-primary mb-6">Mobile Banners</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Banner</CardTitle>
              <CardDescription>Add a new banner to be displayed on the mobile version of the site.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                           <div className="flex items-center">
                            <Input
                                type="text"
                                placeholder="https://example.com/image.png"
                                {...field}
                              />
                           </div>
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
                  <Button type="submit">Save Banner</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <Card>
             <CardHeader>
               <CardTitle>Existing Banners</CardTitle>
               <CardDescription>A list of all banners currently in the system.</CardDescription>
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
                        </TableRow>
                      ))
                    ) : banners && banners.length > 0 ? (
                      banners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell>
                            <Image
                              src={banner.imageUrl}
                              alt={banner.title}
                              width={100}
                              height={50}
                              className="rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{banner.title}</TableCell>
                          <TableCell>{banner.position}</TableCell>
                          <TableCell>
                            <Badge variant={banner.status ? 'default' : 'secondary'}>
                              {banner.status ? 'Active' : 'Inactive'}
                            </Badge>
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
              </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </>
  );
}
