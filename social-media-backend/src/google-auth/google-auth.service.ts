import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleAuthService {
  constructor(private configService: ConfigService) {}

  getGoogleAuthUrl(): string {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    if (!clientId || !redirectUri) {
      throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI in environment variables');
    }
    const scope = [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/business.manage',
    ].join(' ');
    const url =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline` +
      `&prompt=consent`;
    return url;
  }

  async getTokens(code: string): Promise<any> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI in environment variables');
    }
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    };
    const { data } = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: [(data) => new URLSearchParams(data).toString()],
    });
    return data;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  }
}
