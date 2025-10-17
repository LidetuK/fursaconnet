import { Controller, Post, Get, Body, UnauthorizedException, Req, UseInterceptors, UploadedFile, BadRequestException, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService, 
    @InjectDataSource() private dataSource: DataSource
  ) {}

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('test-cookie')
  testCookie(@Res() res: Response) {
    console.log('=== TEST COOKIE ENDPOINT ===');
    const cookieOptions = {
      httpOnly: false,
      secure: false,
      sameSite: 'lax' as const, // Changed from 'none' to 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    
    console.log('Setting test cookie with options:', cookieOptions);
    res.cookie('test_cookie', 'test_value_123', cookieOptions);
    console.log('Test cookie set successfully');
    
    return res.json({ message: 'Test cookie set', cookieOptions });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    console.log('=== LOGIN ATTEMPT START ===');
    console.log('Login attempt:', { email: body.email, password: body.password ? '***provided***' : '***missing***' });
    console.log('Request headers:', res.req.headers);
    console.log('Request cookies:', res.req.cookies);
    
    try {
      // Try to find user in smes table (by email)
      const user = await this.dataSource.query(
        'SELECT * FROM smes WHERE email = $1',
        [body.email]
      );
      console.log('SME user search result:', user);

      if (user[0]) {
        // SME user found
        console.log('SME user found, checking password...');
        const valid = await bcrypt.compare(body.password, user[0].password);
        console.log('Password valid:', valid);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        
        const payload = { 
          sub: user[0].id, 
          email: user[0].email,
          company_name: user[0].company_name,
          is_admin: false,
          is_sme: true 
        };
        console.log('SME user JWT payload:', payload);
        
        const token = this.jwtService.sign(payload);
        console.log('SME user JWT token generated:', token ? 'Yes' : 'No');
        
        // Set JWT cookie - corrected settings for browser compatibility
        const cookieOptions = {
          httpOnly: false, // Allow JavaScript access for debugging
          secure: false, // Always false for now to avoid HTTPS issues
          sameSite: 'lax' as const, // Compatible with secure: false
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          // No domain restriction - let browser handle it
        };
        
        console.log('Setting JWT cookie with options:', cookieOptions);
        res.cookie('jwt', token, cookieOptions);
        console.log('JWT cookie set successfully');
        
        const response = {
          access_token: token,
          user: { 
            id: user[0].id, 
            email: user[0].email,
            company_name: user[0].company_name,
            is_admin: false,
            is_sme: true 
          }
        };
        console.log('Sending SME response:', response);
        console.log('=== LOGIN ATTEMPT END (SME) ===');
        return res.json(response);
      }

      console.log('=== LOGIN ATTEMPT END (FAILED - NO USER FOUND) ===');
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  @Post('register-sme')
  async registerSme(
    @Body() body: { email: string; company_name: string; password: string; company_logo: string }
  ) {
    const { email, company_name, password, company_logo } = body;
    if (!email || !company_name || !password || !company_logo) {
      throw new BadRequestException('All fields are required, including company_logo');
    }
    // Check if SME already exists
    const existing = await this.dataSource.query('SELECT * FROM smes WHERE email = $1', [email]);
    if (existing[0]) {
      throw new BadRequestException('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 10);
    await this.dataSource.query(
      'INSERT INTO smes (email, company_name, password, company_logo) VALUES ($1, $2, $3, $4)',
      [email, company_name, hashed, company_logo]
    );
    return { message: 'SME registration successful' };
  }

  @Get('smes')
  async getSmes() {
    const smes = await this.dataSource.query('SELECT id, email, company_name, company_logo FROM smes ORDER BY id DESC');
    return { smes };
  }

  @Delete('smes/:id')
  async deleteSme(@Param('id') id: number) {
    await this.dataSource.query('DELETE FROM smes WHERE id = $1', [id]);
    return { message: 'SME deleted successfully' };
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    return res.json({ message: 'Logged out successfully' });
  }

  @Get('ping')
  async ping(@Req() req: any) {
    console.log('=== PING ENDPOINT ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Request cookies:', req.cookies);
    console.log('Authorization header:', req.headers?.authorization);
    console.log('JWT cookie:', req.cookies?.jwt);
    
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
      hasAuthHeader: !!req.headers?.authorization,
      hasJwtCookie: !!req.cookies?.jwt,
      cookies: req.cookies,
      headers: {
        authorization: req.headers?.authorization,
        cookie: req.headers?.cookie
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: any) {
    try {
      console.log('=== /auth/me endpoint called ===');
      console.log('Request headers:', req.headers);
      console.log('Request cookies:', req.cookies);
      
      // req.user is set by JwtStrategy
      const userJwt: any = req.user;
      console.log('JWT payload in /auth/me:', userJwt);
      
      // Use sub as userId (this is the standard JWT field)
      const userId = userJwt?.sub || userJwt?.userId;
      console.log('User ID from JWT:', userId);
      
      if (!userId) {
        console.log('No userId found in JWT payload');
        throw new UnauthorizedException('Invalid token payload');
      }

      console.log('Looking up user with ID:', userId);

      // Check if it's an admin user
      if (userJwt.is_admin === true) {
        console.log('Checking admin_users table...');
        try {
        const adminUser = await this.dataSource.query(
          'SELECT id, username, is_admin FROM admin_users WHERE id = $1',
            [userId]
        );
          console.log('Admin user query result:', adminUser);
        if (adminUser[0]) {
            console.log('Admin user found:', adminUser[0]);
          return { user: adminUser[0] };
        }
        } catch (error) {
          console.error('Error querying admin_users table:', error);
        }
      }

      // Check if it's an SME user
      if (userJwt.is_sme === true) {
        console.log('Checking smes table...');
        try {
      const sme = await this.dataSource.query(
        'SELECT id, email, company_name FROM smes WHERE id = $1',
            [userId]
      );
          console.log('SME user query result:', sme);
      if (sme[0]) {
            console.log('SME user found:', sme[0]);
        return { user: { ...sme[0], is_sme: true } };
      }
        } catch (error) {
          console.error('Error querying smes table:', error);
        }
      }

      // Check if it's a regular user (default case)
      console.log('Checking users table...');
      try {
        const user = await this.dataSource.query(
          'SELECT id, email, name FROM users WHERE id = $1',
          [userId]
        );
        console.log('Regular user query result:', user);
        if (user[0]) {
          console.log('Regular user found:', user[0]);
          return { user: { ...user[0], is_admin: false } };
        }
      } catch (error) {
        console.error('Error querying users table:', error);
      }

      // If we get here, return the user data from JWT as fallback
      console.log('No user found in database, returning JWT data as fallback');
      return { 
        user: {
          id: userId,
          email: userJwt.email,
          username: userJwt.username,
          name: userJwt.name,
          company_name: userJwt.company_name,
          is_admin: userJwt.is_admin || false,
          is_sme: userJwt.is_sme || false
        }
      };
    } catch (error) {
      console.error('Error in /auth/me:', error);
      // Return a more specific error message
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Server error while fetching user data');
    }
  }
} 

//comment to test it out for twitter