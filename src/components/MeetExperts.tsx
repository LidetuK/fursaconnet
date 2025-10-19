import TeamMember from "./team/TeamMember";
import teamData from "./team/teamData";

const MeetExperts = () => {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Meet Our Experts
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            We've helped SME's from various industries achieve their digital goals
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamData.map((member, index) => (
            <div key={index} className="w-full">
              <TeamMember 
                name={member.name}
                role={member.role}
                bio={member.bio}
                imageUrl={member.imageUrl}
                socialLinks={member.socialLinks}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetExperts;
