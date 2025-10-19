import { Controller, Get, Req, UseGuards, Delete, Param, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { SMES } from './smes.entity';
import { Repository } from 'typeorm';
import { SocialAccount } from './social-account.entity';

@Controller('user')
export class UsersController {
  constructor(
    @InjectRepository(SMES)
    private readonly smesRepository: Repository<SMES>,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepo: Repository<SocialAccount>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('social-accounts')
  async getSocialAccounts(@Req() req: Request) {
    // req.user is set by JwtStrategy
    const userJwt: any = (req as any).user;
    console.log('JWT payload in social accounts:', userJwt);
    
    if (!userJwt?.sub) {
      console.log('No userId found in JWT payload');
      return { accounts: [] };
    }
    
    try {
      // Convert userId to number format for database query (user_id is INTEGER in database)
      const userId = parseInt(userJwt.sub.toString(), 10);
      console.log('Querying social accounts for user ID:', userId);
      
      // Fetch all social accounts for the user
      const accounts = await this.socialAccountRepo.find({ where: { user_id: userId } });
      console.log('Found social accounts:', accounts);
      
      // Map to frontend format
      const mapped = accounts.map(acc => ({
        platform: acc.platform,
        platform_user_id: acc.platform_user_id,
        screen_name: acc.screen_name,
        metadata: acc.metadata,
      }));
      
      console.log('Mapped social accounts:', mapped);
      return { accounts: mapped };
    } catch (error) {
      console.error('Error fetching social accounts:', error);
      return { accounts: [] };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('social-accounts/twitter')
  async getTwitterAccount(@Req() req: Request) {
    // req.user is set by JwtStrategy
    const userJwt: any = (req as any).user;
    console.log('JWT payload in Twitter endpoint:', userJwt);
    
    if (!userJwt?.sub) {
      console.log('No userId found in JWT payload for Twitter');
      return { account: null };
    }
    
    try {
      // Convert userId to number format for database query
      const userId = parseInt(userJwt.sub.toString(), 10);
      console.log('Querying Twitter account for user ID:', userId);
      
      // Fetch Twitter account for the user
      const account = await this.socialAccountRepo.findOne({ 
        where: { user_id: userId, platform: 'twitter' } 
      });
      
      console.log('Found Twitter account:', account);
      
      if (!account) {
        return { account: null };
      }
      
      return { 
        account: {
          platform: account.platform,
          platform_user_id: account.platform_user_id,
          screen_name: account.screen_name,
          metadata: account.metadata,
        }
      };
    } catch (error) {
      console.error('Error fetching Twitter account:', error);
      return { account: null };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('social-accounts/youtube')
  async getYouTubeAccount(@Req() req: Request) {
    // req.user is set by JwtStrategy
    const userJwt: any = (req as any).user;
    console.log('JWT payload in YouTube endpoint:', userJwt);
    
    if (!userJwt?.sub) {
      console.log('No userId found in JWT payload for YouTube');
      return { account: null };
    }
    
    try {
      // Convert userId to string format for database query
      const userId = userJwt.sub.toString();
      console.log('Querying YouTube account for user ID:', userId);
      
      // Fetch YouTube account for the user
      const account = await this.socialAccountRepo.findOne({ 
        where: { user_id: userId, platform: 'youtube' } 
      });
      
      console.log('Found YouTube account:', account);
      
      if (!account) {
        return { account: null };
      }
      
      return { 
        account: {
          platform: account.platform,
          platform_user_id: account.platform_user_id,
          screen_name: account.screen_name,
          metadata: account.metadata,
          channelName: account.screen_name || 'YouTube Channel'
        }
      };
    } catch (error) {
      console.error('Error fetching YouTube account:', error);
      return { account: null };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('social-accounts/linkedin')
  async getLinkedInAccount(@Req() req: Request) {
    // req.user is set by JwtStrategy
    const userJwt: any = (req as any).user;
    console.log('JWT payload in LinkedIn endpoint:', userJwt);
    
    if (!userJwt?.sub) {
      console.log('No userId found in JWT payload for LinkedIn');
      return { account: null };
    }
    
    try {
      // Convert userId to string format for database query
      const userId = userJwt.sub.toString();
      console.log('Querying LinkedIn account for user ID:', userId);
      
      // Fetch LinkedIn account for the user
      const account = await this.socialAccountRepo.findOne({ 
        where: { user_id: userId, platform: 'linkedin' } 
      });
      
      console.log('Found LinkedIn account:', account);
      
      if (!account) {
        return { account: null };
      }
      
      return { 
        account: {
          platform: account.platform,
          platform_user_id: account.platform_user_id,
          screen_name: account.screen_name,
          metadata: account.metadata,
          name: account.screen_name || 'LinkedIn Profile'
        }
      };
    } catch (error) {
      console.error('Error fetching LinkedIn account:', error);
      return { account: null };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('social-accounts/:platform')
  async disconnectSocialAccount(
    @Req() req: Request,
    @Param('platform') platform: string,
    @Res() res: Response
  ) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = userJwt.sub;
    try {
      const result = await this.socialAccountRepo.delete({ user_id: userId, platform });
      if (result.affected === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to disconnect account', details: err.message });
    }
  }
} 
