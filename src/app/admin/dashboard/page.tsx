'use client';

import { useUser } from '@/firebase/auth/use-auth';

function DashboardPage() {
  const { user } = useUser();

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-4">Dashboard</h1>
      <div className="bg-background p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">
          Welcome, {user?.email || 'Admin'}!
        </h2>
        <p className="text-muted-foreground mt-2">
          This is your admin dashboard. More features will be added soon.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;
