import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import CounterSection from '@/components/home/CounterSection';
import VideoSection from '@/components/home/VideoSection';
import BehindSection from '@/components/home/BehindSection';
import GallerySection from '@/components/home/GallerySection';
import TeamSection from '@/components/home/TeamSection';
import SloganSection from '@/components/home/SloganSection';
import GroupPhotoSection from '@/components/home/GroupPhotoSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CounterSection />
      <VideoSection />
      <BehindSection />
      <GallerySection />
      <TeamSection />
      <SloganSection />
      <GroupPhotoSection />
      <ContactSection />
    </>
  );
}
