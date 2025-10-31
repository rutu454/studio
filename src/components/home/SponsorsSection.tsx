import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sponsorImages = PlaceHolderImages.filter(p => p.id.startsWith('sponsor'));

const SponsorsSection = () => {
  return (
    <SectionWrapper className="py-12 sm:py-16">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Sponsors</h2>
        <p className="text-lg text-foreground/80 mt-2">
          We thank our supporters for being part of our journey.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 items-center justify-items-center">
        {sponsorImages.map(sponsor => (
          <a key={sponsor.id} href="#" className="flex justify-center items-center group">
            <div className="relative w-44 h-44 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-95 border">
              <Image
                src={sponsor.imageUrl}
                alt={sponsor.description}
                fill
                className="object-cover"
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
