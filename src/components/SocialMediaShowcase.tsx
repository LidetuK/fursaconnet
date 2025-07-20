
import SocialPost from "./social/SocialPost";
import socialData from "./social/socialData";

const SocialMediaShowcase = () => {
  return (
    <section id="social" className="py-20 bg-skilllink-gray relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Video Showcase
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            See our work in action and hear from our clients
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {socialData.map((post, index) => (
            <SocialPost 
              key={index}
              platform={post.platform}
              imageUrl={post.imageUrl}
              content={post.content}
              author={post.author}
              date={post.date}
              likes={post.likes}
              link={post.link}
            />
          ))}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-skilllink-green/5 rounded-full"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-skilllink-light-green/5 rounded-full"></div>
    </section>
  );
};

export default SocialMediaShowcase;
