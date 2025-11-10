'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, Home, LineChart, LogOut, Package, Package2, Users, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';
import { SheetClose } from '../ui/sheet';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    isMobile?: boolean;
}

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/dashboard/mobile-banner', label: 'Mobile Banner', icon: Smartphone },
  // Add more links here in the future
];


export default function Sidebar({ sidebarOpen, setSidebarOpen, isMobile = false }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.replace('/admin');
  };
  
  const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const isActive = pathname === href;
    const link = (
         <Link
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-muted text-primary'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );

    return isMobile ? <SheetClose asChild>{link}</SheetClose> : link;
  }

  return (
    <div className={cn(
        "hidden border-r bg-background md:block",
        isMobile && "block"
    )}>
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map(link => (
                  <NavLink key={link.href} {...link} />
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
  );
}
