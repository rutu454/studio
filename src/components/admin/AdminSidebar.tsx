'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, LogOut, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/contact-submissions', label: 'Contact Submissions', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
    router.push('/admin');
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-20 items-center border-b px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              pathname.startsWith(link.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 px-3">
              <LogOut className="h-4 w-4" />
              Logout
          </Button>
      </div>
    </aside>
  );
}
