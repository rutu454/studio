'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BannerForm from '../_components/BannerForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

// 1. Move the logic using useSearchParams into a child component
function BannerContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as 'webBanners' | 'mobileBanners' | null;

  if (!type || (type !== 'webBanners' && type !== 'mobileBanners')) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Invalid Banner Type</AlertTitle>
        <AlertDescription>
          Please specify a valid banner type in the URL (e.g., ?type=webBanners).
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <BannerForm bannerType={type} />
    </div>
  );
}

// 2. Create a fallback component for the loading state
function BannerFallback() {
  return (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      <span>Loading banner configuration...</span>
    </div>
  );
}

// 3. Wrap the content in a Suspense boundary in the default export
export default function NewBannerPage() {
  return (
    <Suspense fallback={<BannerFallback />}>
      <BannerContent />
    </Suspense>
  );
}