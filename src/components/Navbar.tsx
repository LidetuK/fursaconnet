
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, TrendingUp, Users, Rocket, Brain, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ModernAuthModal from './ModernAuthModal';
import HeaderPopup from './HeaderPopup';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleFeatureClick = (featureId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      x: rect.left,
      y: rect.bottom
    });
    setActivePopup(activePopup === featureId ? null : featureId);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const featureData = {
    'ai-powered': {
      title: 'AI-Powered Intelligence',
      description: 'Harness the power of artificial intelligence to automate complex workflows, optimize strategies, and accelerate your business growth.',
      benefits: [
        'Automated content generation and optimization',
        'Intelligent data analysis and insights',
        'Predictive analytics for better decision making',
        'Smart workflow automation',
        'Personalized customer experiences'
      ],
      features: [
        'Advanced machine learning algorithms',
        'Natural language processing',
        'Computer vision capabilities',
        'Real-time data processing',
        'Automated reporting and analytics'
      ]
    },
    'analytics': {
      title: 'Advanced Analytics',
      description: 'Get deep insights into your business performance with real-time analytics, custom dashboards, and predictive modeling.',
      benefits: [
        'Real-time performance monitoring',
        'Custom dashboard creation',
        'Automated report generation',
        'Data-driven decision making',
        'ROI tracking and optimization'
      ],
      features: [
        'Interactive data visualizations',
        'Custom KPI tracking',
        'Predictive trend analysis',
        'Multi-channel attribution',
        'Advanced segmentation tools'
      ]
    },
    'team-hub': {
      title: 'Team Collaboration Hub',
      description: 'Connect your team with powerful collaboration tools, project management features, and seamless communication channels.',
      benefits: [
        'Streamlined team communication',
        'Centralized project management',
        'Real-time collaboration tools',
        'Task tracking and assignment',
        'Progress monitoring and reporting'
      ],
      features: [
        'Real-time messaging and video calls',
        'Shared workspaces and documents',
        'Task management system',
        'File sharing and version control',
        'Team performance analytics'
      ]
    },
    'scale-fast': {
      title: 'Rapid Scaling Solutions',
      description: 'Scale your business rapidly with our growth-focused tools, automation systems, and scalable infrastructure.',
      benefits: [
        'Automated business processes',
        'Scalable infrastructure solutions',
        'Growth optimization strategies',
        'Performance monitoring tools',
        'Cost-effective scaling methods'
      ],
      features: [
        'Auto-scaling infrastructure',
        'Process automation tools',
        'Performance optimization',
        'Load balancing and CDN',
        'Growth tracking dashboards'
      ]
    },
    'smart-tools': {
      title: 'Intelligent Smart Tools',
      description: 'Access a comprehensive suite of intelligent tools designed to enhance productivity and streamline your business operations.',
      benefits: [
        'Increased productivity and efficiency',
        'Automated routine tasks',
        'Smart recommendations and insights',
        'Integrated workflow management',
        'Cost savings through automation'
      ],
      features: [
        'AI-powered automation tools',
        'Smart scheduling and planning',
        'Intelligent content optimization',
        'Automated quality assurance',
        'Smart resource allocation'
      ]
    },
    'global-reach': {
      title: 'Global Market Reach',
      description: 'Expand your business globally with our international tools, multi-language support, and worldwide infrastructure.',
      benefits: [
        'Access to global markets',
        'Multi-language and currency support',
        'International compliance tools',
        'Global customer support',
        'Worldwide infrastructure access'
      ],
      features: [
        'Multi-region deployment',
        'Localization and translation tools',
        'International payment processing',
        'Global CDN and hosting',
        'Cross-border compliance management'
      ]
    }
  };

  const dynamicFeatures = [
    { 
      icon: <Zap className="w-4 h-4" />, 
      label: "AI-Powered", 
      description: "Smart automation",
      sectionId: "ai-assistant",
      featureId: "ai-powered"
    },
    { 
      icon: <TrendingUp className="w-4 h-4" />, 
      label: "Analytics", 
      description: "Real-time insights",
      sectionId: "statistics",
      featureId: "analytics"
    },
    { 
      icon: <Users className="w-4 h-4" />, 
      label: "Team Hub", 
      description: "Collaboration tools",
      sectionId: "testimonials",
      featureId: "team-hub"
    },
    { 
      icon: <Rocket className="w-4 h-4" />, 
      label: "Scale Fast", 
      description: "Growth solutions",
      sectionId: "services",
      featureId: "scale-fast"
    },
    { 
      icon: <Brain className="w-4 h-4" />, 
      label: "Smart Tools", 
      description: "Intelligent features",
      sectionId: "features",
      featureId: "smart-tools"
    },
    { 
      icon: <Globe className="w-4 h-4" />, 
      label: "Global Reach", 
      description: "Worldwide access",
      sectionId: "portfolio",
      featureId: "global-reach"
    },
  ];

  return (
    <>
      <header className={cn(
        "bg-white/95 backdrop-blur-xl border-b border-emerald-100/50 sticky top-0 z-50 transition-all duration-500",
        isScrolled ? "shadow-lg shadow-emerald-500/10 py-2" : "py-4"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Large Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="https://res.cloudinary.com/dkzw06zke/image/upload/v1750003246/skill_link_premium_yjv3bn.png"
                  alt="SkillLink Premium"
                  className={cn(
                    "transition-all duration-500",
                    isScrolled ? "h-12" : "h-16 md:h-20"
                  )}
                />
              </Link>
            </div>

            {/* Dynamic Features Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {dynamicFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={(e) => handleFeatureClick(feature.featureId, e)}
                  className="group relative px-3 py-2 rounded-xl hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-gray-700 group-hover:text-emerald-600 transition-colors">
                    <div className="p-1.5 rounded-lg bg-emerald-100/50 group-hover:bg-emerald-100 transition-colors">
                      {feature.icon}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">{feature.label}</div>
                      <div className="text-xs text-gray-500 group-hover:text-emerald-500">{feature.description}</div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </nav>

            {/* Auth Button */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                onClick={openAuthModal}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden pt-6 pb-4 bg-white/95 backdrop-blur-xl rounded-b-2xl mt-4 shadow-xl border border-emerald-100/50">
              <div className="grid grid-cols-2 gap-3 px-3 mb-6">
                {dynamicFeatures.map((feature, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      handleFeatureClick(feature.featureId, e);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100">
                      {feature.icon}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800">{feature.label}</div>
                      <div className="text-xs text-gray-600">{feature.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="border-t border-emerald-100 pt-4 mt-4 px-3">
                <Button
                  onClick={openAuthModal}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg"
                >
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Header Popups */}
      {activePopup && featureData[activePopup as keyof typeof featureData] && (
        <HeaderPopup
          feature={featureData[activePopup as keyof typeof featureData]}
          isOpen={!!activePopup}
          onClose={closePopup}
          position={popupPosition}
        />
      )}

      <ModernAuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        initialTab="signin"
      />
    </>
  );
};

export default Navbar;
