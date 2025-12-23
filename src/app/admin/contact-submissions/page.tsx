'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
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
    () =>
      firestore
        ? collection(firestore, 'contactFormSubmissions')
        : null,
    [firestore]
  );

  const {
    data: submissions,
    isLoading: submissionsLoading,
  } = useCollection<ContactFormSubmission>(submissionsRef);

  /* ===============================
     AUTH GUARD
  =============================== */
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || submissionsLoading;

  /* ===============================
     DATE FORMATTER (SAFE)
  =============================== */
  const formatDate = (date: Timestamp | string) => {
    if (!date) return 'N/A';

    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PPP');
    }

    if (typeof date === 'string') {
      const parsed = new Date(date);
      return isNaN(parsed.getTime())
        ? 'Invalid Date'
        : format(parsed, 'PPP');
    }

    return 'Invalid Date';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Contact Form Submissions
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Received Messages</CardTitle>
          <CardDescription>
            Messages submitted through the website contact form.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : submissions && submissions.length > 0 ? (
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.fullName}
                    </TableCell>

                    <TableCell>
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-primary hover:underline"
                      >
                        {submission.email}
                      </a>
                    </TableCell>

                    <TableCell className="max-w-[320px] truncate">
                      {submission.message}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      {formatDate(submission.submissionDate)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
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
