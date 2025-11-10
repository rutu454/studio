'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, Package2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

export default function Header({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) {

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0">
               <Sidebar sidebarOpen={true} setSidebarOpen={() => {}} isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
         <Button asChild variant="outline">
             <Link href="/">
                 <Home className="mr-2 h-4 w-4" />
                 View Site
             </Link>
         </Button>
      </div>
    </header>
  );
}
