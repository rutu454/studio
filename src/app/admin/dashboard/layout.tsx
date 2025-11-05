'use client';

import Sidebar from '@/components/admin/Sidebar';
import withAuth from '@/components/auth/withAuth';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

export default withAuth(DashboardLayout);
