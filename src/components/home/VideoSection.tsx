import SectionWrapper from '../common/SectionWrapper';

const VideoSection = () => {
  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Watch Our Journey</h2>
      </div>
      <div className="relative max-w-4xl mx-auto" style={{ paddingBottom: '56.25%', height: 0 }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Example video
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </SectionWrapper>
  );
};

export default VideoSection;
