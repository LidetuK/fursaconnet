import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SMERegistryService {
  constructor(private dataSource: DataSource) {}

  async createSME(data: any) {
    console.log('Creating SME with data:', data);
    
    // Save SME to the database using raw SQL
    const query = `
      INSERT INTO sme_registry (
        name, company_name, phone_number, company_logo_url
      ) VALUES ($1, $2, $3, $4)
    `;
    
    const params = [
      data.name,
      data.companyName,
      data.phoneNumber,
      data.companyLogoUrl,
    ];
    
    console.log('Query params:', params);
    
    try {
      await this.dataSource.query(query, params);
      console.log('SME created successfully');
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  async getAllSMEs() {
    const query = 'SELECT * FROM sme_registry ORDER BY created_at DESC';
    const result = await this.dataSource.query(query);
    return result;
  }

  async deleteSME(id: number) {
    await this.dataSource.query('DELETE FROM sme_registry WHERE id = $1', [id]);
  }
}
