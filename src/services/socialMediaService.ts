
import { supabase } from '@/integrations/supabase/client';

interface TokenData {
  access_token: string;
  token_secret?: string;
  expires_in?: number;
  screen_name?: string;
}

interface ExchangeTokenParams {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  code: string;
  redirectUri: string;
}

export const socialMediaService = {
  async testTwitterConnection(): Promise<boolean> {
    try {
      // Call the new NestJS backend endpoint for Twitter connection test
      const response = await fetch('/api/auth/twitter2/test', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to test Twitter connection');
      const data = await response.json();
      return data?.success || false;
    } catch (error) {
      console.error('Error testing Twitter connection:', error);
      throw error;
    }
  },

  async exchangeCodeForToken(params: ExchangeTokenParams): Promise<TokenData> {
    try {
      const { data, error } = await supabase.functions.invoke('social-auth', {
        body: {
          path: 'exchange-token',
          ...params
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  },

  async storeSocialToken(userId: string, platform: string, tokenData: TokenData): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .upsert({
          user_id: userId,
          platform,
          access_token: tokenData.access_token,
          token_secret: tokenData.token_secret,
          expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
          screen_name: tokenData.screen_name
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error storing social token:', error);
      throw error;
    }
  }
};
