import SectionWrapper from '../common/SectionWrapper';

const SloganSection = () => {
  return (
    <div className="bg-[#CC0000] mt-20">
      <SectionWrapper id="slogan" className="py-0 ">
        <div className="text-center">
          <h2 className="pt-10 text-3xl md:text-5xl font-bold font-headline tracking-tight text-[#f0f0f0]">
            “Together we rise, together we grow.”
          </h2>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default SloganSection;
