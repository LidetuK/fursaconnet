import { Controller, Get, Query, Res, Req, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { LinkedInAuthService } from './linkedin-auth.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SMES } from '../users/smes.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SocialAccount } from '../users/social-account.entity';

@Controller('auth/linkedin')
export class LinkedInAuthController {
  constructor(
    private readonly linkedinAuthService: LinkedInAuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(SMES)
    private readonly smesRepository: Repository<SMES>,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepo: Repository<SocialAccount>,
  ) {}

  @Get()
  async linkedinAuth(@Res() res: Response, @Req() req: Request) {
    // Generate a state parameter for CSRF protection (could be improved)
    const state = Math.random().toString(36).substring(2);
    // Optionally, store state in session/cookie for validation
    const url = this.linkedinAuthService.getLinkedInAuthUrl(state);
    return res.redirect(url);
  }

  @Get('callback')
  async linkedinAuthCallback(@Query('code') code: string, @Res() res: Response, @Req() req: Request) {
    if (!code) {
      return res.status(400).json({ error: 'Missing code' });
    }
    try {
      const tokens = await this.linkedinAuthService.getTokens(code);
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;
      const expiresIn = tokens.expires_in;
      const userInfo = await this.linkedinAuthService.getUserInfo(accessToken);
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
      // Update user with LinkedIn tokens and info
      await this.smesRepository.update(userId, {
        linkedinAccessToken: accessToken,
        linkedinRefreshToken: refreshToken,
        linkedinTokenExpiresAt: expiresIn ? Date.now() + expiresIn * 1000 : null,
        linkedinUserId: userInfo.sub,
      });
      // Upsert into social_accounts for LinkedIn
      await this.socialAccountRepo.upsert({
        user_id: parseInt(userId.toString(), 10),
        platform: 'linkedin',
        platform_user_id: userInfo.sub,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
        screen_name: userInfo.name || userInfo.localizedFirstName || '',
      }, ['user_id', 'platform']);
      // Redirect to dashboard or success page
      const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:8080';
      return res.redirect(`${frontendDomain}/dashboard#social`);
    } catch (err) {
      console.error('LinkedIn OAuth error:', err);
      return res.status(500).json({ error: 'OAuth failed', details: err.message });
    }
  }

  @Get('organizations')
  async getOrganizations(@Req() req: Request, @Res() res: Response) {
    try {
      const jwt = req.cookies['jwt'];
      if (!jwt) {
        return res.status(401).json({ error: 'Missing authentication token' });
      }
      const payload = this.jwtService.decode(jwt) as any;
      const userId = payload?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid session' });
      }
      // Get user's LinkedIn access token from user table
      const user = await this.smesRepository.findOne({ where: { id: userId } });
      if (!user || !user.linkedinAccessToken) {
        return res.status(400).json({ error: 'LinkedIn not connected' });
      }
      // Fetch organizations from LinkedIn API
      const orgRes = await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED', {
        headers: {
          Authorization: `Bearer ${user.linkedinAccessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      if (!orgRes.ok) {
        const err = await orgRes.text();
        return res.status(500).json({ error: 'Failed to fetch organizations', details: err });
      }
      const orgData = await orgRes.json();
      // Extract organization URNs
      const orgUrns = (orgData.elements || []).map((el: any) => el.organizationalTarget);
      // Optionally fetch org names
      let orgInfos = [];
      if (orgUrns.length > 0) {
        const ids = orgUrns.map((urn: string) => urn.split(':').pop()).join(',');
        const infoRes = await fetch(`https://api.linkedin.com/v2/organizations?ids=List(${ids})`, {
          headers: {
            Authorization: `Bearer ${user.linkedinAccessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        });
        if (infoRes.ok) {
          const infoData = await infoRes.json();
          orgInfos = orgUrns.map((urn: string) => {
            const id = urn.split(':').pop();
            const org = infoData.elements?.find((o: any) => o.id?.toString() === id);
            return { urn, id, name: org?.localizedName || '' };
          });
        } else {
          orgInfos = orgUrns.map((urn: string) => ({ urn, id: urn.split(':').pop(), name: '' }));
        }
      }
      return res.json({ organizations: orgInfos });
    } catch (err) {
      console.error('LinkedIn organizations fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch organizations', details: err.message });
    }
  }

  @Get('posts')
  async getLinkedInPosts(@Req() req: Request, @Res() res: Response) {
    try {
      const jwt = req.cookies['jwt'];
      if (!jwt) {
        return res.status(401).json({ error: 'Missing authentication token' });
      }
      const payload = this.jwtService.decode(jwt) as any;
      const userId = payload?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid session' });
      }
      const user = await this.smesRepository.findOne({ where: { id: userId } });
      if (!user || !user.linkedinAccessToken || !user.linkedinUserId) {
        return res.status(400).json({ error: 'LinkedIn not connected' });
      }
      // Fetch recent posts (UGC posts) from LinkedIn API
      const url = `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:${user.linkedinUserId})&sortBy=LAST_MODIFIED&count=10`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user.linkedinAccessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      if (!response.ok) {
        const err = await response.text();
        return res.status(500).json({ error: 'Failed to fetch LinkedIn posts', details: err });
      }
      const data = await response.json();
      return res.json({ posts: data.elements || [] });
    } catch (err) {
      console.error('LinkedIn posts fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch LinkedIn posts', details: err.message });
    }
  }

  @Post('post')
  @UseInterceptors(FilesInterceptor('images'))
  async postToLinkedIn(
    @Req() req: Request,
    @Body() body: { text: string; organizationUrn?: string },
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response
  ) {
    try {
      const jwt = req.cookies['jwt'];
      if (!jwt) {
        return res.status(401).json({ error: 'Missing authentication token' });
      }
      const payload = this.jwtService.decode(jwt) as any;
      const userId = payload?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Invalid session' });
      }
      const user = await this.smesRepository.findOne({ where: { id: userId } });
      if (!user || !user.linkedinAccessToken || !user.linkedinUserId) {
        return res.status(400).json({ error: 'LinkedIn not connected' });
      }
      // Determine author URN
      let authorUrn = '';
      if (req.body.organizationUrn) {
        authorUrn = req.body.organizationUrn;
      } else {
        authorUrn = `urn:li:person:${user.linkedinUserId}`;
      }
      await this.linkedinAuthService.postToLinkedInWithImages(
        user.linkedinAccessToken,
        authorUrn,
        body.text,
        files
      );
      return res.json({ success: true });
    } catch (err) {
      console.error('LinkedIn post error:', err);
      return res.status(500).json({ error: 'Failed to post to LinkedIn', details: err.message });
    }
  }
} 