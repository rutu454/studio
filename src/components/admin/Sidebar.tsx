'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase/auth/use-auth';
import Logo from '@/components/common/Logo';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-background border-r flex flex-col">
      <div className="p-4 border-b">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      </nav>
      <div className="p-4 border-t">
        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
