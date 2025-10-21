import { Body, Controller, Post, Delete, Req, UseGuards, UseInterceptors, UploadedFiles, Get } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../users/social-account.entity';
import { Post as PostEntity } from '../users/post.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { FilesInterceptor } from '@nestjs/platform-express';

class ConnectTelegramDto { chatId: string; }
class SendTelegramMessageDto { text: string; }
const userTelegramChannels: Record<string, { chatId: string }> = {};

@Controller('telegram')
@UseGuards(JwtAuthGuard)
export class TelegramAuthController {
  constructor(
    private readonly telegramService: TelegramAuthService,
    @InjectRepository(SocialAccount) private readonly socialAccountRepo: Repository<SocialAccount>,
    @InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>,
    private readonly jwtService: JwtService,
  ) {}

  @Get('test-jwt')
  @UseGuards(JwtAuthGuard)
  async testJwt(@Req() req: Request) {
    console.log('=== TELEGRAM JWT TEST ===');
    console.log('Request user:', (req as any).user);
    console.log('=== TELEGRAM JWT TEST END ===');
    return { success: true, user: (req as any).user };
  }

  @Post('connect')
  async connect(@Req() req: Request, @Body() body: ConnectTelegramDto) {
    try {
      console.log('=== TELEGRAM CONNECT DEBUG ===');
      console.log('Request URL:', req.url);
      console.log('Request method:', req.method);
      console.log('Request headers:', req.headers);
      console.log('Request cookies:', req.cookies);
      console.log('Request user:', (req as any).user);
      console.log('Body:', body);
      console.log('=== TELEGRAM CONNECT DEBUG END ===');
      
      const userJwt: any = (req as any).user;
      if (!userJwt || !userJwt.sub) {
        console.error('No user JWT found:', userJwt);
        return { success: false, error: 'Unauthorized - No user JWT found' };
      }
      
      const userId = parseInt(userJwt.sub.toString(), 10);
      if (!body?.chatId) return { success: false, error: 'Missing chatId' };

      console.log('=== TELEGRAM CONNECT SUCCESS ===');
      console.log('User ID from JWT:', userId);
      console.log('Chat ID from body:', body.chatId);
      console.log('=== TELEGRAM CONNECT SUCCESS END ===');

      const userIdString = userId.toString();
      userTelegramChannels[userIdString] = { chatId: body.chatId };
      await this.socialAccountRepo.upsert(
        { user_id: userId, platform: 'telegram', platform_user_id: body.chatId, screen_name: body.chatId },
        ['user_id', 'platform'],
      );
      return { success: true, message: 'Telegram channel connected.' };
    } catch (error) {
      console.error('Telegram connect error:', error);
      return { success: false, error: 'Failed to connect Telegram: ' + error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateChannel(@Req() req: Request, @Body() body: ConnectTelegramDto) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) return { success: false, error: 'Unauthorized' };
    const userId = parseInt(userJwt.sub.toString(), 10);
    if (!body?.chatId) return { success: false, error: 'Missing chatId' };
    const result = await this.socialAccountRepo.update(
      { user_id: userId, platform: 'telegram' },
      { platform_user_id: body.chatId, screen_name: body.chatId, updated_at: new Date() },
    );
    if (result.affected === 0) return { success: false, error: 'No Telegram connection found to update' };
    userTelegramChannels[userId.toString()] = { chatId: body.chatId };
    return { success: true, message: 'Telegram channel updated.' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('disconnect')
  async disconnect(@Req() req: Request) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) return { success: false, error: 'Unauthorized' };
    delete userTelegramChannels[userJwt.sub.toString()];
    const result = await this.socialAccountRepo.delete({ user_id: parseInt(userJwt.sub.toString(), 10), platform: 'telegram' });
    if (result.affected === 0) return { success: false, error: 'No Telegram connection found' };
    return { success: true, message: 'Telegram channel disconnected.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async testConnection(@Req() req: Request) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) return { success: false, error: 'Unauthorized' };
    const userId = parseInt(userJwt.sub.toString(), 10);
    const socialAccount = await this.socialAccountRepo.findOne({ where: { user_id: userId, platform: 'telegram' } });
    if (!socialAccount) return { success: false, error: 'No Telegram channel connected for this user.' };
    const result = await this.telegramService.getChatInfo(socialAccount.platform_user_id);
    return { success: true, chatInfo: result, message: 'Telegram connection is working properly.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('send')
  @UseInterceptors(FilesInterceptor('images', 10))
  async send(@Req() req: Request, @Body() body: SendTelegramMessageDto, @UploadedFiles() files: Express.Multer.File[]) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) return { success: false, error: 'Unauthorized' };
    if (!body.text) return { success: false, error: 'Missing text parameter' };
    const userId = parseInt(userJwt.sub.toString(), 10);
    const socialAccount = await this.socialAccountRepo.findOne({ where: { user_id: userId, platform: 'telegram' } });
    if (!socialAccount) return { success: false, error: 'No Telegram channel connected for this user.' };
    if (files && files.length > 0) return this.telegramService.sendMessageWithImages(socialAccount.platform_user_id, body.text, files);
    return this.telegramService.sendMessage(socialAccount.platform_user_id, body.text);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-video')
  @UseInterceptors(FilesInterceptor('videos', 10))
  async sendVideo(@Req() req: Request, @Body() body: { caption?: string }, @UploadedFiles() files: Express.Multer.File[]) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) return { success: false, error: 'Unauthorized' };
    const userId = parseInt(userJwt.sub.toString(), 10);
    const socialAccount = await this.socialAccountRepo.findOne({ where: { user_id: userId, platform: 'telegram' } });
    if (!socialAccount) return { success: false, error: 'No Telegram channel connected' };
    if (!files || files.length === 0) return { success: false, error: 'No video files uploaded' };
    return this.telegramService.sendVideos(socialAccount.platform_user_id, body.caption, files);
  }
}