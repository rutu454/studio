'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.replace('/admin');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome to the admin panel.</p>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    </div>
  );
}
