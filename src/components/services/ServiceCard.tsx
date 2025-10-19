import { Check } from 'lucide-react';
import { ServiceType } from './types';

interface ServiceCardProps {
  service: ServiceType;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500">
      <div className="md:flex">
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-skilllink-green/10 text-skilllink-green mb-6">
            {service.icon}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h3>
          <p className="text-skilllink-dark-gray mb-6">{service.description}</p>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check size={18} className="text-skilllink-green mt-1 flex-shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          
          <a
            href="#contact"
            className="btn-primary inline-block mt-8"
          >
            Get Started
          </a>
        </div>
        
        <div className="md:w-1/2 bg-skilllink-gray flex items-center justify-center relative">
          {service.id === 'web-dev' && (
            <video
              src="/1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'seo' && (
            <video
              src="/2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'email-marketing' && (
            <video
              src="/3.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'analytics' && (
            <video
              src="/4.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'ecommerce' && (
            <video
              src="/5.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'content' && (
            <video
              src="/6.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'photo-video' && (
            <video
              src="/7.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'sm-marketing' && (
            <video
              src="/10.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
          {service.id === 'consultation' && (
            <video
              src="/11.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-none"
              style={{ minHeight: '300px', background: '#e5e7eb' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
