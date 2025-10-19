import { Injectable } from '@nestjs/common';
import { CreateExpertDto } from './dto/create-expert.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ExpertsService {
  constructor(private dataSource: DataSource) {}

  async createExpert(data: any) {
    console.log('Creating expert with data:', data);
    
    // Save expert to the database using raw SQL
    const query = `
      INSERT INTO experts (
        name, phone_number, email, gender, currently_employed, contract_type, expertise_areas, experience, certifications_url, passport_photo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    
    const params = [
      data.name,
      data.phoneNumber,
      data.email,
      data.gender,
      data.currentlyEmployed,
      data.contractType || null,
      data.expertiseAreas, // This should be a JSON string
      data.experience,
      data.certificationsUrl,
      data.passportPhotoUrl,
    ];
    
    console.log('Query params:', params);
    
    try {
      await this.dataSource.query(query, params);
      console.log('Expert created successfully');
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getAllExperts() {
    const query = 'SELECT * FROM experts ORDER BY created_at DESC';
    const result = await this.dataSource.query(query);
    return result;
  }

  async deleteExpert(id: number) {
    await this.dataSource.query('DELETE FROM experts WHERE id = $1', [id]);
  }
} 
