
import { useState } from 'react';
import { useToast } from './use-toast';
import { FB_APP_ID, trackCustomEvent } from '@/lib/facebook-events';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

// Type declaration for Facebook SDK
interface FacebookSDK {
  login: (callback: (response: { authResponse: any; status: string }) => void, options: { scope: string }) => void;
  api: (path: string, callback: (response: any) => void) => void;
  getLoginStatus: (callback: (response: { status: string }) => void) => void;
  init: (options: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }) => void;
}

// Extend Window interface only if it hasn't been extended already
declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

export const useFacebookAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const loginWithFacebook = async (): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect social accounts",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if FB SDK is loaded
      if (!window.FB) {
        await loadFacebookSDK();
      }
      
      // Authenticate with Facebook
      window.FB?.login(async (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          
          // Track Facebook login success
          trackCustomEvent('facebook_login_success', { userId: userID });
          
          // Store token in database using our backend
          try {
            const { data, error } = await supabase.functions.invoke('social-auth', {
              body: {
                path: 'store-facebook-token',
                userId: user.id,
                accessToken,
                platform: 'facebook',
                platformUserId: userID
              }
            });
            
            if (error) throw error;
            
            toast({
              title: "Facebook Connected",
              description: "Your Facebook account has been successfully connected."
            });
            
            // Refresh the social accounts list
            window.location.reload();
          } catch (err) {
            console.error('Error storing Facebook token:', err);
            toast({
              title: "Connection Error",
              description: "Failed to store Facebook connection details.",
              variant: "destructive"
            });
          }
        } else {
          trackCustomEvent('facebook_login_cancelled');
          toast({
            title: "Connection Cancelled",
            description: "Facebook connection was cancelled.",
            variant: "destructive"
          });
        }
        
        setIsLoading(false);
      }, { scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts' });
    } catch (error) {
      console.error('Facebook auth error:', error);
      trackCustomEvent('facebook_login_error', { error: String(error) });
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect with Facebook. Please try again.",
        variant: "destructive"
      });
      
      setIsLoading(false);
    }
  };

  const loadFacebookSDK = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Load the Facebook SDK asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return resolve();
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        if (fjs && fjs.parentNode) {
          fjs.parentNode.insertBefore(js, fjs);
        } else {
          d.getElementsByTagName('head')[0].appendChild(js);
        }
        
        // Initialize once loaded
        window.fbAsyncInit = function() {
          if (window.FB) {
            window.FB.init({
              appId: FB_APP_ID,
              cookie: true,
              xfbml: true,
              version: 'v17.0'
            });
            resolve();
          } else {
            reject(new Error('Facebook SDK not available'));
          }
        };
      }(document, 'script', 'facebook-jssdk'));
    });
  };

  return {
    loginWithFacebook,
    isLoading
  };
};
