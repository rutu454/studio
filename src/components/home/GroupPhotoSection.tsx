import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const GroupPhotoSection = () => {
  const groupPhotoImage = PlaceHolderImages.find(p => p.id === 'group-photo');

  return (
    <SectionWrapper>
      <div className="text-center">
        {groupPhotoImage && (
          <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={groupPhotoImage.imageUrl}
              alt={groupPhotoImage.description}
              width={1200}
              height={700}
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
