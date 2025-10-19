import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SMES } from '../users/smes.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SMES)
    private readonly smesRepository: Repository<SMES>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;
    const existing = await this.smesRepository.findOne({ where: { email } });
    if (existing) throw new BadRequestException('Email already registered');
    const hashed = await bcrypt.hash(password, 10);
    const smes = this.smesRepository.create({ email, password: hashed, company_name: name });
    await this.smesRepository.save(smes);
    return { message: 'Registration successful' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const smes = await this.smesRepository.findOne({ where: { email } });
    if (!smes) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, smes.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: smes.id, email: smes.email };
    console.log('Using JWT secret:', process.env.JWT_SECRET); // Debug log
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, user: { id: smes.id, email: smes.email, name: smes.company_name } };
  }
} 