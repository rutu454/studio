import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';
import Logo from './Logo';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M16.75 13.96c-.25.12-1.47.72-1.7.82-.22.09-.38.12-.54-.12-.16-.25-.6-0.75-.9-1.09-1.07-1.18-1.8-2.64-1.86-2.76-.06-.12.06-.18.18-.3.12-.12.25-.3.37-.43.12-.12.18-.22.28-.36.09-.15.06-.28 0-.42C12.55 9 11.95 7.5 11.75 7c-.2-.5-.4-.43-.54-.43h-.5c-.15 0-.36.06-.54.3-.18.25-.7.7-1.03 1.4-1 2.22-0.22 4.2.55 5.11 1.7 2.02 3.75 2.5 4.05 2.7.3.2.55.15.75-.09.2-.25.87-1.03 1-1.22.12-.2.25-.15.42-.09.18.06 1.17.55 1.35.65.18.09.3.12.36.09.06-.03.12-0.21-0.21-0.75zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
    </svg>
  );

const Footer = () => {
  return (
    <footer className="bg-[#212121] text-white">
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-gray-400">
              Spreading knowledge, compassion, and unity among society.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/prasthangroup/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><WhatsAppIcon className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-base text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/about" className="text-base text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/gallery" className="text-base text-gray-400 hover:text-white">Gallery</Link></li>
              <li><Link href="/#team" className="text-base text-gray-400 hover:text-white">Team</Link></li>
              <li><Link href="/#contact" className="text-base text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>Prasthan Group Office</li>
              <li>123 Unity Lane, Progress City, 12345</li>
              <li>+1 (234) 567-890</li>
              <li>contact@prasthangroup.org</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Prasthan Group. All rights reserved.</p>
          <p>Designed with ❤️ by Prasthan Team.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
