import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FacebookAuthService {
  constructor(private configService: ConfigService) {}

  getFacebookAuthUrl(state: string): string {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const redirectUri = this.configService.get<string>('FACEBOOK_CALLBACK_URL');
    const scope = 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish';

    if (!clientId || !redirectUri) {
      throw new Error('Facebook OAuth not configured');
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
    const redirectUri = this.configService.get<string>('FACEBOOK_CALLBACK_URL');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Facebook OAuth not configured');
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

  async getInstagramAccounts(pageAccessToken: string): Promise<any[]> {
    try {
      const response = await axios.get('https://graph.facebook.com/v17.0/me/accounts', {
        params: {
          access_token: pageAccessToken,
          fields: 'instagram_business_account{id,username,name,profile_picture_url}',
        },
      });

      const pages = response.data.data || [];
      const instagramAccounts: any[] = [];

      for (const page of pages) {
        if (page.instagram_business_account) {
          instagramAccounts.push(page.instagram_business_account as any);
        }
      }

      return instagramAccounts;
    } catch (error) {
      console.error('Error fetching Instagram accounts:', error);
      return [];
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const clientSecret = this.configService.get<string>('FACEBOOK_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Facebook OAuth not configured');
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
