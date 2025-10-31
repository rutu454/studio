'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email(),
  contactNumber: z.string().optional(),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDataLoading, setIsDataLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      contactNumber: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }

    if (user && firestore && userDocRef) {
      setIsDataLoading(true);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          form.reset({
            fullName: user.displayName || userData.fullName || '',
            email: user.email || userData.email || '',
            contactNumber: userData.contactNumber || '',
          });
        }
        setIsDataLoading(false);
      }).catch(err => {
        console.error("Error fetching user data:", err);
        setIsDataLoading(false);
      });
    }
  }, [user, isUserLoading, firestore, form, router, userDocRef]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth?.currentUser || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    try {
      // Update password if provided
      if (values.newPassword) {
        await updatePassword(auth.currentUser, values.newPassword);
        toast({ title: "Password Updated", description: "Your password has been changed successfully." });
      }

      // Update Firebase Auth profile
      if (values.fullName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: values.fullName });
      }

      // Prepare data for Firestore update
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      const initials = values.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const firestoreData: {fullName: string; initials: string; contactNumber?: string} = { 
        fullName: values.fullName,
        initials: initials,
      };

      if (values.contactNumber) {
        firestoreData.contactNumber = values.contactNumber;
      }
      
      updateDocumentNonBlocking(userDocRef, firestoreData);

      toast({ title: "Profile Updated", description: "Your information has been saved." });
      form.reset({ ...values, newPassword: '', confirmPassword: '' });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  }

  if (isUserLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12 pt-24">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Your Profile</CardTitle>
          <CardDescription className="text-center">
            View and update your account information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr />
              <h3 className="text-lg font-medium">Update Password</h3>
               <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
