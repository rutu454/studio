import SectionWrapper from '@/components/common/SectionWrapper';

export default function AboutPage() {
  return (
    <div className="pt-24">
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">About Prasthan Group</h1>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">What is Prasthan Group?</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Along with social service and various scientific experiences, Prasthan Group works in different creative fields. Through its social and problem-solving initiatives, the group helps people in need and spreads awareness. The main aim of Prasthan Group is to bring together youth interested in social service and creative activities, giving them a common platform to work for social betterment.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">Activities of Prasthan Group</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                The activities of Prasthan Group focus on uniting youth and channeling their energy for society’s progress. These activities include blood donation drives, tree plantation, helping needy students, supporting senior citizens, organizing awareness programs, environmental protection campaigns, and creative art-related initiatives.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed mt-4">
                The group continuously works to encourage positive change, unity, and selfless service in society. Through various innovative and practical programs, Prasthan Group inspires the young generation to contribute towards building a better tomorrow.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
