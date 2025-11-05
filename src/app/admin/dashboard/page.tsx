'use client';

import { useAuth, useUser } from '@/firebase/auth/use-auth';
import { Button } from '@/components/ui/button';
import withAuth from '@/components/auth/withAuth';

function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-muted flex flex-col">
       <header className="bg-background shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <Button onClick={signOut} variant="outline">Logout</Button>
        </div>
      </header>
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold">Welcome, {user?.email || 'Admin'}!</h2>
            <p className="text-muted-foreground mt-2">This is your admin dashboard. More features will be added soon.</p>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardPage);
