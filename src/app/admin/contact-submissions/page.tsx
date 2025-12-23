'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ContactFormSubmission {
  id: string;
  fullName: string;
  email: string;
  contactNumber?: string;
  message: string;
  submissionDate: Timestamp | string;
}

export default function ContactSubmissionsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const submissionsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'contactFormSubmissions') : null),
    [firestore]
  );
  
  const { data: submissions, isLoading: submissionsLoading } = useCollection<ContactFormSubmission>(submissionsRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || submissionsLoading;

  const formatDate = (date: Timestamp | string) => {
    if (!date) return 'N/A';
    // Firestore Timestamps have a toDate() method.
    if (typeof (date as Timestamp).toDate === 'function') {
      return format((date as Timestamp).toDate(), 'PPP');
    }
    // Fallback for string or other date types
    try {
      return format(new Date(date), 'PPP');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Contact Form Submissions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Received Messages</CardTitle>
          <CardDescription>
            Here are the messages submitted through the website contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : submissions && submissions.length > 0 ? (
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(submission.submissionDate)}
                    </TableCell>
                    <TableCell className="font-medium">{submission.fullName}</TableCell>
                    <TableCell>
                      <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
                        {submission.email}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {submission.message}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
