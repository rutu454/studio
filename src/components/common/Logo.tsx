import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={cn("text-2xl font-bold font-headline text-primary", className)}>
      Prasthan Group
    </Link>
  );
};

export default Logo;
