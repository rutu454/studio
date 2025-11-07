import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import groupPhoto from '../../assets/groupimage.jpg';

const GroupPhotoSection = () => {
  return (
    <SectionWrapper>
      <div className="flex justify-center items-center">
        <div className="relative w-full md:w-4/5 lg:w-4/5 max-h-screen overflow-hidden rounded-lg shadow-xl">
          <Image
            src={groupPhoto}
            alt="Group photo of the Prasthan team"
            width={1200}
            height={800}
            className="object-contain w-full h-auto md:max-h-screen"
            priority
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GroupPhotoSection;
