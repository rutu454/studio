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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  altText: z.string().min(2, 'Alt text is required'),
  type: z.enum(['web', 'mobile'], { required_error: 'Banner type is required' }),
  image: z.string({ required_error: 'Image is required.' })
});

export type BannerFormValues = z.infer<typeof formSchema>;

interface BannerFormProps {
  initialData?: BannerFormValues & { id: string; };
}

export default function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      altText: initialData?.altText || '',
      type: initialData?.type || undefined,
      image: initialData?.image || undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue('image', base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: BannerFormValues) {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not initialized.' });
      return;
    }
    
    if (!values.image) {
        form.setError("image", { type: "manual", message: "Image is required." });
        return;
    }

    setIsLoading(true);

    try {
      const bannerData = {
        altText: values.altText,
        type: values.type,
        imageUrl: values.image, // This is the Base64 string
      };

      if (initialData?.id) {
        // Update existing document
        const docRef = doc(firestore, 'banners', initialData.id);
        await setDoc(docRef, bannerData, { merge: true });
        toast({ title: 'Success', description: 'Banner updated successfully.' });
      } else {
        // Create new document
        await addDoc(collection(firestore, 'banners'), {
            ...bannerData,
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
        <CardTitle>{initialData ? 'Edit Banner' : 'Create New Banner'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the banner image" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>
                    This is for SEO and accessibility.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a banner type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="web">Web Banner</SelectItem>
                      <SelectItem value="mobile">Mobile Banner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Web banners are for desktop, mobile banners are for smaller screens.
                  </FormDescription>
                  <FormMessage />
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