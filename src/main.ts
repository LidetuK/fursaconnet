import * as dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env file before anything else

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

console.log('Starting application...');
console.log('JWT_SECRET:', process.env.JWT_SECRET); // ✅ Should print the value now
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

async function bootstrap() {
  try {
    console.log('Creating NestJS application...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    console.log('Setting up middleware...');
    app.use(cookieParser());

    // Add request logging middleware
    app.use((req, res, next) => {
      console.log('=== INCOMING REQUEST ===');
      console.log('Method:', req.method);
      console.log('URL:', req.url);
      console.log('Headers:', req.headers);
      console.log('Cookies:', req.cookies);
      console.log('Origin:', req.headers.origin);
      console.log('=== REQUEST END ===');
      next();
    });

    // Serve static files from uploads directory
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    app.enableCors({
      origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'],
      credentials: true,
    });

    const port = process.env.PORT || 3000;
    console.log(`Attempting to listen on port: ${port}`);
    
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: http://localhost:${port}`);
    console.log('Application started successfully!');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error('Bootstrap failed:', error);
  process.exit(1);
});

// final push
