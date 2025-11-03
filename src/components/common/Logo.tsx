import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image src="/logo.png" alt="Prasthan Group Logo" width={170} height={40} priority />
    </Link>
  );
};

export default Logo;
