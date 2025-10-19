import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { generateRandomString, pkceChallengeFromVerifier } from '@/utils/pkce';
import { supabase } from '@/integrations/supabase/client';

export interface SocialAccount {
  platform: string;
  connected: boolean;
  username?: string;
  loading?: boolean;
}

export const useSocialMediaConnections = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([
    { platform: 'facebook', connected: false, username: '' },
    { platform: 'instagram', connected: false, username: '' },
    { platform: 'twitter', connected: false, username: '' },
    { platform: 'linkedin', connected: false, username: '' }
  ]);

  // Placeholder: In the future, implement real connection status check
  const checkConnectionStatus = async () => {
    // No-op for now
  };

  // Placeholder: In the future, implement real connect logic
  const connectAccount = async (platform: string) => {
    if (platform === 'twitter') {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to connect your Twitter account.",
          variant: "destructive"
        });
        return;
      }
      setLoading(true);
      try {
        // Redirect to backend Twitter OAuth 2.0 endpoint
        window.location.href = 'https://fursaconnet-production.up.railway.app/auth/twitter2';
      } catch (error) {
        console.error('Error initiating Twitter OAuth:', error);
        toast({
          title: "Connection Failed",
          description: `Failed to connect to Twitter. Please try again.`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
      return;
    }
    if (platform === 'linkedin') {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to connect your LinkedIn account.",
          variant: "destructive"
        });
        return;
      }
      setLoading(true);
      try {
        // Redirect to backend LinkedIn OAuth endpoint
        window.location.href = 'https://fursaconnet-production.up.railway.app/auth/linkedin';
      } catch (error) {
        console.error('Error initiating LinkedIn OAuth:', error);
        toast({
          title: "Connection Failed",
          description: `Failed to connect to LinkedIn. Please try again.`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
      return;
    }
    // Default for other platforms
    toast({
      title: "Not Implemented",
      description: `Connecting to ${platform} is not implemented yet.`,
      variant: "destructive"
    });
  };

  // Placeholder: In the future, implement real disconnect logic
  const disconnectAccount = async (platform: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to disconnect your account.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      // Call backend to disconnect the social account
      const response = await fetch(`https://fursaconnet-production.up.railway.app/user/social-accounts/${platform}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to disconnect from ${platform}.`);
      }
      // Update local state
      setConnectedAccounts(prev =>
        prev.map(acc =>
          acc.platform === platform
            ? { ...acc, connected: false, username: '' }
            : acc
        )
      );
      toast({
        title: "Disconnected",
        description: `Successfully disconnected from ${platform}.`
      });
    } catch (error: any) {
      toast({
        title: "Disconnection Failed",
        description: error.message || `Failed to disconnect from ${platform}.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch social accounts for the current user
  const fetchConnections = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      setConnectedAccounts(prev =>
        prev.map(acc =>
          data.some(d => d.platform === acc.platform)
            ? {
                ...acc,
                connected: true,
                username: data.find(d => d.platform === acc.platform)?.screen_name || ''
              }
            : acc
        )
      );
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  return {
    connectedAccounts,
    loading,
    connectAccount,
    disconnectAccount,
    checkConnectionStatus,
    twitterCredentialsValid: true // Placeholder
  };
};
