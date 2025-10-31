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
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
        {sponsorImages.map(sponsor => (
          <a key={sponsor.id} href="#" className="opacity-60 hover:opacity-100 transition-opacity">
            <Image
              src={sponsor.imageUrl}
              alt={sponsor.description}
              width={150}
              height={75}
              className="object-contain"
              data-ai-hint={sponsor.imageHint}
            />
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default SponsorsSection;
