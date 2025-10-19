import { IsString, IsEmail, IsEnum, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateExpertDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @IsBoolean()
  currentlyEmployed: boolean;

  @IsOptional()
  @IsString()
  contractType?: string;

  @IsArray()
  @IsString({ each: true })
  expertiseAreas: string[];

  @IsEnum(['less-than-1', '1-3', '4-5', '6-plus'])
  experience: 'less-than-1' | '1-3' | '4-5' | '6-plus';
} 