import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('=== JWT AUTH GUARD - CAN ACTIVATE ===');
    const request = context.switchToHttp().getRequest();
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    console.log('Request headers:', request.headers);
    console.log('Request cookies:', request.cookies);
    console.log('Authorization header:', request.headers?.authorization);
    console.log('JWT cookie:', request.cookies?.jwt);
    
    const result = super.canActivate(context);
    console.log('JWT Auth Guard result:', result);
    console.log('=== JWT AUTH GUARD - CAN ACTIVATE END ===');
    return result;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('=== JWT AUTH GUARD - HANDLE REQUEST ===');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);
    
    if (err) {
      console.log('JWT Auth Guard error:', err);
    }
    
    if (!user) {
      console.log('JWT Auth Guard: No user found');
    }
    
    const result = super.handleRequest(err, user, info, context);
    console.log('JWT Auth Guard handleRequest result:', result);
    console.log('=== JWT AUTH GUARD - HANDLE REQUEST END ===');
    return result;
  }
} 
