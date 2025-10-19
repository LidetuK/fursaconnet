
import { Lightbulb, FileEdit, Code, Cpu, LineChart, Rocket } from 'lucide-react';

const processSteps = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Discovery",
    description: "We begin by understanding your business, goals, and target audience to establish a solid foundation for your project.",
    color: "bg-orange-100 text-orange-500"
  },
  {
    icon: <FileEdit className="w-6 h-6" />,
    title: "Planning",
    description: "Our team develops a comprehensive strategy and project plan tailored to your specific requirements.",
    color: "bg-yellow-100 text-yellow-500"
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Development",
    description: "Expert designers and developers bring your vision to life with clean, efficient, and modern code.",
    color: "bg-green-100 text-green-500"
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Testing",
    description: "Rigorous quality assurance ensures your project is bug-free and performs optimally across all platforms.",
    color: "bg-blue-100 text-blue-500"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Launch",
    description: "We coordinate a smooth launch and provide the support needed to ensure a successful deployment.",
    color: "bg-indigo-100 text-indigo-500"
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Growth",
    description: "Post-launch, we continue to monitor performance and implement strategies to drive continuous improvement.",
    color: "bg-purple-100 text-purple-500"
  }
];

const Process = () => {
  return (
    <section className="py-20 bg-skilllink-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="section-title">Our Process</h2>
          <p className="section-subtitle">
            A streamlined approach to delivering exceptional digital solutions
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute hidden md:block left-1/2 top-0 bottom-0 w-1 bg-skilllink-green/30 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 relative">
            {processSteps.map((step, index) => (
              <div key={index} className={`md:flex items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div className={`inline-block ${step.color} p-3 rounded-lg mb-4`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-skilllink-dark-gray">{step.description}</p>
                </div>
                
                <div className="md:w-1/2 relative">
                  {/* Circle on timeline */}
                  <div className="hidden md:flex absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-skilllink-green items-center justify-center">
                    <span className="font-bold text-skilllink-green">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
