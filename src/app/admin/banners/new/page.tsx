'use client';
import { useSearchParams } from 'next/navigation';
import BannerForm from '../_components/BannerForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function NewBannerPage() {
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
    )
  }

  return (
    <div>
      <BannerForm bannerType={type} />
    </div>
  );
}
