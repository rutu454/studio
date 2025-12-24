'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, LogOut, Image as ImageIcon, GalleryHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/banners', label: 'Web Banners', icon: ImageIcon },
  { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
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
    <aside className="hidden w-64 flex-col border-r text-sidebar-foreground md:flex">
      <div className="flex h-20 items-center border-b px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-red-800 font-semibold transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              pathname.startsWith(link.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t text-red-800 font-semibold">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 px-3 hover:bg-sidebar-accent text-red-800 font-semibold hover:text-white">
              <LogOut className="h-4 w-4" />
              Logout
          </Button>
      </div>
    </aside>
  );
}
