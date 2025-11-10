'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, Trash2, Video, Image as ImageIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters.'),
});
type GalleryCategory = { id: string; name: string };

const galleryItemSchema = z.object({
    title: z.string().min(2, 'Title is required.'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required.'),
    type: z.enum(['image', 'video'], { required_error: 'You must select a media type.' }),
    url: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
});
type GalleryItem = z.infer<typeof galleryItemSchema> & { id: string; url: string, thumbnailUrl?: string, type: 'image' | 'video' };

export default function GalleryPage() {
    const { toast } = useToast();
    const firestore = useFirestore();

    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [itemDialogOpen, setItemDialogOpen] = useState(false);
    
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    const categoryForm = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: '' },
    });

    const itemForm = useForm<z.infer<typeof galleryItemSchema>>({
        resolver: zodResolver(galleryItemSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            type: 'image',
        },
    });

    // Fetch Categories
    useEffect(() => {
        if (!firestore) return;
        const catQuery = query(collection(firestore, 'galleryCategories'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(catQuery, snapshot => {
            setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryCategory)));
        });
        return () => unsubscribe();
    }, [firestore]);

    // Fetch Gallery Items
    useEffect(() => {
        if (!firestore) return;
        setIsLoading(true);
        const itemQuery = query(collection(firestore, 'galleryItems'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(itemQuery, snapshot => {
            setGalleryItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem)));
            setIsLoading(false);
        }, error => {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch gallery items.' });
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [firestore, toast]);
    
    useEffect(() => {
        if (itemDialogOpen) {
            if (editingItem) {
                itemForm.reset({
                    ...editingItem,
                    imageFile: undefined,
                });
            } else {
                itemForm.reset({
                    title: '',
                    description: '',
                    category: '',
                    type: 'image',
                    url: '',
                    imageFile: undefined
                });
            }
        }
    }, [itemDialogOpen, editingItem, itemForm]);

    const onCategorySubmit = async (values: z.infer<typeof categorySchema>) => {
        if (!firestore) return;
        try {
            await addDoc(collection(firestore, 'galleryCategories'), { ...values, createdAt: serverTimestamp() });
            toast({ title: 'Success', description: 'New category created.' });
            setCategoryDialogOpen(false);
            categoryForm.reset();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not create category.' });
        }
    };
    
    const onItemSubmit = async (values: z.infer<typeof galleryItemSchema>) => {
        if (!firestore) return;
        setIsSubmitting(true);

        try {
            let mediaUrl = editingItem?.url || '';
            let thumbnailUrl: string | undefined = editingItem?.thumbnailUrl;

            if (values.type === 'image' && values.imageFile) {
                const storage = getStorage();
                const imageRef = ref(storage, `gallery/${uuidv4()}-${values.imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, values.imageFile);
                mediaUrl = await getDownloadURL(snapshot.ref);
                thumbnailUrl = mediaUrl;
            } else if (values.type === 'video' && values.url) {
                mediaUrl = values.url;
                const videoId = values.url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
                if (videoId) {
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }
            }

            const itemData = {
                title: values.title,
                description: values.description,
                category: values.category,
                type: values.type,
                url: mediaUrl,
                thumbnailUrl,
            };

            if (editingItem) {
                await updateDoc(doc(firestore, 'galleryItems', editingItem.id), itemData);
                toast({ title: 'Success', description: 'Gallery item updated.' });
            } else {
                await addDoc(collection(firestore, 'galleryItems'), { ...itemData, createdAt: serverTimestamp() });
                toast({ title: 'Success', description: 'New gallery item added.' });
            }
            
            setItemDialogOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save gallery item.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteCategory = async (categoryId: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'galleryCategories', categoryId));
            toast({ title: 'Success', description: 'Category deleted.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete category.' });
        }
    };
    
    const handleDeleteItem = async (itemId: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'galleryItems', itemId));
            toast({ title: 'Success', description: 'Gallery item deleted.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete item.' });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Gallery Management</h1>
            </div>

            <Card>
                <CardHeader className='flex-row items-center justify-between'>
                    <div>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>Manage your gallery categories.</CardDescription>
                    </div>
                    <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4" />Add Category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Category</DialogTitle>
                            </DialogHeader>
                            <Form {...categoryForm}>
                                <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                                    <FormField control={categoryForm.control} name="name" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Events, Charity" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                        <Button type="submit">Create</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                             <AlertDialog key={cat.id}>
                                <Badge variant="outline" className="flex items-center gap-2 pr-1 group">
                                    <span>{cat.name}</span>
                                    <AlertDialogTrigger asChild>
                                        <button className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </AlertDialogTrigger>
                                </Badge>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the "{cat.name}" category. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteCategory(cat.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ))}
                        {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories created yet.</p>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gallery Items</CardTitle>
                        <CardDescription>Manage your gallery images and videos.</CardDescription>
                    </div>
                    <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingItem(null)}><PlusCircle className="mr-2 h-4 w-4" /> Add New Item</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editingItem ? 'Edit' : 'Add New'} Gallery Item</DialogTitle>
                            </DialogHeader>
                            <Form {...itemForm}>
                                <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4">
                                    <FormField control={itemForm.control} name="title" render={({ field }) => (
                                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Diwali Celebration 2023" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={itemForm.control} name="description" render={({ field }) => (
                                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A detailed description of the gallery item." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={itemForm.control} name="category" render={({ field }) => (
                                        <FormItem><FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage /></FormItem>
                                    )} />
                                    <FormField control={itemForm.control} name="type" render={({ field }) => (
                                        <FormItem><FormLabel>Media Type</FormLabel>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                                <FormItem><FormControl><RadioGroupItem value="image" id="image" /></FormControl><FormLabel htmlFor="image" className="ml-2">Image</FormLabel></FormItem>
                                                <FormItem><FormControl><RadioGroupItem value="video" id="video" /></FormControl><FormLabel htmlFor="video" className="ml-2">Video</FormLabel></FormItem>
                                            </RadioGroup>
                                        <FormMessage /></FormItem>
                                    )} />
                                    {itemForm.watch('type') === 'image' && (
                                        <FormField control={itemForm.control} name="imageFile" render={({ field }) => (
                                            <FormItem><FormLabel>Image File</FormLabel><FormControl><Input type="file" accept="image/*" onChange={e => field.onChange(e.target.files?.[0])} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    )}
                                    {itemForm.watch('type') === 'video' && (
                                        <FormField control={itemForm.control} name="url" render={({ field }) => (
                                            <FormItem><FormLabel>YouTube Video URL</FormLabel><FormControl><Input placeholder="https://www.youtube.com/watch?v=..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    )}
                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Item'}</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thumbnail</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                                    ))
                                ) : galleryItems.length > 0 ? (
                                    galleryItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted">
                                                    {(item.type === 'image' || item.thumbnailUrl) && (
                                                        <Image src={item.thumbnailUrl || item.url} alt={item.title} layout="fill" objectFit="cover" />
                                                    )}
                                                    {item.type === 'video' && !item.thumbnailUrl && <Video className="w-8 h-8 text-muted-foreground m-auto" />}
                                                    {item.type === 'image' && !item.url && <ImageIcon className="w-8 h-8 text-muted-foreground m-auto" />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                                            <TableCell><Badge variant={item.type === 'image' ? 'outline' : 'default'}>{item.type}</Badge></TableCell>
                                            <TableCell>
                                                <AlertDialog>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => { setEditingItem(item); setItemDialogOpen(true); }}>Edit</DropdownMenuItem>
                                                            <AlertDialogTrigger asChild><DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem></AlertDialogTrigger>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>This will permanently delete the gallery item. This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No gallery items yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
