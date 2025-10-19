import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class InstagramAuthService {
  constructor(private configService: ConfigService) {}

  getInstagramAuthUrl(state: string): string {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const redirectUri = this.configService.get<string>('INSTAGRAM_CALLBACK_URL');
    const scope = 'instagram_basic,instagram_content_publish,pages_show_list';

    if (!clientId || !redirectUri) {
      throw new Error('Instagram OAuth not configured');
    }

    return `https://www.facebook.com/v17.0/dialog/oauth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${encodeURIComponent(state)}` +
      `&response_type=code`;
  }

  async getTokens(code: string): Promise<any> {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('FACEBOOK_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('INSTAGRAM_CALLBACK_URL');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Instagram OAuth not configured');
    }

    const response = await axios.post('https://graph.facebook.com/v17.0/oauth/access_token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
      },
    });

    return response.data;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const response = await axios.get('https://graph.facebook.com/v17.0/me', {
      params: {
        access_token: accessToken,
        fields: 'id,name,first_name,last_name,email',
      },
    });

    return response.data;
  }

  async getUserPages(accessToken: string): Promise<any[]> {
    const response = await axios.get('https://graph.facebook.com/v17.0/me/accounts', {
      params: {
        access_token: accessToken,
        fields: 'id,name,access_token,category',
      },
    });

    return response.data.data || [];
  }

  async getInstagramAccounts(accessToken: string): Promise<any[]> {
    try {
      // First get user's pages
      const pages = await this.getUserPages(accessToken);
      const instagramAccounts: any[] = [];

      // For each page, check if it has an Instagram Business account
      for (const page of pages) {
        try {
          const response = await axios.get(`https://graph.facebook.com/v17.0/${page.id}`, {
            params: {
              access_token: page.access_token,
              fields: 'instagram_business_account{id,username,name,profile_picture_url}',
            },
          });

          if (response.data.instagram_business_account) {
            instagramAccounts.push(response.data.instagram_business_account as any);
          }
        } catch (error) {
          console.error(`Error fetching Instagram account for page ${page.id}:`, error);
        }
      }

      return instagramAccounts;
    } catch (error) {
      console.error('Error fetching Instagram accounts:', error);
      return [];
    }
  }

  async getInstagramUserInfo(instagramUserId: string, accessToken: string): Promise<any> {
    const response = await axios.get(`https://graph.facebook.com/v17.0/${instagramUserId}`, {
      params: {
        access_token: accessToken,
        fields: 'id,username,name,profile_picture_url,followers_count,follows_count,media_count',
      },
    });

    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('FACEBOOK_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Instagram OAuth not configured');
    }

    const response = await axios.post('https://graph.facebook.com/v17.0/oauth/access_token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: refreshToken,
      },
    });

    return response.data;
  }
} 
