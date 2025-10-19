
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Statistics from '@/components/Statistics';
import Features from '@/components/Features';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Portfolio from '@/components/Portfolio';
import HowItWorks from '@/components/HowItWorks';
import Clients from '@/components/Clients';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import MeetExperts from '@/components/MeetExperts';
import ChatWithUs from '@/components/ChatWithUs';
import FAQ from '@/components/FAQ';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import PlatformWidget from '@/components/widgets/PlatformWidget';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      {/* <Statistics /> */}
      <Services />
      {/* <Process /> */}
      <Portfolio />
       {/* Temporarily hidden pricing section - uncomment to show pricing */}
      {/* <Pricing /> */}
      {/*<Process /> */}
      {/*<HowItWorks />*/}
      <Clients />
      <Testimonials />
      <MeetExperts />
      <ChatWithUs />
      {/*<FAQ />*/}
      <div id="ai-assistant" className="ai-assistant-container">
        <AIAssistant />
      </div>
      <PlatformWidget />
      <Footer />

      {/* Add a style tag to ensure AI Assistant and PlatformWidget don't overlap */}
      <style>
        {`
        .ai-assistant-container {
          position: relative;
          z-index: 49;
        }
        `}
      </style>
    </div>
  );
};

export default Index;
