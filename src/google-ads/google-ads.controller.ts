import { Controller, Post, Body, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

// Use environment variables for credentials
const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = process.env.GOOGLE_ADS_REDIRECT_URI || 'http://localhost:3000/auth/google-ads/callback';
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 'YOUR_GOOGLE_ADS_DEVELOPER_TOKEN';
const MCC_ID = process.env.GOOGLE_ADS_MCC_ID || 'YOUR_MCC_ID'; // e.g., '123-456-7890'

@Controller('auth/google-ads')
export class GoogleAdsController {
  // Simulate token storage (in-memory for demo)
  private tokens: any = {};

  @Post('callback')
  async handleCallback(@Body() body: { code: string }, @Res() res: Response) {
    const { code } = body;
    // 1. Exchange code for tokens
    try {
      const tokenRes = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: CLIENT_ID, // <-- Put your Google Ads OAuth client ID here
          client_secret: CLIENT_SECRET, // <-- Put your Google Ads OAuth client secret here
          redirect_uri: REDIRECT_URI, // <-- Must match your Google Cloud config
          grant_type: 'authorization_code',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const { access_token, refresh_token } = tokenRes.data;
      // Simulate storing tokens (associate with user in real app)
      this.tokens['demo-user'] = { access_token, refresh_token };

      // 2. Make a test Google Ads API call (list campaigns)
      try {
        const googleAdsRes = await axios.post(
          `https://googleads.googleapis.com/v13/customers/${MCC_ID}/googleAds:search`,
          {
            query: 'SELECT campaign.id, campaign.name FROM campaign LIMIT 5',
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'developer-token': DEVELOPER_TOKEN, // <-- Put your Google Ads developer token here
              'login-customer-id': MCC_ID, // <-- Put your MCC ID here
              'Content-Type': 'application/json',
            },
          }
        );
        return res.json({
          message: 'Google Ads connected!',
          campaigns: googleAdsRes.data,
        });
      } catch (err: any) {
        return res.status(500).json({
          error: 'Failed to fetch campaigns',
          details: err.response?.data || err.message,
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        error: 'Failed to exchange code',
        details: err.response?.data || err.message,
      });
    }
  }
} 
