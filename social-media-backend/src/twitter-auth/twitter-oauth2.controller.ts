import { Controller, Get, Req, Res, Query, UseGuards, Body, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../users/social-account.entity';
import { JwtService } from '@nestjs/jwt';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('auth/twitter2')
export class TwitterOAuth2Controller {
  constructor(
    private configService: ConfigService,
    @InjectRepository(SocialAccount)
    private socialAccountRepo: Repository<SocialAccount>,
    private jwtService: JwtService,
  ) {}

  // Helper: Generate PKCE code verifier and challenge
  private generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    return { codeVerifier, codeChallenge };
  }

  // Step 1: Start OAuth 2.0 flow
  @Get()
  async startAuth(@Req() req: Request, @Res() res: Response) {
    try {
      console.log('Starting Twitter OAuth flow...');
      
      const { codeVerifier, codeChallenge } = this.generatePKCE();
      
      // Store codeVerifier in cookie
      res.cookie('twitter_code_verifier', codeVerifier, { 
        httpOnly: true, 
        sameSite: 'lax', 
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000 // 10 minutes
      });
      
      const clientId = this.configService.get<string>('TWITTER_CLIENT_ID');
      const callbackUrl = this.configService.get<string>('TWITTER_CALLBACK_URL');
      
      if (!clientId || !callbackUrl) {
        console.error('Missing Twitter OAuth environment variables');
        return res.status(500).json({ 
          error: 'Twitter OAuth not configured',
          details: 'Missing environment variables'
        });
      }
      
      const state = crypto.randomBytes(16).toString('hex');
      const scope = [
        'tweet.read',
        'tweet.write',
        'users.read',
        'offline.access',
      ].join(' ');
      
      const authUrl =
        'https://twitter.com/i/oauth2/authorize' +
        `?response_type=code` +
        `&client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&state=${state}` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`;
      
      console.log('Redirecting to Twitter OAuth...');
      return res.redirect(authUrl);
    } catch (error) {
      console.error('Twitter OAuth start error:', error);
      return res.status(500).json({ 
        error: 'Failed to start Twitter OAuth',
        details: error.message 
      });
    }
  }

  // Step 2: Handle callback
  @Get('callback')
  async handleCallback(@Req() req: Request, @Res() res: Response, @Query() query: any) {
    try {
      console.log('Twitter callback received');
      
      const { code, state, error } = query;
      if (error) {
        console.error('Twitter OAuth error:', error);
        const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
        return res.redirect(`${frontendDomain}/dashboard?twitter=error&message=${encodeURIComponent(error)}`);
      }
      
      const codeVerifier = req.cookies['twitter_code_verifier'];
      if (!codeVerifier) {
        console.error('Missing PKCE code verifier');
        const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
        return res.redirect(`${frontendDomain}/dashboard?twitter=error&message=${encodeURIComponent('Missing code verifier')}`);
      }
      
      const clientId = this.configService.get<string>('TWITTER_CLIENT_ID');
      const clientSecret = this.configService.get<string>('TWITTER_CLIENT_SECRET');
      const callbackUrl = this.configService.get<string>('TWITTER_CALLBACK_URL');
      
      if (!clientId || !clientSecret || !callbackUrl) {
        console.error('Missing Twitter OAuth environment variables');
        const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
        return res.redirect(`${frontendDomain}/dashboard?twitter=error&message=${encodeURIComponent('OAuth not configured')}`);
      }
      
      // Exchange code for access token
      console.log('Exchanging code for access token...');
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const tokenRes = await axios.post('https://api.twitter.com/2/oauth2/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: callbackUrl,
          code_verifier: codeVerifier,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`,
          }
        }
      );
      
      console.log('Twitter tokens received successfully');
      
      // Get user ID from JWT
      const jwt = req.cookies['jwt'];
      if (!jwt) {
        console.error('Missing JWT cookie in Twitter callback');
        const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
        return res.redirect(`${frontendDomain}/signin?message=${encodeURIComponent('Please login to connect Twitter')}`);
      }
      
      const payload = this.jwtService.decode(jwt) as any;
      const userId = payload?.sub;
      if (!userId) {
        console.error('Invalid JWT payload in Twitter callback');
        const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
        return res.redirect(`${frontendDomain}/signin?message=${encodeURIComponent('Please login to connect Twitter')}`);
      }
      
      // Save tokens to database
      const userIdNumber = parseInt(userId.toString(), 10);
      console.log('Saving Twitter tokens for user ID:', userIdNumber);
      
      await this.socialAccountRepo.upsert({
        user_id: userIdNumber,
        platform: 'twitter',
        access_token: tokenRes.data.access_token,
        refresh_token: tokenRes.data.refresh_token,
        expires_at: tokenRes.data.expires_in ? new Date(Date.now() + tokenRes.data.expires_in * 1000) : undefined,
      }, ['user_id', 'platform']);
      
      console.log('Twitter tokens stored in database');
      
      // Clean up
      res.clearCookie('twitter_code_verifier');
      
      // Redirect to dashboard
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/dashboard?twitter=connected`);
    } catch (err: any) {
      console.error('Twitter callback error:', err.response?.data || err.message);
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/dashboard?twitter=error&message=${encodeURIComponent(err.message)}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testConnection(@Req() req: Request, @Res() res: Response) {
    const user: any = (req as any).user || {};
    const userId = parseInt(user.sub.toString(), 10);
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    
    const account = await this.socialAccountRepo.findOne({
      where: { user_id: userId, platform: 'twitter' },
    });
    
    if (account && account.access_token) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('post')
  @UseInterceptors(FilesInterceptor('images', 4)) // Twitter allows up to 4 images
  async postTweet(
    @Req() req: Request, 
    @Body() body: { text: string }, 
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response
  ) {
    const user: any = (req as any).user || {};
    const userId = parseInt(user.sub.toString(), 10);
    
    console.log('Twitter post request:', { 
      userId, 
      textLength: body.text?.length,
      hasFiles: files?.length > 0,
      fileCount: files?.length || 0
    });
    
    if (!userId) {
      console.error('Twitter post: Not authenticated');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const account = await this.socialAccountRepo.findOne({
      where: { user_id: userId, platform: 'twitter' },
    });
    
    console.log('Twitter account found:', { 
      found: !!account, 
      hasToken: !!account?.access_token,
      userId: account?.user_id 
    });
    
    if (!account || !account.access_token) {
      console.error('Twitter post: Account not connected or no access token');
      return res.status(400).json({ error: 'Twitter account not connected' });
    }
    
    try {
      console.log('Twitter post: Attempting to post to Twitter API');
      
      // First, let's check if the token is still valid by getting user info
      const userInfoRes = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${account.access_token}`,
        },
      });
      
      console.log('Twitter user info response:', userInfoRes.data);
      
      // Handle image uploads if present
      if (files && files.length > 0) {
        console.log('Twitter post: Uploading images first');
        
        // Upload images to Twitter media API
        const mediaIds: string[] = [];
        for (const file of files) {
          try {
            // Convert file to base64
            const base64Data = file.buffer.toString('base64');
            
            // Upload to Twitter media API
            const mediaRes = await axios.post(
              'https://upload.twitter.com/1.1/media/upload.json',
              {
                media_data: base64Data
              },
              {
                headers: {
                  'Authorization': `Bearer ${account.access_token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            
            console.log('Twitter media upload response:', mediaRes.data);
            if (mediaRes.data.media_id_string) {
              mediaIds.push(mediaRes.data.media_id_string);
            }
          } catch (mediaError: any) {
            console.error('Twitter media upload error:', mediaError.response?.data || mediaError.message);
            throw new Error(`Failed to upload image: ${mediaError.response?.data?.errors?.[0]?.message || mediaError.message}`);
          }
        }
        
        // Post tweet with media
        const tweetRes = await axios.post(
          'https://api.twitter.com/2/tweets',
          {
            text: body.text,
            media: {
              media_ids: mediaIds
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${account.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log('Twitter post with media: Success response:', tweetRes.data);
        return res.json({ success: true, tweet: tweetRes.data });
      } else {
        // Text-only tweet
        const tweetRes = await axios.post(
          'https://api.twitter.com/2/tweets',
          { text: body.text },
          {
            headers: {
              'Authorization': `Bearer ${account.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Twitter post: Success response:', tweetRes.data);
        return res.json({ success: true, tweet: tweetRes.data });
      }
    } catch (err: any) {
      console.error('Twitter post: API error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        headers: err.response?.headers
      });
      
      // Check if it's an authentication error
      if (err.response?.status === 401) {
        console.error('Twitter authentication failed - token may be expired or invalid');
        return res.status(401).json({ error: 'Twitter authentication failed - please reconnect your account' });
      }
      
      return res.status(500).json({ error: 'Failed to post tweet', details: err.response?.data || err.message });
    }
  }
} 