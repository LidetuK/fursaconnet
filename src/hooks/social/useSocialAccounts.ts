import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from "@/integrations/supabase/client";

export interface SocialAccount {
  platform: string;
  platform_user_id: string;
  metadata: any;
}

export const useSocialAccounts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);

  // Load user's connected social accounts from backend
  const loadUserSocialAccounts = useCallback(async () => {
    if (!user) return [];
    setIsLoading(true);
    try {
      let accounts: SocialAccount[] = [];
      try {
        // Fetch from backend
        const res = await fetch('https://fursaconnet-production.up.railway.app/user/social-accounts', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch social accounts');
        const data = await res.json();
        if (Array.isArray(data.accounts)) {
          accounts = data.accounts;
          setSocialAccounts(accounts);
        }
      } catch (dbError) {
        console.log('Backend social accounts fetch error:', dbError);
        // Continue with empty accounts
      }
      setIsLoading(false);
      return accounts;
    } catch (err) {
      console.error('Error loading social accounts:', err);
      toast({
        title: "Error",
        description: "Failed to load connected social accounts",
        variant: "destructive"
      });
      setIsLoading(false);
      return [];
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      loadUserSocialAccounts();
    }
  }, [user, loadUserSocialAccounts]);

  return {
    socialAccounts: socialAccounts || [],
    isLoading,
    loadUserSocialAccounts
  };
};
