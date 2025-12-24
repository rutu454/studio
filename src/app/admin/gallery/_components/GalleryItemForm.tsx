'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { uploadImage, deleteImage } from '@/firebase/storage';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Video, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  type: z.enum(['image', 'video']),
  status: z.boolean().default(true),
  videoUrl: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
});

export type GalleryFormValues = z.infer<typeof formSchema>;

interface GalleryItemFormProps {
  initialData?: {
    id: string;
    title: string;
    type: 'image' | 'video';
    status: boolean;
    imageUrl?: string;
    videoUrl?: string;
  };
}

export default function GalleryItemForm({ initialData }: GalleryItemFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || 'image',
      status: initialData?.status ?? true,
      videoUrl: initialData?.videoUrl || '',
    },
  });

  const itemType = form.watch('type');

  useEffect(() => {
    // When switching from video to image, clear the videoUrl
    if(itemType === 'image') {
        form.setValue('videoUrl', '');
    }
    // When switching from image to video, clear imageFile and preview
    if(itemType === 'video') {
        form.setValue('imageFile', undefined);
        setImagePreview(initialData?.imageUrl || null); // revert to original if it exists
    }
  }, [itemType, form, initialData]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: GalleryFormValues) {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }

    if (values.type === 'image' && !initialData && !values.imageFile) {
        form.setError('imageFile', { type: 'manual', message: 'An image is required.' });
        return;
    }
    if (values.type === 'video' && !values.videoUrl) {
        form.setError('videoUrl', { type: 'manual', message: 'A video URL is required.' });
        return;
    }


    setIsLoading(true);

    try {
        let imageUrl = initialData?.imageUrl;

        if (values.type === 'image' && values.imageFile) {
            // If there's an old image and we are uploading a new one, delete the old one first.
            if(initialData?.imageUrl) {
                await deleteImage(initialData.imageUrl).catch(e => console.warn("Old image deletion failed, might not exist", e));
            }
            imageUrl = await uploadImage(values.imageFile, 'galleryItems');
        }

        const dataToSave = {
            title: values.title,
            type: values.type,
            status: values.status,
            imageUrl: values.type === 'image' ? imageUrl : '',
            videoUrl: values.type === 'video' ? values.videoUrl : '',
            updatedAt: serverTimestamp(),
        };

        if (initialData) {
            const docRef = doc(firestore, 'galleryItems', initialData.id);
            await setDoc(docRef, dataToSave, { merge: true });
            toast({ title: 'Success', description: 'Gallery item updated.' });
        } else {
            await addDoc(collection(firestore, 'galleryItems'), {
                ...dataToSave,
                isDeleted: false,
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Success', description: 'Gallery item created.' });
        }

        router.push('/admin/gallery');
        router.refresh();

    } catch (error: any) {
      console.error('Error submitting gallery item: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem with your request.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Gallery Item' : 'Create New Gallery Item'}</CardTitle>
        <CardDescription>Fill out the form to add an image or video to your gallery.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Item Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                      disabled={isLoading}
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="image" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-2"><ImageIcon/> Image</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="video" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-2"><Video/> Video</FormLabel>
                      </FormItem>
                    </RadioGroup>
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
                  <FormLabel>Title / Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of the item" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {itemType === 'image' && (
               <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                     <FormControl>
                       <div className="flex items-center gap-4">
                         <Input 
                           type="file" 
                           accept="image/*" 
                           onChange={handleImageChange}
                           className="hidden"
                           id="image-upload"
                           disabled={isLoading}
                         />
                         <label htmlFor="image-upload" className="cursor-pointer">
                           <Button type="button" variant="outline" asChild disabled={isLoading}>
                             <div>
                               <Upload className="mr-2 h-4 w-4" />
                               <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                             </div>
                           </Button>
                         </label>
                         {imagePreview && (
                             <div className="relative w-32 h-32 rounded-md border overflow-hidden">
                               <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                             </div>
                         )}
                       </div>
                     </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {itemType === 'video' && (
                 <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. https://www.youtube.com/watch?v=..." {...field} disabled={isLoading} />
                        </FormControl>
                        <FormDescription>Enter the full URL of the video (e.g., from YouTube or Vimeo).</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <FormDescription>
                      Inactive items will not be shown on the website.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                {isLoading ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Item')}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
