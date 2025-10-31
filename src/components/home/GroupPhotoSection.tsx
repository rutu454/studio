import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const GroupPhotoSection = () => {
  const groupPhotoImage = PlaceHolderImages.find(p => p.id === 'group-photo');

  return (
    <SectionWrapper className="py-12 sm:py-16">
      <div className="text-center">
        {groupPhotoImage && (
          <div className="relative max-w-5xl mx-auto rounded-lg overflow-hidden shadow-xl">
            <Image
              src={groupPhotoImage.imageUrl}
              alt={groupPhotoImage.description}
              width={1200}
              height={400}
              className="w-full"
              data-ai-hint={groupPhotoImage.imageHint}
            />
          </div>
        )}
        {/* <p className="mt-6 text-lg text-muted-foreground italic">
          The Prasthan Group family celebrating unity and progress.
        </p> */}
      </div>
    </SectionWrapper>
  );
};

export default GroupPhotoSection;
