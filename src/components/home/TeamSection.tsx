import Image from 'next/image';
import SectionWrapper from '../common/SectionWrapper';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const teamMembers = [
  { name: 'Rutu M.', role: 'Founder & CEO', imageId: 'team1' },
  { name: 'Alex Johnson', role: 'Project Director', imageId: 'team2' },
  { name: 'Priya Sharma', role: 'Community Manager', imageId: 'team3' },
  { name: 'David Chen', role: 'Lead Volunteer', imageId: 'team4' },
  { name: 'Emily White', role: 'Event Coordinator', imageId: 'team5' },
  { name: 'Michael Brown', role: 'Treasurer', imageId: 'team6' },
  { name: 'Sarah Lee', role: 'Marketing Head', imageId: 'team7' },
  { name: 'Chris Green', role: 'IT Support', imageId: 'team8' },
];

const TeamSection = () => {
  return (
    <SectionWrapper id="team" className="bg-muted">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Meet Our Team</h2>
        <p className="text-lg text-foreground/80 mt-2">
          The faces behind Prasthan Group’s vision and strength.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-7 gap-4 md:gap-4">
        {teamMembers.map((member) => {
          const memberImage = PlaceHolderImages.find(p => p.id === member.imageId);
          return (
            <div key={member.name} className="text-center group">
              <div className="relative w-36 h-36 md:w-32 md:h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                {memberImage && (
                  <Image
                    src={memberImage.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    data-ai-hint={memberImage.imageHint}
                  />
                )}
              </div>
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default TeamSection;
