'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Menu, Shield } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '../ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/#team', label: 'Team' },
  { href: '/#contact', label: 'Contact' },
];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          <Logo className="text-primary" />
          
          <nav className="hidden md:flex md:space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors text-foreground/80 hover:text-primary">
                  {link.label}
              </Link>
            ))}
             <Link href="/admin/dashboard" className="text-sm font-medium transition-colors text-foreground/80 hover:text-primary">
                <Shield size={20} />
              </Link>
          </nav>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetHeader className="p-4 border-b">
                   <Logo />
                   <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <nav className="flex flex-col space-y-4 p-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                     <SheetClose asChild>
                        <Link href="/admin/dashboard" className="text-lg font-medium text-foreground hover:text-primary transition-colors flex items-center">
                          <Shield className="mr-2 h-5 w-5" />
                          Admin
                        </Link>
                      </SheetClose>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
