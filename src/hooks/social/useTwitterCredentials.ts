
import { useState, useEffect } from 'react';
import { socialMediaService } from '@/services/socialMediaService';
import { useToast } from '@/hooks/use-toast';

export const useTwitterCredentials = () => {
  const [twitterCredentialsValid, setTwitterCredentialsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if Twitter credentials are valid
  const checkTwitterCredentials = async () => {
    setIsLoading(true);
    try {
      await socialMediaService.testTwitterConnection();
      setTwitterCredentialsValid(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error testing Twitter credentials:', error);
      setTwitterCredentialsValid(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkTwitterCredentials();
  }, []);

  const refreshCredentials = () => {
    setTwitterCredentialsValid(null);
    toast({
      title: "Checking Twitter API",
      description: "Verifying your Twitter API credentials..."
    });
    checkTwitterCredentials();
  };

  return {
    twitterCredentialsValid,
    isLoading,
    checkTwitterCredentials,
    refreshCredentials
  };
};
