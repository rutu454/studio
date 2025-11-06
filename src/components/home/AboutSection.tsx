import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionWrapper from '../common/SectionWrapper';
import aboutImage from '../../assets/aboutimage.jpg';

const AboutSection = () => {

  return (
    <SectionWrapper>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">About Us</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Along with social service and various scientific experiences, Prasthan Group works in different creative fields. Through its social and problem-solving initiatives, the group helps people in need and spreads awareness. The main aim of Prasthan Group is to bring together youth interested in social service and creative activities, giving them a common platform to work for social betterment.
          </p>
          <Button asChild>
            <Link href="/about">Read More</Link>
          </Button>
        </div>
        <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
            <Image
              src={aboutImage}
              alt="Prasthan Group members holding Indian flags"
              fill
              className="object-cover"
              data-ai-hint="group photo outdoors"
            />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
