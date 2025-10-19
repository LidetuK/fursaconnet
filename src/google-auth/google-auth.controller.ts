import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { DataSource } from 'typeorm';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource
  ) {}

  @Get()
  async googleAuth(@Res() res: Response) {
    const url = this.googleAuthService.getGoogleAuthUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async googleAuthCallback(@Query('code') code: string, @Query('scope') scope: string, @Query('state') state: string, @Res() res: Response, @Req() req: Request) {
    console.log('Google callback received');
    console.log('Code:', code ? 'Present' : 'Missing');
    console.log('Scope:', scope);
    console.log('State:', state);
    
    // Detect the current domain from request headers
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const currentDomain = `${protocol}://${host}`;
    console.log('Current domain detected in Google callback:', currentDomain);
    
    if (!code) {
      return res.status(400).json({ error: 'Missing code' });
    }
    
    try {
      // Check if this is a YouTube OAuth request
      const isYouTubeOAuth = scope && scope.includes('youtube');
      console.log('Is YouTube OAuth:', isYouTubeOAuth);
      
      if (isYouTubeOAuth) {
        // Handle YouTube OAuth - redirect to YouTube callback with state
        const youtubeCallbackUrl = `https://fursaconnet-production.up.railway.app/auth/youtube/callback?code=${code}&scope=${scope}&state=${state}`;
        console.log('Redirecting to YouTube callback:', youtubeCallbackUrl);
        return res.redirect(youtubeCallbackUrl);
      }
      
      // Handle regular Google OAuth
      const tokens = await this.googleAuthService.getTokens(code);
      console.log('Tokens:', tokens);
      const userInfo = await this.googleAuthService.getUserInfo(tokens.access_token);
      console.log('UserInfo:', userInfo);
      
      // Check if this is a Google Business OAuth (has business.manage scope)
      const isGoogleBusinessOAuth = scope && scope.includes('business.manage');
      console.log('Is Google Business OAuth:', isGoogleBusinessOAuth);
      
      if (isGoogleBusinessOAuth) {
        // Save Google Business connection to database
        try {
          // Get user ID from state parameter or create a new user
          let userId = userInfo.id;
          if (state) {
            try {
              const stateData = JSON.parse(decodeURIComponent(state));
              userId = stateData.userId || userInfo.id;
            } catch (e) {
              console.log('Could not parse state, using user ID from userInfo');
            }
          }
          
          console.log('Saving Google Business connection for user:', userId);
          
          // Save to google_business_accounts table
          await this.dataSource.query(
            `INSERT INTO google_business_accounts (user_id, google_user_id, access_token, refresh_token, expires_at, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET 
               google_user_id = EXCLUDED.google_user_id,
               access_token = EXCLUDED.access_token,
               refresh_token = EXCLUDED.refresh_token,
               expires_at = EXCLUDED.expires_at,
               updated_at = NOW()`,
            [
              userId,
              userInfo.id,
              tokens.access_token,
              tokens.refresh_token,
              new Date(Date.now() + (tokens.expires_in * 1000))
            ]
          );
          
          console.log('Google Business connection saved to database');
        } catch (dbError) {
          console.error('Error saving Google Business connection to database:', dbError);
          // Continue with OAuth flow even if database save fails
        }
      }
      
      // Issue JWT
      const payload = {
        email: userInfo.email,
        sub: userInfo.id,
        name: userInfo.name,
        googleAccessToken: tokens.access_token, // Add Google access token to JWT
        hasGoogleBusiness: isGoogleBusinessOAuth, // Track if this is a Google Business connection
      };
      const jwt = this.jwtService.sign(payload);
      // Set JWT as httpOnly cookie
      res.cookie('jwt', jwt, { httpOnly: true });
      // Redirect to frontend dashboard with success status
      const frontendDomain = process.env.FRONTEND_URL || 'https://fursa-connect-frontend-production.up.railway.app';
      const redirectUrl = `${frontendDomain}/dashboard?google=connected`;
      console.log('Redirecting to frontend:', redirectUrl);
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error('OAuth error:', err);
      // Redirect to frontend dashboard with error status
      const frontendDomain = process.env.FRONTEND_URL || 'https://fursa-connect-frontend-production.up.railway.app';
      const redirectUrl = `${frontendDomain}/dashboard?google=error&message=${encodeURIComponent(err.message)}`;
      console.log('Redirecting to frontend error page:', redirectUrl);
      return res.redirect(redirectUrl);
    }
  }

  @Get('business-locations')
  async getBusinessLocations(@Res() res: Response, @Req() req: Request) {
    try {
      // Read JWT from cookie
      const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ error: 'Missing authentication token' });
      }
      // Decode JWT to get user info and Google access token
      const payload = this.jwtService.decode(token) as any;
      const googleAccessToken = payload?.googleAccessToken;
      if (!googleAccessToken) {
        return res.status(400).json({ error: 'No Google access token found in session. Please re-authenticate.' });
      }
      // Call Google Business Profile API to fetch locations
      const response = await axios.get('https://mybusinessbusinessinformation.googleapis.com/v1/accounts', {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });
      return res.json({ locations: response.data });
    } catch (err) {
      console.error('Error fetching business locations:', err?.response?.data || err);
      return res.status(500).json({ error: 'Failed to fetch business locations', details: err?.response?.data || err.message });
    }
  }

  @Get('get-token')
  async getGoogleToken(@Res() res: Response, @Req() req: Request) {
    try {
      const token = req.cookies['jwt'];
      if (!token) {
        return res.status(401).json({ error: 'Missing authentication token' });
      }
      const payload = this.jwtService.decode(token) as any;
      return res.json({ googleAccessToken: payload?.googleAccessToken });
    } catch (err) {
      console.error('Error getting Google access token:', err);
      return res.status(500).json({ error: 'Failed to get Google access token', details: err.message });
    }
  }
}
