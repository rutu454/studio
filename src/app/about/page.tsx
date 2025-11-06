import SectionWrapper from '@/components/common/SectionWrapper';

export default function AboutPage() {
  return (
    <div className="pt-24">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">About Prasthan Group</h1>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Along with social service and various scientific experiences, Prasthan Group works in different creative fields. Through its social and problem-solving initiatives, the group helps people in need and spreads awareness. The main aim of Prasthan Group is to bring together youth interested in social service and creative activities, giving them a common platform to work for social betterment.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                To empower individuals and communities through social initiatives, education, and growth programs. We are dedicated to creating a positive impact by fostering an environment of learning, support, and collective progress.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                To build a sustainable and compassionate society where every person thrives. We envision a future where equal opportunities are accessible to all, and where communities work together in harmony for the greater good.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Prasthan Group began as a small initiative in 2015, aiming to bridge communities through meaningful change. What started as a local effort to organize educational workshops and charity drives has grown into a recognized organization supporting a wide range of social and educational activities. Over the years, we have expanded our reach, completed numerous impactful projects, and built a strong network of supporters and partners who share our commitment to social progress.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
