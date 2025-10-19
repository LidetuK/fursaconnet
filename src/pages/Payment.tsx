
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ArrowLeft, Check } from 'lucide-react';
import { trackInitiateCheckout, trackPurchase } from '@/lib/facebook-events';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [packageType, setPackageType] = useState<string>('starter');
  const [isUpgrade, setIsUpgrade] = useState<boolean>(false);
  
  // Get package information from location state or URL params
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    let selectedPackage = '';
    let upgradeFlag = false;
    
    if (location.state?.packageType) {
      selectedPackage = location.state.packageType;
      upgradeFlag = location.state.upgrade || false;
    } else {
      const params = new URLSearchParams(location.search);
      selectedPackage = params.get('packageType') || 'starter';
      upgradeFlag = params.get('upgrade') === 'true';
    }
    
    setPackageType(selectedPackage);
    setIsUpgrade(upgradeFlag);
    // Track page view when component mounts
    trackInitiateCheckout();
  }, [location, navigate, user]);
  
  // Get pricing details based on package type
  const getPriceDetails = () => {
    switch (packageType) {
      case 'professional':
        return { monthly: 20000, yearly: 17000, name: 'Professional' };
      case 'enterprise':
        return { monthly: 50000, yearly: 42500, name: 'Enterprise' };
      default:
        return { monthly: 10000, yearly: 8500, name: 'Starter' };
    }
  };
  
  const priceDetails = getPriceDetails();
  
  const handlePayment = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll simulate a successful payment and redirect
      // In a real implementation, this would connect to Stripe
      
      toast({
        title: isUpgrade ? "Upgrade processing" : "Payment processing",
        description: isUpgrade ? "Processing your package upgrade..." : "Processing your payment..."
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save package selection to user profile
      await supabase.from('subscriptions').upsert({
        user_id: user?.id,
        package_type: packageType,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      });
      
      // Save package to localStorage as a fallback
      localStorage.setItem('skilllink_package', packageType);
      
      // Track successful purchase
      trackPurchase(priceDetails.monthly, 'ETB');
      
      toast({
        title: isUpgrade ? "Upgrade successful!" : "Payment successful!",
        description: isUpgrade ? "Your package has been upgraded successfully." : "Your account has been activated."
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: isUpgrade ? "Upgrade failed" : "Payment failed",
        description: error.message || `There was an error processing your ${isUpgrade ? 'upgrade' : 'payment'}.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => navigate(isUpgrade ? '/dashboard' : '/pricing')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to {isUpgrade ? 'Dashboard' : 'Pricing'}
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            {isUpgrade ? 'Upgrade Your Subscription' : 'Complete Your Subscription'}
          </h1>
          <p className="text-skilllink-dark-gray text-center mb-8">
            {isUpgrade 
              ? `You're upgrading to the ${priceDetails.name} package` 
              : "You're just one step away from accessing our premium services"
            }
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {isUpgrade ? 'Review your upgrade details' : 'Review your subscription details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <h3 className="font-medium">{priceDetails.name} Package</h3>
                    <p className="text-sm text-skilllink-dark-gray">
                      {isUpgrade ? 'Upgrade to monthly billing' : 'Monthly billing'}
                    </p>
                  </div>
                  <span className="font-bold">ETB {priceDetails.monthly.toLocaleString()}/month</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span>ETB {priceDetails.monthly.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">VAT (15%)</span>
                  <span>ETB {(priceDetails.monthly * 0.15).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">ETB {(priceDetails.monthly * 1.15).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <Button 
                  className="w-full bg-skilllink-green hover:bg-skilllink-dark-green" 
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  {isUpgrade ? 'Complete Upgrade' : 'Complete Payment'}
                </Button>
                <p className="text-xs text-center text-skilllink-dark-gray">
                  By completing your {isUpgrade ? 'upgrade' : 'purchase'}, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </CardFooter>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-skilllink-dark-gray mb-2">
              Need help? Contact our support team at support@skilllink.com
            </p>
            <p className="text-xs text-skilllink-dark-gray">
              Payments are securely processed. We don't store your payment information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
