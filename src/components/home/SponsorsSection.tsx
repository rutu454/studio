import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sponsorImages = PlaceHolderImages.filter(p => p.id.startsWith('sponsor'));

const SponsorsSection = () => {
  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Sponsors</h2>
        <p className="text-lg text-foreground/80 mt-2">
          We thank our supporters for being part of our journey.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center">
        {sponsorImages.map(sponsor => (
          <a key={sponsor.id} href="#" className="flex justify-center items-center p-2 rounded-lg opacity-70 hover:opacity-100 transition-opacity w-40 h-20">
            <div className="relative w-full h-full">
              <Image
                src={sponsor.imageUrl}
                alt={sponsor.description}
                fill
                className="object-contain"
                data-ai-hint={sponsor.imageHint}
              />
            </div>
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default SponsorsSection;
