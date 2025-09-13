
import { useState, useEffect, useRef } from 'react';
import { Check, ChevronRight, MessageSquare, FileText, Users, Lightbulb, Zap, LineChart } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Discovery & Consultation',
    icon: <MessageSquare className="w-6 h-6" />,
    description: 'We start by understanding your business goals, target audience, and specific needs through an in-depth consultation process.',
    details: [
      'Free initial consultation call',
      'Business goals assessment',
      'Market and competitor analysis',
      'Project scope definition',
      'Timeline and budget discussion'
    ],
    color: 'bg-[#E3F6F5]',
    iconColor: 'text-[#2C3E50]'
  },
  {
    id: 2,
    title: 'Strategy Development',
    icon: <Lightbulb className="w-6 h-6" />,
    description: 'Our team creates a comprehensive strategy tailored to your specific business requirements and objectives.',
    details: [
      'Custom solution planning',
      'Technology stack selection',
      'Marketing channel prioritization',
      'Content strategy development',
      'KPI definition and success metrics'
    ],
    color: 'bg-[#F2E3FF]',
    iconColor: 'text-[#6C5CE7]'
  },
  {
    id: 3,
    title: 'Implementation & Development',
    icon: <Zap className="w-6 h-6" />,
    description: 'Our experienced team brings the strategy to life with high-quality implementation and development work.',
    details: [
      'Website/app development',
      'SEO implementation',
      'Campaign setup and launch',
      'Content creation and publishing',
      'Regular progress updates'
    ],
    color: 'bg-[#D4EDDA]',
    iconColor: 'text-[#F97415]'
  },
  {
    id: 4,
    title: 'Testing & Refinement',
    icon: <FileText className="w-6 h-6" />,
    description: 'We thoroughly test all aspects of your digital solution to ensure optimal performance and user experience.',
    details: [
      'Cross-device compatibility testing',
      'Performance optimization',
      'User experience evaluation',
      'A/B testing for campaigns',
      'Security and functionality verification'
    ],
    color: 'bg-[#FFE5D9]',
    iconColor: 'text-[#FF6B6B]'
  },
  {
    id: 5,
    title: 'Launch & Training',
    icon: <Users className="w-6 h-6" />,
    description: 'We ensure a smooth launch and provide training for you and your team to effectively manage your digital assets.',
    details: [
      'Coordinated launch planning',
      'Comprehensive team training',
      'Documentation provision',
      'Post-launch support',
      'Knowledge transfer sessions'
    ],
    color: 'bg-[#FFEDD8]',
    iconColor: 'text-[#F39C12]'
  },
  {
    id: 6,
    title: 'Monitoring & Optimization',
    icon: <LineChart className="w-6 h-6" />,
    description: 'Our relationship continues with ongoing monitoring, reporting, and optimization to ensure long-term success.',
    details: [
      'Regular performance reporting',
      'Data-driven optimization',
      'Trend monitoring',
      'Continuous improvement',
      'Strategic adjustment recommendations'
    ],
    color: 'bg-[#E0F7FA]',
    iconColor: 'text-[#00ACC1]'
  }
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Setup intersection observer to detect which step is currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepsRefs.current.findIndex(ref => ref === entry.target);
            if (index !== -1) {
              setActiveStep(index + 1);
            }
          }
        });
      },
      { 
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when element is centered in viewport
        threshold: 0.1
      }
    );

    // Observe all step elements
    stepsRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      stepsRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Handle manual step selection
  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    
    // Scroll to the selected step content
    if (stepsRefs.current[stepId - 1]) {
      stepsRefs.current[stepId - 1]?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <section id="how-it-works" className="section-padding" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">How We Work</h2>
          <p className="section-subtitle">
            Our proven process ensures quality results and a seamless experience
          </p>
        </div>

        <div className="md:flex gap-8 relative">
          {/* Steps sidebar - fixed position */}
          <div className="md:w-1/3 mb-8 md:mb-0">
            <div className="md:sticky md:top-32 space-y-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    activeStep === step.id
                      ? 'bg-skilllink-green text-white shadow-md'
                      : 'bg-white hover:bg-skilllink-green/10 border'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      activeStep === step.id ? 'bg-white' : step.color
                    }`}
                  >
                    <span
                      className={
                        activeStep === step.id ? 'text-skilllink-green' : step.iconColor
                      }
                    >
                      {step.icon}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Step {step.id}</p>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  {activeStep === step.id && (
                    <ChevronRight className="ml-auto" size={20} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content area - scrollable */}
          <div className="md:w-2/3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={el => { stepsRefs.current[index] = el; }}
                className={`bg-white rounded-xl shadow-lg p-8 mb-12 transition-all duration-500`}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} ${step.iconColor} mb-6`}
                >
                  {step.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-skilllink-dark-gray mb-8 max-w-2xl">{step.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">What We Do in This Phase:</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={18} className="text-skilllink-green mt-1 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`${step.color} rounded-xl p-6`}>
                    <h4 className="font-semibold mb-4">Why This Matters:</h4>
                    <p className="text-skilllink-dark-gray">
                      This critical phase ensures that we {step.id === 1 ? 'understand your unique needs' 
                      : step.id === 2 ? 'create a roadmap for success'
                      : step.id === 3 ? 'bring your vision to life effectively'
                      : step.id === 4 ? 'deliver a flawless end product'
                      : step.id === 5 ? 'empower you to maintain success'
                      : 'continuously improve your results'}. 
                      Our approach is designed to maximize your return on investment while minimizing risks and challenges.
                    </p>
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

export default HowItWorks;
