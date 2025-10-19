import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          console.log('=== JWT STRATEGY - TOKEN EXTRACTION ===');
          console.log('Request URL:', request?.url);
          console.log('Request method:', request?.method);
          console.log('Request headers:', request?.headers);
          console.log('Request cookies:', request?.cookies);
          console.log('Authorization header:', request?.headers?.authorization);
          
          const jwtCookie = request?.cookies?.jwt;
          console.log('JWT cookie found:', jwtCookie ? 'Yes' : 'No');
          if (jwtCookie) {
            console.log('JWT cookie length:', jwtCookie.length);
            console.log('JWT cookie preview:', jwtCookie.substring(0, 20) + '...');
          }
          
          console.log('=== JWT STRATEGY - TOKEN EXTRACTION END ===');
          return jwtCookie;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_secret_12345',
    });
  }

  async validate(payload: any) {
    console.log('=== JWT STRATEGY VALIDATE ===');
    console.log('JWT payload received:', payload);
    console.log('Payload sub (user ID):', payload.sub);
    console.log('Payload email:', payload.email);
    
    // For now, just return the payload
    // You can add additional validation here if needed
    console.log('JWT validation successful');
    console.log('=== JWT STRATEGY VALIDATE END ===');
    return payload;
  }
} 
