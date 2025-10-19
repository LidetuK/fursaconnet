
import { useState } from 'react';
import ServiceSelector from './services/ServiceSelector';
import ServiceCard from './services/ServiceCard';
import services from './services/servicesData';

const Services = () => {
  const [activeService, setActiveService] = useState(services[0].id);

  return (
    <section id="services" className="section-padding bg-skilllink-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Our Premium Services
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Comprehensive digital solutions to help your business grow and thrive in the online landscape
          </p>
        </div>

        <ServiceSelector 
          services={services} 
          activeService={activeService} 
          setActiveService={setActiveService} 
        />

        <div className="w-full">
          {services.map((service) => (
            <div
              key={service.id}
              className={`transition-all duration-500 ${
                activeService === service.id
                  ? 'opacity-100 max-h-[800px]'
                  : 'opacity-0 max-h-0 absolute -z-10'
              }`}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
