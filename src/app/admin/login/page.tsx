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
    // This effect handles redirection based on auth state.
    // It will run whenever the auth state (user, isAdmin, isUserLoading) changes.
    
    // If Firebase isn't done loading, we don't know the user's state, so we wait.
    if (isUserLoading) {
      return;
    }

    // If we have a user and we have confirmed they are an admin, redirect to the dashboard.
    if (user && isAdmin) {
      router.push('/admin/dashboard');
    }

  }, [user, isAdmin, isUserLoading, router]);

  // This is the central loading check for the page.
  // We are in a loading state if:
  // 1. Firebase is still determining the user's auth state (`isUserLoading`).
  // 2. We have a user, but we haven't yet finished checking if they are an admin (`isAdmin` is undefined).
  const isLoading = isUserLoading || (user && isAdmin === undefined);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // After loading, if a user exists but they are NOT an admin, show Access Denied.
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
  
  // After loading, if there is no user, show the login form.
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

  // This state should ideally not be reached, but it acts as a fallback.
  // It might show briefly if redirection is happening.
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}
