
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What services do you offer?",
    answer: "We offer a comprehensive range of digital services including web development, mobile app development, search engine optimization (SEO), social media marketing, email marketing, content creation, e-commerce solutions, and digital analytics. Our team specializes in creating custom digital solutions tailored to your specific business needs."
  },
  {
    question: "How long does it take to complete a website?",
    answer: "Website development timelines vary based on the complexity and requirements of your project. Typically, a standard business website can be completed in 4-6 weeks, while more complex e-commerce sites or custom web applications may take 8-12 weeks. During our initial consultation, we'll provide a more accurate timeline based on your specific needs."
  },
  {
    question: "What is your pricing structure?",
    answer: "We offer flexible pricing options including project-based pricing and monthly retainer packages. Our starter packages begin at $799/month, with more comprehensive solutions available for growing and enterprise-level businesses. We believe in transparent pricing with no hidden fees, and we'll work with you to find a solution that fits your budget."
  },
  {
    question: "How do you measure the success of digital marketing campaigns?",
    answer: "We measure success through comprehensive analytics and reporting, focusing on key performance indicators (KPIs) that align with your business goals. These may include website traffic, conversion rates, lead generation, engagement metrics, and ROI. We provide regular reports and insights to help you understand the impact of our work."
  },
  {
    question: "Do you offer ongoing maintenance for websites?",
    answer: "Yes, we offer website maintenance packages to ensure your site remains secure, up-to-date, and performing optimally. Our maintenance services include regular updates, security monitoring, performance optimization, content updates, and technical support. We recommend ongoing maintenance for all websites to protect your digital investment."
  },
  {
    question: "How do we get started working together?",
    answer: "Getting started is easy! Simply contact us through our website or call us directly to schedule a free consultation. During this initial meeting, we'll discuss your business goals, project requirements, and how our services can help you achieve success. From there, we'll create a customized proposal outlining our recommended approach, timeline, and pricing."
  },
  {
    question: "Can you help improve our existing website?",
    answer: "Absolutely! We offer website audits and optimization services to improve the performance, design, and functionality of your existing website. Our team can identify areas for improvement in terms of user experience, SEO, conversion optimization, and technical performance, then implement changes to enhance your current site."
  },
  {
    question: "Do you work with businesses of all sizes?",
    answer: "Yes, we work with businesses of all sizes, from startups and small businesses to large enterprises. Our scalable services and flexible pricing options allow us to create customized solutions that meet the specific needs and budgets of each client, regardless of their size or industry."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-padding bg-skilllink-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find answers to the most common questions about our services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left font-medium focus:outline-none"
              >
                <span className="text-lg">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-skilllink-dark-gray">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="mb-6">
            Don't see your question here? Reach out to us directly.
          </p>
          <a href="#contact" className="btn-primary">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
