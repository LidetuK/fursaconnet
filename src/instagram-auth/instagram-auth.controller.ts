import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { InstagramAuthService } from './instagram-auth.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../users/social-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auth/instagram')
export class InstagramAuthController {
  constructor(
    private readonly instagramAuthService: InstagramAuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepo: Repository<SocialAccount>,
  ) {}

  @Get()
  async instagramAuth(@Res() res: Response, @Req() req: Request) {
    // Instagram uses Facebook OAuth, so we redirect to Facebook OAuth with Instagram scopes
    const state = Math.random().toString(36).substring(2);
    const url = this.instagramAuthService.getInstagramAuthUrl(state);
    return res.redirect(url);
  }

  @Get('callback')
  async instagramAuthCallback(@Query('code') code: string, @Res() res: Response, @Req() req: Request) {
    if (!code) {
      return res.status(400).json({ error: 'Missing code' });
    }
    try {
      const tokens = await this.instagramAuthService.getTokens(code);
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      const expiresIn = tokens.expires_in;
      
      // Get user info from Facebook (Instagram uses Facebook OAuth)
      const userInfo = await this.instagramAuthService.getUserInfo(accessToken);
      
      // Get user's Facebook pages and their connected Instagram accounts
      const pages = await this.instagramAuthService.getUserPages(accessToken);
      const instagramAccounts = await this.instagramAuthService.getInstagramAccounts(accessToken);
      
      // Find user by JWT cookie
      const jwt = req.cookies['jwt'];
      if (!jwt) {
        return res.status(401).json({ error: 'Missing authentication token' });
      }
      const payload = this.jwtService.decode(jwt) as any;
      const userId = payload?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid session' });
      }

      // Store Instagram accounts
      for (const instagramAccount of instagramAccounts) {
        await this.socialAccountRepo.upsert({
          user_id: parseInt(userId.toString(), 10),
          platform: 'instagram',
          platform_user_id: instagramAccount.id,
          access_token: accessToken, // Use the same access token for now
          refresh_token: refreshToken,
          expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
          screen_name: instagramAccount.username || instagramAccount.name || '',
        }, ['user_id', 'platform', 'platform_user_id']);
      }

      // Set JWT as httpOnly cookie
      res.cookie('jwt', jwt, { httpOnly: true });
      // Redirect to dashboard - let frontend handle the routing
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/dashboard`);
    } catch (err) {
      console.error('Instagram OAuth error:', err);
      return res.status(500).json({ error: 'OAuth failed', details: err.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('accounts')
  async getInstagramAccounts(@Req() req: Request) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) {
      return { error: 'Unauthorized' };
    }

    try {
      const facebookAccount = await this.socialAccountRepo.findOne({
        where: {
          user_id: parseInt(userJwt.sub.toString(), 10),
          platform: 'facebook'
        }
      });

      if (!facebookAccount?.access_token) {
        return { error: 'Facebook not connected' };
      }

      const instagramAccounts = await this.instagramAuthService.getInstagramAccounts(facebookAccount.access_token);
      return { instagramAccounts };
    } catch (error) {
      console.error('Error fetching Instagram accounts:', error);
      return { error: 'Failed to fetch Instagram accounts' };
    }
  }
} 
