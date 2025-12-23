
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  position: z.coerce.number().min(0, 'Position must be a positive number'),
  status: z.boolean().default(true),
  // The image is now a Base64 string
  image: z.string().refine(val => val.startsWith('data:image/'), 'Image is required.'),
});

export type BannerFormValues = z.infer<typeof formSchema>;

interface BannerFormProps {
  bannerType: 'webBanners' | 'mobileBanners';
  initialData?: {
      id: string;
      title: string;
      position: number;
      status: boolean;
      imageUrl: string;
  };
}

export default function BannerForm({ initialData, bannerType }: BannerFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // This will now hold the base64 string
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      position: initialData?.position || 0,
      status: initialData?.status ?? true,
      image: initialData?.imageUrl || undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue('image', base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: BannerFormValues) {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }

    setIsLoading(true);

    try {
        const bannerData = {
            title: values.title,
            position: values.position,
            status: values.status,
            // The image value from the form is now the base64 string
            imageUrl: values.image, 
        };

        if (initialData?.id) {
            const docRef = doc(firestore, bannerType, initialData.id);
            await setDoc(docRef, bannerData, { merge: true });
            toast({ title: 'Success', description: 'Banner updated successfully.' });
        } else {
            await addDoc(collection(firestore, bannerType), {
                ...bannerData,
                isDeleted: false,
                createdAt: Timestamp.now(),
            });
            toast({ title: 'Success', description: 'Banner created successfully.' });
        }

        router.push('/admin/banners');
        router.refresh();

    } catch (error: any) {
      console.error('Error submitting form: ', error);
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
        <CardTitle>{initialData ? 'Edit Banner' : `Create New ${bannerType === 'webBanners' ? 'Web' : 'Mobile'} Banner`}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Sale" {...field} disabled={isLoading} />
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
                      <Input type="number" placeholder="0" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>Controls the display order (lower numbers first).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <FormDescription>
                      Inactive banners will not be shown on the website.
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

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
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
                         <Button type="button" variant="outline" asChild>
                           <div>
                             <Upload className="mr-2 h-4 w-4" />
                             <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                           </div>
                         </Button>
                       </label>
                       {imagePreview && (
                           <div className="relative w-48 h-24 rounded-md border overflow-hidden">
                             <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                           </div>
                       )}
                     </div>
                   </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                {isLoading ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save Changes' : 'Create Banner')}
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
