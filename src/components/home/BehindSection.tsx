import SectionWrapper from '../common/SectionWrapper';

const BehindSection = () => {
  return (
    <SectionWrapper className="bg-muted">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Behind the Prasthan Group</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="p-8 bg-background rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-foreground/80 leading-relaxed">
            Spreading knowledge, compassion, and unity among society. We believe in empowering individuals to create a ripple effect of positive change.
          </p>
        </div>
        <div className="p-8 bg-background rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Our Story</h3>
          <p className="text-foreground/80 leading-relaxed">
            Prasthan Group began as a small initiative in 2015, aiming to bridge communities through meaningful change. Over the years, it evolved into a recognized organization supporting various social and educational activities.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default BehindSection;
