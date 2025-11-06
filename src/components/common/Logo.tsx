import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import l from '@/assets/l.png';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <div className="relative w-[180px] h-[60px] md:w-[200px] md:h-[70px] lg:w-[220px] lg:h-[80px]">
        <Image 
          src={l} 
          alt="Prasthan Group Logo" 
          fill
          className="object-contain"
          priority 
        />
      </div>
    </Link>
  );
};

export default Logo;
