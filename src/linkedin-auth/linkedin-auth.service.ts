import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LinkedInAuthService {
  constructor(private configService: ConfigService) {}

  getLinkedInAuthUrl(state: string): string {
    const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
    const redirectUri = this.configService.get<string>('LINKEDIN_REDIRECT_URI');
    if (!clientId || !redirectUri) {
      throw new Error('Missing LINKEDIN_CLIENT_ID or LINKEDIN_REDIRECT_URI in environment variables');
    }
    const scope = [
      'openid',
      'profile',
      'w_member_social',
      'email',
    ].join(' ');
    const url =
      'https://www.linkedin.com/oauth/v2/authorization' +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;
    return url;
  }

  async getTokens(code: string): Promise<any> {
    const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
    const clientSecret = this.configService.get<string>('LINKEDIN_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('LINKEDIN_REDIRECT_URI');
    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, or LINKEDIN_REDIRECT_URI in environment variables');
    }
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });
    const { data } = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    // Fetch LinkedIn user info using OpenID Connect endpoint
    const { data } = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  }

  async postToLinkedIn(accessToken: string, linkedinUserId: string, text: string): Promise<any> {
    // LinkedIn API for sharing posts
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const body = {
      author: `urn:li:person:${linkedinUserId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };
    const { data } = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
    });
    return data;
  }

  async postToLinkedInWithImages(accessToken: string, authorUrn: string, text: string, files: Express.Multer.File[]): Promise<any> {
    // 1. Register and upload each image, collect asset URNs
    const assetUrns: string[] = [];
    for (const file of files) {
      // Register upload
      const registerRes = await axios.post(
        'https://api.linkedin.com/v2/assets?action=registerUpload',
        {
          registerUploadRequest: {
            owner: authorUrn,
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            serviceRelationships: [
              {
                identifier: 'urn:li:userGeneratedContent',
                relationshipType: 'OWNER',
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );
      const asset = registerRes.data.value.asset;
      const uploadUrl = registerRes.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      // Upload image binary
      await axios.post(uploadUrl, file.buffer, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': file.mimetype,
        },
      });
      assetUrns.push(asset);
    }
    // 2. Create the post referencing all image assets
    const url = 'https://api.linkedin.com/v2/ugcPosts';
    const media = assetUrns.map(asset => ({
      status: 'READY',
      media: asset,
    }));
    const body = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text,
          },
          shareMediaCategory: 'IMAGE',
          media,
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };
    const { data } = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
    });
    return data;
  }
} 
