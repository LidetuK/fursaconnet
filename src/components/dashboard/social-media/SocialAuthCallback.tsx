
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { socialMediaService } from '@/services/socialMediaService';

interface SocialAuthState {
  platform: string;
  userId: string;
  timestamp: number;
}

const SocialAuthCallback = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your authentication...');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get the authorization code from the query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const stateStr = searchParams.get('state');
        
        // Error handling for missing parameters
        if (!code) {
          const error = searchParams.get('error') || 'No authorization code provided';
          throw new Error(error);
        }
        
        if (!stateStr) {
          throw new Error('No state parameter provided');
        }
        
        // Parse the state to get the platform and user ID
        let state: SocialAuthState;
        try {
          state = JSON.parse(decodeURIComponent(stateStr)) as SocialAuthState;
        } catch (e) {
          throw new Error('Invalid state parameter');
        }
        
        const { platform, userId } = state;
        
        // Verify this is the same user who initiated the request
        if (user && userId !== user.id) {
          throw new Error('User ID mismatch');
        }
        
        // Set the redirect URI to match the one used for the initial auth request
        const redirectUri = window.location.origin + '/auth/social-callback';
        
        // Exchange the code for an access token
        setMessage(`Getting access token from ${platform}...`);
        const tokenData = await socialMediaService.exchangeCodeForToken({
          platform: platform as any,
          code,
          redirectUri
        });
        
        // Store the access token in the database
        setMessage(`Storing your ${platform} credentials...`);
        await socialMediaService.storeSocialToken(userId, platform, tokenData);
        
        // Success!
        setStatus('success');
        setMessage(`Successfully connected your ${platform} account!`);
        
        toast({
          title: "Connection Successful",
          description: `Your ${platform} account has been connected successfully.`
        });
        
        // Redirect back to the social media page after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Error processing OAuth callback:', error);
        setStatus('error');
        setMessage(`Error connecting account: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        toast({
          title: "Connection Failed",
          description: `Failed to connect your social media account. Please try again.`,
          variant: "destructive"
        });
      }
    };
    
    processOAuthCallback();
  }, [location.search, user, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Social Media Authentication</CardTitle>
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
            {status === 'success' && (
              <p className="text-sm text-gray-500 mt-2">Redirecting you back to the dashboard...</p>
            )}
            {status === 'error' && (
              <button 
                onClick={() => navigate('/dashboard/social')} 
                className="mt-4 bg-skilllink-green text-white px-4 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialAuthCallback;
