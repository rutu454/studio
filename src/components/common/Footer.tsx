import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import Logo from './Logo';

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
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><MessageCircle size={20} /></a>
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
