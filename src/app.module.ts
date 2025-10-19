import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleAuthController } from './google-auth/google-auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { SMES } from './users/smes.entity';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { LinkedInAuthController } from './linkedin-auth/linkedin-auth.controller';
import { LinkedInAuthService } from './linkedin-auth/linkedin-auth.service';
import { UsersController } from './users/users.controller';
import { SocialAccount } from './users/social-account.entity';
import { Post } from './users/post.entity';
import { TwitterOAuth2Controller } from './twitter-auth/twitter-oauth2.controller';
import { GoogleAdsController } from './google-ads/google-ads.controller';
import { YouTubeAuthController } from './youtube-auth.controller';
import { TelegramAuthController } from './telegram-auth/telegram-auth.controller';
import { TelegramAuthService } from './telegram-auth/telegram-auth.service';
import { FacebookAuthController } from './facebook-auth/facebook-auth.controller';
import { FacebookAuthService } from './facebook-auth/facebook-auth.service';
import { InstagramAuthController } from './instagram-auth/instagram-auth.controller';
import { InstagramAuthService } from './instagram-auth/instagram-auth.service';
import { ExpertsModule } from './experts/experts.module';
import { SMERegistryModule } from './sme-registry/sme-registry.module';
import { PostsController } from './posts/posts.controller';
import { GoogleBusinessController } from './google-business/google-business.controller';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'dev_secret_12345'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [SMES, SocialAccount, Post],
        synchronize: false, // set to false in production!
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SMES, SocialAccount, Post]),
    AuthModule,
    ExpertsModule,
    SMERegistryModule,
    AnalyticsModule,
  ],
  controllers: [AppController, GoogleAuthController, LinkedInAuthController, UsersController, TwitterOAuth2Controller, GoogleAdsController, YouTubeAuthController, TelegramAuthController, FacebookAuthController, InstagramAuthController, PostsController, GoogleBusinessController],
  providers: [AppService, GoogleAuthService, LinkedInAuthService, TelegramAuthService, FacebookAuthService, InstagramAuthService],
})
export class AppModule {}
