'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Video, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

/* ===============================
   SCHEMA (BASE64 SAFE)
================================ */
const formSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  type: z.enum(['image', 'video']),
  status: z.boolean(),
  url: z.string().optional(),
  imageBase64: z.string().optional(),
});

type GalleryFormValues = z.infer<typeof formSchema>;

interface GalleryItemFormProps {
  initialData?: {
    id: string;
    title: string;
    description?: string;
    category: string;
    type: 'image' | 'video';
    status: boolean;
    thumbnailBase64?: string;
    url?: string;
  };
}

/* ===============================
   YOUTUBE VIDEO ID
================================ */
function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com'))
      return u.searchParams.get('v');
  } catch {}
  return null;
}

/* ===============================
   COMPONENT
================================ */
export default function GalleryItemForm({
  initialData,
}: GalleryItemFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.thumbnailBase64 || null
  );

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      type: initialData?.type || 'image',
      status: initialData?.status ?? true,
      url: initialData?.url || '',
      imageBase64: initialData?.thumbnailBase64 || '',
    },
  });

  const itemType = form.watch('type');

  /* ===============================
     IMAGE → BASE64 (NO SIZE LIMIT)
  ================================ */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      form.setValue('imageBase64', base64, {
        shouldValidate: false,
      });
    };
    reader.readAsDataURL(file);
  };

  /* ===============================
     SUBMIT
  ================================ */
  async function onSubmit(values: GalleryFormValues) {
    if (!firestore) return;

    // Manual validation
    if (values.type === 'image' && !values.imageBase64) {
      toast({
        variant: 'destructive',
        title: 'Image required',
        description: 'Please upload an image',
      });
      return;
    }

    if (values.type === 'video' && !values.url) {
      toast({
        variant: 'destructive',
        title: 'Video URL required',
        description: 'Please enter a video URL',
      });
      return;
    }

    setIsLoading(true);

    try {
      let thumbnailBase64 = values.imageBase64 || '';

      // Video thumbnail
      if (values.type === 'video' && values.url) {
        const id = getYouTubeVideoId(values.url);
        thumbnailBase64 = id
          ? `https://img.youtube.com/vi/${id}/0.jpg`
          : '';
      }

      const payload = {
        title: values.title,
        description: values.description || '',
        category: values.category,
        type: values.type,
        status: values.status,
        url: values.type === 'video' ? values.url : '',
        thumbnailBase64,
        isDeleted: false,
        updatedAt: serverTimestamp(),
      };

      if (initialData) {
        await setDoc(
          doc(firestore, 'galleryItems', initialData.id),
          payload,
          { merge: true }
        );
        toast({ title: 'Gallery item updated' });
      } else {
        await addDoc(collection(firestore, 'galleryItems'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Gallery item created' });
      }

      router.push('/admin/gallery');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  }

  /* ===============================
     UI
  ================================ */
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Gallery Item' : 'Create Gallery Item'}
        </CardTitle>
        <CardDescription>
          Upload an image or add a video.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-6"
                    >
                      <FormItem className="flex items-center gap-2">
                        <RadioGroupItem value="image" />
                        <ImageIcon /> Image
                      </FormItem>
                      <FormItem className="flex items-center gap-2">
                        <RadioGroupItem value="video" />
                        <Video /> Video
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* CATEGORY */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* IMAGE */}
            {itemType === 'image' && (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="preview"
                    width={160}
                    height={160}
                    unoptimized
                    className="mt-2 rounded"
                  />
                )}
              </FormItem>
            )}

            {/* VIDEO */}
            {itemType === 'video' && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* STATUS */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center border p-4 rounded">
                  <FormLabel>Status</FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : initialData
                  ? 'Save Changes'
                  : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
