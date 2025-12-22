'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/#team', label: 'Member' },
  { href: '/#contact', label: 'Contact' },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.substring(2);
      
      if (pathname === '/') {
        // Already on the homepage, just scroll
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // On a different page, navigate to homepage with hash
        router.push(`/#${targetId}`);
      }
    }
  };
  
  useEffect(() => {
    // This effect handles scrolling when the page loads with a hash in the URL.
    // This is crucial for when we navigate from another page to a section on the homepage.
    const handleHashChange = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100); // A small delay ensures the element is rendered.
      }
    };
    
    // Handle initial load
    handleHashChange();
    
    // Next.js router doesn't trigger a full page reload, so we can't just rely on
    // standard hash change events. We listen for path changes and re-evaluate.
    if (pathname === '/' && window.location.hash) {
        handleHashChange();
    }

  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          <Logo className="text-primary" />

          <nav className="hidden md:flex md:space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium transition-colors text-foreground/80 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
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
                        <Link
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
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
