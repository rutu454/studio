'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase/auth/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const { user, isAdmin, signInWithEmailAndPassword, isUserLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'prasthanjnd@gmail.com',
      password: 'prasthan@2025',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(values.email, values.password);
      // The useEffect will handle redirection on successful login and admin check
    } catch (error) {
      console.error(error);
      let description = 'An unexpected error occurred.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            description = 'Invalid email or password.';
            break;
          default:
            description = 'Failed to sign in. Please try again.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    // Redirect if user is logged in and is an admin
    if (!isUserLoading && user && isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [user, isAdmin, isUserLoading, router]);

  // Determine if the page is in a loading state.
  // Loading is true if Firebase is checking the user OR if we have a user but haven't yet confirmed their admin status.
  const isLoading = isUserLoading || (user && isAdmin === undefined);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If a user is logged in but is NOT an admin, show access denied.
  if (user && isAdmin === false) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to access the admin panel.</p>
            <Button onClick={() => router.push('/')} variant="outline" className="mt-4">Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If there is no user, and we are not loading, show the login form.
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback for any other state, though it should not be reached.
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}