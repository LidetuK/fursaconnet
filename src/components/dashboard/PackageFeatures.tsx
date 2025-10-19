
import { Check } from 'lucide-react';
import UpgradeSection from './UpgradeSection';

interface PackageFeaturesProps {
  packageType: string;
}

const PackageFeatures = ({ packageType }: PackageFeaturesProps) => {
  // Features based on package type
  const features = {
    starter: [
      'Basic Responsive Website (5 pages)',
      'Basic SEO Setup',
      'Social Media Setup',
      'Email Marketing Setup',
      'Monthly Performance Report'
    ],
    professional: [
      'Custom Website Development (10 pages)',
      'Advanced SEO Optimization',
      'Social Media Setup & Management',
      'Email Marketing Campaigns',
      'Content Creation (4 blogs/month)',
      'Bi-weekly Performance Reports',
      'Google Ads Management'
    ],
    enterprise: [
      'Custom Website/App Development',
      'Full Digital Marketing Suite',
      'E-commerce Functionality',
      'Content Strategy & Creation',
      'Social Media Management',
      'Complete SEO & PPC Management',
      'Email Marketing Automation',
      'Weekly Performance Reports',
      'Conversion Rate Optimization',
      'Dedicated Account Manager'
    ]
  };

  // Get features for the current package - temporarily showing enterprise features for all users
  const packageFeatures = features.enterprise; // Changed to always show enterprise features
  
  // Get package name for display
  const packageName = 'All Features Access'; // Changed to reflect temporary access
  
  // Get package price for display - temporarily hidden
  const packagePrice = 'Free Access'; // Changed to reflect temporary free access

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{packageName}</h2>
          <p className="mt-1 text-sm text-gray-600">{packagePrice} - All features temporarily available</p>
        </div>
        
        <div className="p-6">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packageFeatures.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-skilllink-green">
                  <Check className="h-5 w-5" />
                </div>
                <p className="ml-3 text-sm text-gray-700">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Temporarily commenting out upgrade section - all users have access to all features */}
      {/* Show upgrade section only for non-enterprise packages */}
      {/* {packageType !== 'enterprise' && (
        <div className="bg-white rounded-lg shadow p-6">
          <UpgradeSection currentPackage={packageType} />
        </div>
      )} */}
    </div>
  );
};

export default PackageFeatures;
