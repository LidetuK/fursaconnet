import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from './users/social-account.entity';

@Controller('auth/youtube')
export class YouTubeAuthController {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepo: Repository<SocialAccount>,
  ) {}

  @Get()
  async redirectToGoogle(@Req() req: Request, @Res() res: Response) {
    console.log('YouTube OAuth request received');
    console.log('Headers:', req.headers);
    console.log('Query params:', req.query);
    
    // Detect the current domain from request headers
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const currentDomain = `${protocol}://${host}`;
    console.log('Current domain detected:', currentDomain);
    
    // Check if user is authenticated via Authorization header
    const authHeader = req.headers.authorization;
    let userId: string | null = null;
    
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('Bearer token found, length:', token.length);
      try {
        const payload = this.jwtService.verify(token);
        userId = payload.sub;
        console.log('User ID from Bearer token:', userId);
      } catch (error) {
        console.error('Error verifying Bearer token:', error);
      }
    }
    
    // Check for token in query parameter
    if (!userId) {
      const queryToken = req.query.token as string;
      console.log('Query token:', queryToken ? 'Present' : 'Missing');
      if (queryToken) {
        try {
          const payload = this.jwtService.verify(queryToken);
          userId = payload.sub;
          console.log('User ID from query token:', userId);
        } catch (error) {
          console.error('Error verifying query token:', error);
        }
      }
    }
    
    // Fallback: try JWT cookie
    if (!userId) {
      const jwt = req.cookies['jwt'];
      console.log('JWT cookie:', jwt ? 'Present' : 'Missing');
      if (jwt) {
        try {
          const payload = this.jwtService.decode(jwt) as any;
          userId = payload?.sub;
          console.log('User ID from JWT cookie:', userId);
        } catch (error) {
          console.error('Error decoding JWT cookie:', error);
        }
      }
    }
    
    if (!userId) {
      console.log('No user ID found, redirecting to login');
      // Redirect to frontend domain since /signin is a frontend route
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/signin?message=Please login to connect YouTube`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Use the same pattern as Google OAuth for consistency
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'https://premium-promospace-production.up.railway.app/auth/google/callback';
    const scope = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload';
    const state = encodeURIComponent(JSON.stringify({ userId, platform: 'youtube' })); // Include user ID in state

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&state=${state}&prompt=consent`;

    console.log('YouTube OAuth URL:', authUrl);
    console.log('Redirect URI being used:', redirectUri);
    console.log('Redirecting to Google OAuth...');

    return res.redirect(authUrl);
  }

  @Get('debug')
  async debugConfig(@Res() res: Response) {
    const config = {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '***SET***' : '***NOT SET***',
      defaultRedirectUri: 'https://premium-promospace-production.up.railway.app/auth/google/callback',
      finalRedirectUri: process.env.YOUTUBE_REDIRECT_URI || 'https://premium-promospace-production.up.railway.app/auth/google/callback'
    };
    
    return res.json(config);
  }

  @Get('callback')
  async handleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;
    const scope = req.query.scope as string;
    const state = req.query.state as string;
    
    // Detect the current domain from request headers
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const currentDomain = `${protocol}://${host}`;
    console.log('Current domain detected in callback:', currentDomain);
    
    console.log('YouTube callback received');
    console.log('Code:', code ? 'Present' : 'Missing');
    console.log('Scope:', scope);
    console.log('State:', state);
    
    if (!code) {
      return res.status(400).send('Missing code');
    }

    // Extract user ID from state parameter
    let userId: string | null = null;
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state));
        console.log('Parsed state data:', stateData);
        userId = stateData.userId;
        console.log('User ID from state:', userId);
      } catch (error) {
        console.error('Error parsing state:', error);
      }
    }
    
    // Fallback: try to get user from JWT cookie
    if (!userId) {
      const jwt = req.cookies['jwt'];
      console.log('JWT cookie in callback:', jwt ? 'Present' : 'Missing');
      if (jwt) {
        try {
          const payload = this.jwtService.decode(jwt) as any;
          userId = payload?.sub;
          console.log('User ID from JWT cookie:', userId);
        } catch (error) {
          console.error('Error decoding JWT:', error);
        }
      }
    }
    
    // If still no user ID, redirect to login
    if (!userId) {
      console.log('No user ID found in callback, redirecting to signin');
      // Redirect to frontend domain since /signin is a frontend route
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/signin?message=Please login to connect YouTube`);
    }

    try {
      console.log('Exchanging code for tokens...');
      // 2. Exchange code for tokens
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.YOUTUBE_REDIRECT_URI || 'https://premium-promospace-production.up.railway.app/auth/google/callback',
          grant_type: 'authorization_code',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token, expires_in } = tokenRes.data;
      console.log('Tokens received successfully');

      // 3. Store tokens in social_accounts table
      await this.socialAccountRepo.upsert({
        user_id: parseInt(userId.toString(), 10), // Convert to number format
        platform: 'youtube',
        access_token,
        refresh_token,
        expires_at: new Date(Date.now() + expires_in * 1000),
      }, ['user_id', 'platform']);
      console.log('Tokens stored in database');

      // 4. Generate new JWT token to maintain session
      const payload = { sub: userId, email: userId }; // You might want to get actual email from user table
      const newToken = this.jwtService.sign(payload);
      
      // 5. Set JWT cookie to maintain authentication
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      const isLocalhost = frontendDomain.includes('localhost');
      
      res.cookie('jwt', newToken, {
        httpOnly: true,
        secure: !isLocalhost, // true in production, false in localhost
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        domain: isLocalhost ? undefined : '.skilllinkpremium.com' // Adjust domain as needed
      });
      
      console.log('JWT cookie set, redirecting to dashboard with success');
      
      // 6. Redirect to dashboard with success message and token
      return res.redirect(`${frontendDomain}/dashboard?youtube=connected&token=${encodeURIComponent(newToken)}`);
    } catch (err: any) {
      console.error('YouTube token exchange error:', err.response?.data || err.message);
      // Redirect to frontend domain since /dashboard is a frontend route
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/dashboard?youtube=error`);
    }
  }

  @Get('channel')
  async getChannelInfo(@Req() req: Request, @Res() res: Response) {
    // 1. Get user from JWT cookie
    const jwt = req.cookies['jwt'];
    if (!jwt) {
      return res.status(401).json({ error: 'Missing authentication token' });
    }
    const payload = this.jwtService.decode(jwt) as any;
    const userId = payload?.sub;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // 2. Get YouTube access token from social_accounts
    const account = await this.socialAccountRepo.findOne({ where: { user_id: userId, platform: 'youtube' } });
    if (!account || !account.access_token) {
      return res.status(400).json({ error: 'YouTube account not connected' });
    }
    const accessToken = account.access_token;

    try {
      // 3. Get channel info
      const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet,contentDetails,statistics',
          mine: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const channel = channelRes.data.items[0];
      if (!channel) {
        return res.status(404).json({ error: 'No channel found' });
      }
      // 4. Get recent videos (from uploads playlist)
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
      const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: 10,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const videos = videosRes.data.items;
      // 5. Return channel info and videos
      return res.json({ channel, videos });
    } catch (err: any) {
      console.error('YouTube API error:', err.response?.data || err.message);
      return res.status(500).json({ error: 'Failed to fetch YouTube data' });
    }
  }
} 