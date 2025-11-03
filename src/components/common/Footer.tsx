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
      <path d="M16.75 13.96c.25.13.43.2.5.28.07.1.13.4.15.65.02.25.03.5.03.78 0 .27-.01.53-.04.8-.03.27-.06.51-.1.71-.04.2-.1.4-.15.55a.86.86 0 0 1-.22.35c-.1.14-.22.25-.35.34-.13.09-.28.16-.44.2a3.3 3.3 0 0 1-2.02.32c-.34-.02-.67-.08-1-.18s-.63-.25-.92-.42c-.29-.17-.57-.38-.82-.61-.25-.23-.48-.5-.69-.78s-.4-.59-.57-.88c-.17-.29-.32-.58-.45-.85a9.2 9.2 0 0 1-.55-2.2c-.02-.17-.03-.34-.03-.5 0-.1 0-.2.02-.3l.04-.3c.02-.1.05-.2.07-.3.02-.1.05-.18.07-.25s.05-.14.07-.2a.3.3 0 0 1 .08-.13c.03-.04.06-.08.08-.1a.3.3 0 0 1 .1-.08c.04-.02.08-.04.1-.05s.07-.02.1-.03.07-.02.1-.02h.13c.03 0 .07 0 .1.02l.1.02c.04 0 .07.02.1.03l.1.05c.02.02.05.04.07.07s.03.05.05.08a.4.4 0 0 1 .05.1c.02.03.03.07.05.1h.02c.02.03.03.07.05.1l.05.1.05.12.04.1c.02.05.03.1.04.15s.02.1.02.15a.42.42 0 0 1-.02.15.5.5 0 0 1-.04.13l-.05.1c-.02.04-.04.07-.07.1a.43.43 0 0 1-.3.18l-.13.03c-.05 0-.1 0-.13-.02a.49.49 0 0 1-.18-.09.92.92 0 0 1-.2-.17c-.06-.07-.12-.15-.17-.23-.05-.08-.1-.17-.14-.25s-.08-.17-.1-.25c-.03-.08-.05-.17-.07-.25a2.58 2.58 0 0 1-.1-.4.5.5 0 0 1-.02-.28.5.5 0 0 1 .08-.28c.05-.08.1-.15.18-.2a.6.6 0 0 1 .2-.12.83.83 0          0 1 .3-.07c.1-.02.2-.02.3-.02h.17c.1 0 .2 0 .3.02a.8.8 0 0 1 .3.08.6.6 0 0 1 .22.13c.08.06.14.13.2.2.05.08.1.17.13.25.03.08.05.17.07.25s.03.17.03.25a.5.5 0 0 1-.02.2.5.5 0 0 1-.05.18l-.1.15-.12.12-.14.1c-.05.03-.1.05-.15.07a.4.4 0 0 1-.16.03h-.1a.4.4 0 0 1-.18-.04.4.4 0 0 1-.15-.1.68.68 0 0 1-.14-.18.9.9 0 0 1-.1-.2c-.03-.06-.06-.13-.08-.19-.02-.06-.04-.12-.06-.18a1.9 1.9 0 0 0-.16-.38 3.48 3.48 0 0 0-.57-1c-.2-.3-.42-.58-.67-.82-.25-.24-.52-.45-.8-.63s-.56-.33-.85-.45-.58-.2-.86-.23c-.28-.03-.56-.05-.82-.05-.27 0-.53.02-.78.05a3.2 3.2 0 0 0-2.27 1.2c-.2.22-.38.48-.52.75s-.25.57-.34.88a4.1 4.1 0 0 0-.13 1.18c0 .1.01.2.02.3l.03.3c.02.1.04.2.07.3s.05.18.08.25.06.14.08.2c.02.07.05.13.07.2a.3.3 0 0 1 .1.12c.03.05.06.08.08.12a.3.3 0 0 1 .08.1c.03.03.07.05.1.08l.1.05h.1c.05 0 .1 0 .15-.02l.13-.03a.5.5 0 0 1 .15-.05.52.52          0 0 1 .14.04c.05.03.1.06.13.1a.5.5 0 0 1 .1.13c.03.05.06.1.08.15s.03.1.04.15.02.1.02.15a.42.42 0 0 1-.02.15.5.5 0 0 1-.04.13l-.05.1c-.02.04-.04.07-.07.1a.43.43 0 0 1-.3.18l-.13.03c-.05 0-.1 0-.13-.02a.49.49 0 0 1-.18-.09.92.92 0 0 1-.2-.17c-.06-.07-.12-.15-.17-.23-.05-.08-.1-.17-.14-.25s-.08-.17-.1-.25c-.03-.08-.05-.17-.07-.25a2.58 2.58 0 0 1-.1-.4.5.5 0 0 1-.02-.28c0-.1.02-.18.05-.25a.48.48 0 0 1 .12-.18.5.5 0 0 1 .18-.1.8.8 0 0 1 .54-.02c.1 0 .2.02.3.05a.8.8 0 0 1 .3.1.6.6 0 0 1 .2.15c.07.07.13.15.18.23.05.08.1.18.13.27a1.2 1.2 0 0 1 .05.3c.02.1.02.2.02.3a.5.5 0 0 1-.02.2.5.5 0 0 1-.05.18l-.1.15-.12.12-.14.1c-.05.03-.1.05-.15.07-.06.02-.12.03-.17.03h-.1a.4.4 0 0          1-.18-.04.4.4 0 0 1-.15-.1.68.68 0 0 1-.14-.18.9.9 0 0 1-.1-.2c-.03-.06-.06-.13-.08-.19s-.04-.12-.06-.18a1.9 1.9 0 0 0-.16-.38c-.1-.2-.23-.38-.36-.57a3.48 3.48 0 0 0-.57-1 6.8 6.8 0 0 0-2.3-1.6c-.3-.18-.6-.32-.93-.42s-.65-.16-1-.18a3.3 3.3 0 0 0-2.02.32c-.16.07-.3.14-.44.22a1.8 1.8 0 0 0-.7.75c-.1.15-.2.32-.28.5s-.14.37-.18.55c-.04.18-.08.37-.1.55s-.05.35-.06.52-.02.33-.02.5c0 .27.01.53.04.8a3.2 3.2 0 0 0 .4 1.58c.2.3.42.58.67.82.25.24.52.45.8.63s.56.33.85.45.58.2.86.23c.28.03.56.05.82.05.27 0 .53-.02.78-.05s.5-.08.73-.15.45-.15.65-.25.4-.2.58-.33a1.8 1.8 0 0 0 .7-.75c.1-.15.2-.32.28-.5s.14-.37.18-.55c.04-.18.08-.37.1-.55s.05-.35.06-.52.02-.33.02-.5c0-.27-.01-.53-.04-.8a3.2 3.2 0 0 0-.4-1.58Z"/>
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
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><WhatsAppIcon className="h-5 w-5" /></a>
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
