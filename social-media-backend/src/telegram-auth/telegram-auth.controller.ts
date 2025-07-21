import { Body, Controller, Post, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../users/social-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

// Simple in-memory store for demonstration (replace with DB in production)
const userTelegramChannels: Record<string, { chatId: string }> = {};

class ConnectTelegramDto {
  userId: string;
  chatId: string;
}

class SendTelegramMessageDto {
  userId: string;
  text: string;
}

@Controller('telegram')
export class TelegramAuthController {
  constructor(
    private readonly telegramService: TelegramAuthService,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepo: Repository<SocialAccount>,
    private readonly jwtService: JwtService,
  ) {}

  @Post('connect')
  async connect(@Body() body: ConnectTelegramDto) {
    // Store in memory for backward compatibility
    userTelegramChannels[body.userId] = { chatId: body.chatId };
    
    // Also store in database
    await this.socialAccountRepo.upsert({
      user_id: parseInt(body.userId, 10),
      platform: 'telegram',
      platform_user_id: body.chatId,
      screen_name: body.chatId,
      access_token: undefined,
      refresh_token: undefined,
      expires_at: undefined,
    }, ['user_id', 'platform']);
    
    return { success: true, message: 'Telegram channel connected.' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('disconnect')
  async disconnect(@Req() req: Request) {
    const userJwt: any = (req as any).user;
    if (!userJwt?.sub) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const userId = userJwt.sub;
    
    try {
      // Remove from memory
      delete userTelegramChannels[userId];
      
      // Remove from database
      const result = await this.socialAccountRepo.delete({ 
        user_id: parseInt(userId.toString(), 10), 
        platform: 'telegram' 
      });
      
      if (result.affected === 0) {
        return { success: false, error: 'No Telegram connection found' };
      }
      
      return { success: true, message: 'Telegram channel disconnected.' };
    } catch (error) {
      return { success: false, error: 'Failed to disconnect Telegram' };
    }
  }

  @Post('send')
  async send(@Body() body: SendTelegramMessageDto) {
    console.log('Telegram send request:', { 
      userId: body.userId, 
      textLength: body.text?.length 
    });
    
    const channel = userTelegramChannels[body.userId];
    console.log('Telegram channel found:', { 
      found: !!channel, 
      chatId: channel?.chatId 
    });
    
    if (!channel) {
      console.error('Telegram send: No channel connected for user:', body.userId);
      return { success: false, error: 'No Telegram channel connected for this user.' };
    }
    
    console.log('Telegram send: Attempting to send message to chatId:', channel.chatId);
    const result = await this.telegramService.sendMessage(channel.chatId, body.text);
    console.log('Telegram send result:', result);
    return result;
  }
} 