import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { FacebookAuthService } from './facebook-auth.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../users/social-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auth/facebook')
export class FacebookAuthController {
  constructor(
    private readonly facebookAuthService: FacebookAuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepo: Repository<SocialAccount>,
  ) {}

  @Get()
  async facebookAuth(@Res() res: Response, @Req() req: Request) {
    // Generate a state parameter for CSRF protection
    const state = Math.random().toString(36).substring(2);
    const url = this.facebookAuthService.getFacebookAuthUrl(state);
    return res.redirect(url);
  }

  @Get('callback')
  async facebookAuthCallback(@Query('code') code: string, @Res() res: Response, @Req() req: Request) {
    if (!code) {
      return res.status(400).json({ error: 'Missing code' });
    }
    try {
      const tokens = await this.facebookAuthService.getTokens(code);
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      const expiresIn = tokens.expires_in;
      
      // Get user info from Facebook
      const userInfo = await this.facebookAuthService.getUserInfo(accessToken);
      
      // Get user's Facebook pages
      const pages = await this.facebookAuthService.getUserPages(accessToken);
      
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

      // Store Facebook user account
      const existingAccount = await this.socialAccountRepo.findOne({
        where: { user_id: parseInt(userId.toString(), 10), platform: 'facebook' }
      });

      if (existingAccount) {
        await this.socialAccountRepo.update(
          { user_id: parseInt(userId.toString(), 10), platform: 'facebook' },
          {
            platform_user_id: userInfo.id,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
            screen_name: userInfo.name || userInfo.first_name || '',
          }
        );
      } else {
        await this.socialAccountRepo.save({
          user_id: parseInt(userId.toString(), 10),
          platform: 'facebook',
          platform_user_id: userInfo.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
          screen_name: userInfo.name || userInfo.first_name || '',
        });
      }

      // Store each Facebook page as a separate social account
      for (const page of pages) {
        const existingPage = await this.socialAccountRepo.findOne({
          where: { user_id: parseInt(userId.toString(), 10), platform: 'facebook_page', platform_user_id: page.id }
        });

        if (existingPage) {
          await this.socialAccountRepo.update(
            { user_id: parseInt(userId.toString(), 10), platform: 'facebook_page', platform_user_id: page.id },
            {
              access_token: page.access_token,
              refresh_token: refreshToken,
              expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
              screen_name: page.name || '',
            }
          );
        } else {
          await this.socialAccountRepo.save({
            user_id: parseInt(userId.toString(), 10),
            platform: 'facebook_page',
            platform_user_id: page.id,
            access_token: page.access_token,
            refresh_token: refreshToken,
            expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
            screen_name: page.name || '',
          });
        }
      }

      // Set JWT as httpOnly cookie
      res.cookie('jwt', jwt, { httpOnly: true });
      // Redirect to dashboard - let frontend handle the routing
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/dashboard`);
    } catch (err) {
      console.error('Facebook OAuth error:', err);
      return res.status(500).json({ error: 'OAuth failed', details: err.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('pages')
  async getUserPages(@Req() req: Request) {
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

      const pages = await this.facebookAuthService.getUserPages(facebookAccount.access_token);
      return { pages };
    } catch (error) {
      console.error('Error fetching Facebook pages:', error);
      return { error: 'Failed to fetch pages' };
    }
  }
} 
