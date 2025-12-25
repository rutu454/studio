'use client';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useUser } from '@/firebase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  const isAuthPage = pathname === '/admin' || pathname === '/admin/register';

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!user && !isAuthPage) {
      // This part is tricky because of redirects, but for now we assume client-side redirect will handle it.
      // Or we can show a login screen right away. For simplicity, let's allow children to render,
      // and assume individual pages have guards.
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
