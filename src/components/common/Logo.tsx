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
     <Image 
  src={l} 
  alt="Prasthan Group Logo" 
  width={170} 
  height={200}   // increased from 60 to 100
  priority 
/>

    </Link>
  );
};

export default Logo;
