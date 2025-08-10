import { Controller, Post, Body, BadRequestException, Get, Delete, Param, Patch } from '@nestjs/common';
import { SMERegistryService } from './sme-registry.service';

@Controller('sme_registry')
export class SMERegistryController {
  constructor(private readonly smeRegistryService: SMERegistryService) {}

  @Post()
  async createSME(
    @Body() body: Record<string, any>
  ) {
    try {
      console.log('Received SME registration body:', body);
      
      const smeData = {
        name: body.name,
        companyName: body.company_name,
        phoneNumber: body.phone_number,
        companyLogoUrl: body.company_logo_url || null,
      };
      
      console.log('Processed SME data:', smeData);
      const result = await this.smeRegistryService.createSME(smeData);
      return { success: true, message: 'SME registered successfully', id: result.id };
    } catch (error) {
      console.error('Error creating SME:', error);
      throw new BadRequestException('Failed to create SME: ' + error.message);
    }
  }

  @Get()
  async getAllSMEs() {
    try {
      const smes = await this.smeRegistryService.getAllSMEs();
      return { smes };
    } catch (error) {
      console.error('Error fetching SMEs:', error);
      throw new BadRequestException('Failed to fetch SMEs');
    }
  }

  @Patch(':id')
  async updateSME(
    @Param('id') id: number,
    @Body() body: Record<string, any>
  ) {
    try {
      console.log(`Updating SME ${id} with:`, body);
      await this.smeRegistryService.updateSME(id, body);
      return { success: true, message: 'SME updated successfully' };
    } catch (error) {
      console.error('Error updating SME:', error);
      throw new BadRequestException('Failed to update SME: ' + error.message);
    }
  }

  @Delete(':id')
  async deleteSME(@Param('id') id: number) {
    try {
      await this.smeRegistryService.deleteSME(id);
      return { success: true, message: 'SME deleted successfully' };
    } catch (error) {
      console.error('Error deleting SME:', error);
      throw new BadRequestException('Failed to delete SME: ' + error.message);
    }
  }
}
