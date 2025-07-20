
import { Users, Award, Star, Clock } from 'lucide-react';

const statisticsData = [
  {
    icon: <Users className="w-10 h-10" />,
    value: "100+",
    label: "Happy Clients",
    description: "Businesses that trust us"
  },
  {
    icon: <Award className="w-10 h-10" />,
    value: "5+",
    label: "Years Experience",
    description: "Delivering excellence"
  },
  {
    icon: <Star className="w-10 h-10" />,
    value: "250+",
    label: "Projects Completed",
    description: "Across various industries"
  },
  {
    icon: <Clock className="w-10 h-10" />,
    value: "24/7",
    label: "Support",
    description: "Always available for you"
  }
];

const Statistics = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">Our Impact by the Numbers</h2>
          <p className="section-subtitle">
            Proven track record of delivering exceptional results
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statisticsData.map((stat, index) => (
            <div 
              key={index} 
              className="bg-skilllink-gray rounded-xl p-6 text-center transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-skilllink-green bg-skilllink-green/10 rounded-full">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="font-medium text-lg mb-1">{stat.label}</p>
              <p className="text-skilllink-dark-gray text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-skilllink-green/5 rounded-full"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-skilllink-light-green/5 rounded-full"></div>
    </section>
  );
};

export default Statistics;
