import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import groupPhoto from '../../assets/group photo.jpg'; // 👈 import your image directly

const GroupPhotoSection = () => {
  return (
    <SectionWrapper>
      <div className="text-center">
        <div className="relative mx-auto rounded-lg overflow-hidden shadow-2xl w-full">
          <Image
            src={groupPhoto}
            alt="Group photo of the Prasthan team"
            layout="responsive"
            width={1200}
            height={800} 
            className="object-cover"
            priority
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GroupPhotoSection;
