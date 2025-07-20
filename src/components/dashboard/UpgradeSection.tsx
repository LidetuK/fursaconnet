
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Check, Star } from 'lucide-react';

interface UpgradeSectionProps {
  currentPackage: string;
}

const UpgradeSection = ({ currentPackage }: UpgradeSectionProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Don't show upgrade section if user already has enterprise package
  if (currentPackage === 'enterprise') {
    return null;
  }

  const getUpgradeOptions = () => {
    if (currentPackage === 'starter') {
      return [
        {
          id: 'professional',
          name: 'Professional',
          price: 20000,
          description: 'Advanced features for growing businesses',
          features: [
            'Advanced SEO Optimization',
            'Social Media Management',
            'Content Creation (4 blogs/month)',
            'Google Ads Management',
            'Bi-weekly Reports'
          ],
          popular: true
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 50000,
          description: 'Complete solution for established businesses',
          features: [
            'Everything in Professional',
            'E-commerce Functionality',
            'Complete SEO & PPC Management',
            'Weekly Reports',
            'Dedicated Account Manager'
          ],
          popular: false
        }
      ];
    } else {
      return [
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 50000,
          description: 'Complete solution for established businesses',
          features: [
            'Everything in Professional',
            'E-commerce Functionality',
            'Complete SEO & PPC Management',
            'Weekly Reports',
            'Dedicated Account Manager'
          ],
          popular: true
        }
      ];
    }
  };

  const handleUpgrade = async (packageId: string) => {
    setLoading(true);
    try {
      // Navigate to payment page with selected package
      navigate('/payment', { 
        state: { 
          packageType: packageId,
          upgrade: true 
        } 
      });
    } catch (error) {
      console.error('Error initiating upgrade:', error);
    } finally {
      setLoading(false);
    }
  };

  const upgradeOptions = getUpgradeOptions();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upgrade Your Package</h2>
        <p className="text-gray-600">
          Unlock more features and capabilities for your business
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {upgradeOptions.map((option) => (
          <Card 
            key={option.id} 
            className={`relative ${option.popular ? 'ring-2 ring-skilllink-green' : ''}`}
          >
            {option.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-skilllink-green text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {option.name}
                <span className="text-2xl font-bold">
                  ETB {option.price.toLocaleString()}/mo
                </span>
              </CardTitle>
              <p className="text-gray-600">{option.description}</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2 mb-6">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-skilllink-green mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={() => handleUpgrade(option.id)}
                disabled={loading}
                className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Upgrade to {option.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          All upgrades are processed securely. You can change or cancel your subscription at any time.
        </p>
      </div>
    </div>
  );
};

export default UpgradeSection;
