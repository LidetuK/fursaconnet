import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const TwitterCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Twitter callback - checking URL parameters');
        
        // Check if we have a token in the URL (from backend redirect)
        const twitterStatus = searchParams.get('twitter');
        const errorMessage = searchParams.get('message');
        
        console.log('URL parameters:', { twitterStatus, errorMessage });
        
        if (errorMessage) {
          throw new Error(errorMessage);
        }
        
        if (twitterStatus === 'error') {
          throw new Error('Twitter connection failed');
        }
        
        if (twitterStatus === 'connected') {
          setStatus('success');
          setMessage('Twitter account connected successfully!');
          
          toast({
            title: "Connection Successful",
            description: "Your Twitter account has been connected successfully!"
          });

          // Redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard/social');
          }, 2000);
          
          return;
        }
        
        // If no status, this might be the initial OAuth callback
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        console.log('OAuth parameters:', { code: code ? 'PRESENT' : 'MISSING', state, error });
        
        // Check for OAuth errors first
        if (error) {
          throw new Error(`Twitter OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('Missing code from Twitter callback');
        }

        // Call the backend endpoint for Twitter OAuth 2.0
        console.log('Calling backend Twitter callback endpoint');
        const response = await fetch('https://fursaconnet-production.up.railway.app/auth/twitter2/callback?code=' + encodeURIComponent(code) + (state ? ('&state=' + encodeURIComponent(state)) : ''), {
          method: 'GET',
          credentials: 'include',
        });

        console.log('Backend response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Backend error response:', errorText);
          throw new Error(`OAuth token exchange failed: ${response.status} - ${errorText}`);
        }

        // The backend should redirect us, so if we get here, something went wrong
        const responseText = await response.text();
        console.log('Backend response text:', responseText);
        
        setStatus('success');
        setMessage('Twitter account connected successfully!');
        
        toast({
          title: "Connection Successful",
          description: "Your Twitter account has been connected successfully!"
        });

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard/social');
        }, 2000);
        
      } catch (error: any) {
        console.error('Twitter callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to connect Twitter account');
        
        toast({
          title: "Connection Failed",
          description: error.message || 'Failed to connect your Twitter account',
          variant: "destructive"
        });

        // Clear state from storage on error
        localStorage.removeItem('twitter_auth_state');
      }
    };

    handleCallback();
  }, [navigate, toast, searchParams]);

  const handleReturnToDashboard = () => {
    navigate('/dashboard/social');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skilllink-green mx-auto mb-4"></div>
            <p className="text-gray-700">Connecting to Twitter...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-600 font-semibold">{message}</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting to dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="text-red-600 font-semibold mb-4">{message}</p>
            <button 
              onClick={handleReturnToDashboard}
              className="bg-skilllink-green text-white px-6 py-2 rounded-md hover:bg-skilllink-dark-green transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TwitterCallback;
