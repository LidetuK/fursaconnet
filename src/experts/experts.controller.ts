import { Controller, Post, UploadedFiles, UseInterceptors, Body, Get, Delete, Param, BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateExpertDto } from './dto/create-expert.dto';
import { ExpertsService } from './experts.service';
import { extname } from 'path';

@Controller('experts')
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Post()
  async createExpert(
    @Body() body: Record<string, any>
  ) {
    try {
      console.log('Received body:', body);
      // Parse expertise areas from JSON string
      let expertiseAreas: string[] = [];
      if (body.expertiseAreas) {
        try {
          expertiseAreas = JSON.parse(body.expertiseAreas);
        } catch (e) {
          expertiseAreas = [body.expertiseAreas as string];
        }
      }
      // Convert currentlyEmployed to boolean
      const currentlyEmployed = body.currentlyEmployed === 'yes';
      // Parse certifications from JSON string
      let certificationsUrl: string[] = [];
      if (body.certifications) {
        try {
          certificationsUrl = JSON.parse(body.certifications);
        } catch (e) {
          certificationsUrl = [];
        }
      }
      const expertData = {
        name: body.name,
        phoneNumber: body.phoneNumber,
        email: body.email,
        gender: body.gender,
        currentlyEmployed,
        contractType: body.contractType || null,
        expertiseAreas: JSON.stringify(expertiseAreas),
        experience: body.experience,
        certificationsUrl: JSON.stringify(certificationsUrl),
        passportPhotoUrl: body.passportPhoto || null,
      };
      console.log('Processed expert data:', expertData);
      await this.expertsService.createExpert(expertData);
      return { success: true, message: 'Expert registered successfully' };
    } catch (error) {
      console.error('Error creating expert:', error);
      throw new BadRequestException('Failed to create expert: ' + error.message);
    }
  }

  @Get()
  async getAllExperts() {
    try {
    const experts = await this.expertsService.getAllExperts();
    return { experts };
    } catch (error) {
      console.error('Error fetching experts:', error);
      throw new BadRequestException('Failed to fetch experts');
    }
  }

  @Delete(':id')
  async deleteExpert(@Param('id') id: number) {
    try {
    await this.expertsService.deleteExpert(id);
    return { success: true };
    } catch (error) {
      console.error('Error deleting expert:', error);
      throw new BadRequestException('Failed to delete expert');
    }
  }
} 