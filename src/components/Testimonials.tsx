import { useRef, useEffect } from "react";
import { Video, Youtube } from "lucide-react";

const Testimonials = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="section-padding bg-skilllink-gray" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            Client Testimonials in Action
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Watch our clients share their experiences and see the results of our work firsthand.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute top-1/4 -left-16 w-32 h-32 bg-skilllink-green/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-16 w-40 h-40 bg-skilllink-light-green/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video w-full">
              <video
                ref={videoRef}
                src="/test.mp4"
                height={570}
                width="100%"
                controls
                preload="none"
                className="w-full h-full"
                poster="/video-poster.jpg"
              />
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Video className="text-skilllink-green" size={20} />
                <h3 className="font-semibold">Client Testimonials</h3>
              </div>
              <p className="text-skilllink-dark-gray">Hear from our satisfied clients about their experience working with us.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Video className="text-skilllink-green" size={20} />
                <h3 className="font-semibold">Project Showcases</h3>
              </div>
              <p className="text-skilllink-dark-gray">View our completed projects and see the results we deliver.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Video className="text-skilllink-green" size={20} />
                <h3 className="font-semibold">Success Stories</h3>
              </div>
              <p className="text-skilllink-dark-gray">Learn how our solutions have helped businesses achieve their goals.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
