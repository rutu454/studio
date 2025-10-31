import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionWrapper from '../common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const AboutSection = () => {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about');

  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">About Us</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Prasthan Group is a community-driven organization dedicated to fostering positive change through education, social initiatives, and empowerment programs. Our mission is to build a compassionate and sustainable society.
          </p>
          <Button asChild>
            <Link href="/about">Read More</Link>
          </Button>
        </div>
        <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
          {aboutImage && (
            <Image
              src={aboutImage.imageUrl}
              alt={aboutImage.description}
              fill
              className="object-cover"
              data-ai-hint={aboutImage.imageHint}
            />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
