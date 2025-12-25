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
   SCHEMA FOR MULTIPLE IMAGES
================================ */
const formSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  type: z.enum(['image', 'video']),
  status: z.boolean(),
  url: z.string().optional(),
  images: z.array(z.string()).optional(), // ← multiple base64 images
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
    images?: string[];
    url?: string;
  };
}


/* ===============================
   YOUTUBE ID
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
export default function GalleryItemForm({ initialData }: GalleryItemFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images || []
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
      images: initialData?.images || [],
    },
  });

  const itemType = form.watch('type');


  /* ==================================
     MULTIPLE IMAGE TO BASE64
  =================================== */
  const handleMultiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const promises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Array) => {
      const updatedImages = [...imagePreviews, ...base64Array]; // append
      setImagePreviews(updatedImages);
      form.setValue('images', updatedImages, { shouldValidate: false });
    });
  };


  /* ==================================
     REMOVE IMAGE FROM PREVIEW
  =================================== */
  const removeImage = (index: number) => {
    const updated = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updated);
    form.setValue('images', updated);
  };


  /* ==================================
     SUBMIT
  =================================== */
  async function onSubmit(values: GalleryFormValues) {
    if (!firestore) return;

    if (values.type === 'image' && (!values.images || values.images.length === 0)) {
      toast({
        variant: 'destructive',
        title: 'Images required',
        description: 'Please upload at least one image',
      });
      return;
    }

    if (values.type === 'video' && !values.url) {
      toast({
        variant: 'destructive',
        title: 'Video URL required',
        description: 'Please enter a YouTube video URL',
      });
      return;
    }

    setIsLoading(true);

    try {
      let videoThumb = '';
      if (values.type === 'video' && values.url) {
        const id = getYouTubeVideoId(values.url);
        videoThumb = id ? `https://img.youtube.com/vi/${id}/0.jpg` : '';
      }

      const payload = {
        title: values.title,
        description: values.description || '',
        category: values.category,
        type: values.type,
        status: values.status,
        url: values.type === 'video' ? values.url : '',
        images: values.type === 'image' ? values.images || [] : [],
        videoThumbnail: videoThumb,
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message,
      });
    }

    setIsLoading(false);
  }


  /* ==================================
     UI
  =================================== */
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Gallery Item' : 'Create Gallery Item'}</CardTitle>
        <CardDescription>Upload multiple images or add a video.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
                        <ImageIcon /> Images
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
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Textarea {...field} /></FormControl>
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
                  <FormControl><Input {...field} /></FormControl>
                </FormItem>
              )}
            />

            {/* MULTIPLE IMAGES */}
            {itemType === 'image' && (
              <FormItem>
                <FormLabel>Images (Multiple)</FormLabel>
                <Input type="file" accept="image/*" multiple onChange={handleMultiImageChange} />

                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreviews.map((img, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={img}
                        width={120}
                        height={120}
                        unoptimized
                        alt="preview"
                        className="rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded"
                        onClick={() => removeImage(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </FormItem>
            )}

            {/* VIDEO */}
            {itemType === 'video' && (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video URL</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
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
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
