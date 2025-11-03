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
      <div className="relative w-[150px] h-[50px] md:w-[170px] md:h-[60px] lg:w-[200px] lg:h-[70px]">
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
