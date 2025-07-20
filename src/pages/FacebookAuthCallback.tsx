
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { trackCustomEvent } from '@/lib/facebook-events';

const FacebookAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your authentication...');

  useEffect(() => {
    // Track page view
    trackCustomEvent('FacebookAuthCallback');
    
    // In a real implementation, we would handle token exchange here
    // For now, we'll just simulate a successful callback
    
    setTimeout(() => {
      setStatus('success');
      setMessage('Authentication successful! Redirecting you to the dashboard...');
      
      toast({
        title: "Login successful!",
        description: "You have successfully authenticated with Facebook."
      });
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1500);
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Facebook Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {status === 'processing' && (
              <Loader2 className="h-10 w-10 animate-spin text-skilllink-green mb-4" />
            )}
            {status === 'success' && (
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <p className="text-gray-700">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacebookAuthCallback;
