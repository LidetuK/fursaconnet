
import { useState } from 'react';
import { Check, X } from 'lucide-react';
import AuthModal from './AuthModal';
import { useNavigate } from 'react-router-dom';

const pricingOptions = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses just getting started with their online presence.',
    price: {
      monthly: 10000,
      yearly: 8500,
    },
    features: [
      { included: true, text: 'Basic Responsive Website (5 pages)' },
      { included: true, text: 'Basic SEO Setup' },
      { included: true, text: 'Social Media Setup' },
      { included: true, text: 'Email Marketing Setup' },
      { included: true, text: 'Monthly Performance Report' },
      { included: false, text: 'Advanced SEO Optimization' },
      { included: false, text: 'Content Creation (2 blogs/month)' },
      { included: false, text: 'Social Media Management' },
      { included: false, text: 'Conversion Rate Optimization' },
      { included: false, text: 'Dedicated Account Manager' },
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses looking to expand their digital footprint.',
    price: {
      monthly: 20000,
      yearly: 17000,
    },
    features: [
      { included: true, text: 'Custom Website Development (10 pages)' },
      { included: true, text: 'Advanced SEO Optimization' },
      { included: true, text: 'Social Media Setup & Management' },
      { included: true, text: 'Email Marketing Campaigns' },
      { included: true, text: 'Content Creation (4 blogs/month)' },
      { included: true, text: 'Bi-weekly Performance Reports' },
      { included: true, text: 'Google Ads Management' },
      { included: false, text: 'E-commerce Functionality' },
      { included: false, text: 'Conversion Rate Optimization' },
      { included: false, text: 'Dedicated Account Manager' },
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Comprehensive solution for established businesses with complex digital needs.',
    price: {
      monthly: 50000,
      yearly: 42500,
    },
    features: [
      { included: true, text: 'Custom Website/App Development' },
      { included: true, text: 'Full Digital Marketing Suite' },
      { included: true, text: 'E-commerce Functionality' },
      { included: true, text: 'Content Strategy & Creation' },
      { included: true, text: 'Social Media Management' },
      { included: true, text: 'Complete SEO & PPC Management' },
      { included: true, text: 'Email Marketing Automation' },
      { included: true, text: 'Weekly Performance Reports' },
      { included: true, text: 'Conversion Rate Optimization' },
      { included: true, text: 'Dedicated Account Manager' },
    ],
    cta: 'Get Started',
    highlight: false,
  },
];

const Pricing = () => {
  const [billing, setBilling] = useState('monthly');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>();
  const navigate = useNavigate();

  const handleGetStarted = (planId: string) => {
    setSelectedPackage(planId);
    setModalOpen(true);
  };

  return (
    <section id="pricing" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the plan that's right for your business needs
          </p>

          <div className="inline-flex items-center bg-skilllink-gray p-1 rounded-lg mt-8">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-white text-skilllink-black shadow-sm'
                  : 'text-skilllink-dark-gray'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                billing === 'yearly'
                  ? 'bg-white text-skilllink-black shadow-sm'
                  : 'text-skilllink-dark-gray'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-skilllink-green text-white px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingOptions.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                plan.highlight
                  ? 'shadow-xl ring-2 ring-skilllink-green scale-105 z-10'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.highlight && (
                <div className="bg-skilllink-green text-white text-sm text-center py-2 font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-skilllink-dark-gray mb-6 min-h-[50px]">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl md:text-4xl font-bold">
                      ETB {billing === 'monthly' ? plan.price.monthly.toLocaleString() : plan.price.yearly.toLocaleString()}
                    </span>
                    <span className="text-skilllink-dark-gray ml-2">/month</span>
                  </div>
                  {billing === 'yearly' && (
                    <p className="text-sm text-skilllink-green mt-2">
                      Billed annually (ETB {(plan.price.yearly * 12).toLocaleString()}/year)
                    </p>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check size={18} className="text-skilllink-green mt-1 flex-shrink-0" />
                      ) : (
                        <X size={18} className="text-gray-300 mt-1 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleGetStarted(plan.id)}
                  className={`w-full text-center block py-3 px-6 rounded-md font-medium transition-colors ${
                    plan.highlight
                      ? 'bg-skilllink-green text-white hover:bg-skilllink-dark-green'
                      : 'bg-white border border-skilllink-green text-skilllink-green hover:bg-skilllink-green hover:text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-skilllink-dark-gray mb-6">
            Need a custom solution? We can create a tailored package specific to your business needs.
          </p>
          <a href="#contact" className="btn-primary">
            Contact for Custom Quote
          </a>
        </div>
      </div>
      <AuthModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedPackage={selectedPackage}
      />
    </section>
  );
};

export default Pricing;
