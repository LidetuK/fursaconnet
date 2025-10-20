import { Body, Controller, Post, Delete, Req, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../users/social-account.entity';
import { Post as PostEntity } from '../users/post.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { FilesInterceptor } from '@nestjs/platform-express';

class ConnectTelegramDto { userId: string; chatId: string; }
class SendTelegramMessageDto { userId: string; text: string; }
const userTelegramChannels: Record<string, { chatId: string }> = {};

@Controller('telegram')
export class TelegramAuthController {
  constructor(
    private readonly telegramService: TelegramAuthService,
    @InjectRepository(SocialAccount) private readonly socialAccountRepo: Repository<SocialAccount>,
    @InjectRepository(PostEntity) private readonly postRepo: Repository<PostEntity>,
    private readonly jwtService: JwtService,
  ) {}

  @Post('connect')
  async connect(@Body() body: ConnectTelegramDto) {
    console.log('=== TELEGRAM CONNECT BACKEND DEBUG ===');
    console.log('Received body:', body);
    console.log('User ID from body:', body.userId);
    console.log('Chat ID from body:', body.chatId);
    console.log('=== TELEGRAM CONNECT BACKEND DEBUG END ===');
    
    const userIdString = body.userId.toString();
    userTelegramChannels[userIdString] = { chatId: body.chatId };
    await this.socialAccountRepo.upsert({ user_id: parseInt(body.userId, 10), platform: 'telegram', platform_user_id: body.chatId, screen_name: body.chatId }, ['user_id', 'platform']);
    return { success: true, message: 'Telegram channel connected.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateChannel(@Body() body: ConnectTelegramDto) {
    const result = await this.socialAccountRepo.update({ user_id: parseInt(body.userId, 10), platform: 'telegram' }, { platform_user_id: body.chatId, screen_name: body.chatId, updated_at: new Date() });
    if (result.affected === 0) return { success: false, error: 'No Telegram connection found to update' };
    userTelegramChannels[body.userId.toString()] = { chatId: body.chatId };
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

  @Post('test')
  async testConnection(@Body() body: { userId: string }) {
    if (!body.userId) return { success: false, error: 'Missing userId parameter' };
    const socialAccount = await this.socialAccountRepo.findOne({ where: { user_id: parseInt(body.userId, 10), platform: 'telegram' } });
    if (!socialAccount) return { success: false, error: 'No Telegram channel connected for this user.' };
    const result = await this.telegramService.getChatInfo(socialAccount.platform_user_id);
    return { success: true, chatInfo: result, message: 'Telegram connection is working properly.' };
  }

  @Post('send')
  @UseInterceptors(FilesInterceptor('images', 10))
  async send(@Body() body: SendTelegramMessageDto, @UploadedFiles() files: Express.Multer.File[]) {
    if (!body.userId || !body.text) return { success: false, error: 'Missing userId or text parameter' };
    const socialAccount = await this.socialAccountRepo.findOne({ where: { user_id: parseInt(body.userId, 10), platform: 'telegram' } });
    if (!socialAccount) return { success: false, error: 'No Telegram channel connected for this user.' };
    if (files && files.length > 0) return this.telegramService.sendMessageWithImages(socialAccount.platform_user_id, body.text, files);
    return this.telegramService.sendMessage(socialAccount.platform_user_id, body.text);
  }

  @Post('send-video')
  @UseInterceptors(FilesInterceptor('videos', 10))
  async sendVideo(@Body() body: { userId: string; caption?: string }, @UploadedFiles() files: Express.Multer.File[]) {
    if (!body.userId) return { success: false, error: 'Missing userId' };
    const socialAccount = await this.socialAccountRepo.findOne({ where: { user_id: parseInt(body.userId, 10), platform: 'telegram' } });
    if (!socialAccount) return { success: false, error: 'No Telegram channel connected' };
    if (!files || files.length === 0) return { success: false, error: 'No video files uploaded' };
    return this.telegramService.sendVideos(socialAccount.platform_user_id, body.caption, files);
  }
}