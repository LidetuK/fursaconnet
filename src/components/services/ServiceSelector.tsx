
import { ServiceType } from './types';

interface ServiceSelectorProps {
  services: ServiceType[];
  activeService: string;
  setActiveService: (id: string) => void;
}

const ServiceSelector = ({ services, activeService, setActiveService }: ServiceSelectorProps) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-9 gap-2 md:gap-4 mb-12">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => setActiveService(service.id)}
          className={`p-4 flex flex-col items-center justify-center text-center rounded-lg transition-all duration-300 ${
            activeService === service.id
              ? 'bg-skilllink-green text-white shadow-lg scale-105'
              : 'bg-white hover:bg-skilllink-green/10'
          }`}
        >
          <div className={`mb-2 ${
            activeService === service.id ? 'text-white' : 'text-skilllink-green'
          }`}>
            {service.icon}
          </div>
          <span className="text-xs md:text-sm font-medium line-clamp-2">{service.title}</span>
        </button>
      ))}
    </div>
  );
};

export default ServiceSelector;
