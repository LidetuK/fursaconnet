import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SMERegistryService {
  constructor(private dataSource: DataSource) {}

  async createSME(data: any) {
    const query = `
      INSERT INTO sme_registry (
        name, company_name, phone_number, company_logo_url
      ) VALUES ($1, $2, $3, $4)
      RETURNING id, name, company_name, phone_number, company_logo_url, created_at
    `;
    const params = [
      data.name,
      data.companyName,
      data.phoneNumber,
      data.companyLogoUrl,
    ];
    const result = await this.dataSource.query(query, params);
    return result[0];
  }

  async getAllSMEs() {
    const query = 'SELECT * FROM sme_registry ORDER BY created_at DESC';
    const result = await this.dataSource.query(query);
    return result;
  }

  async updateSME(id: number, data: any) {
    const updateFields = [];
    const params = [];
    let paramIndex = 1;

    // Build dynamic update query
    if (data.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      params.push(data.name);
      paramIndex++;
    }
    if (data.company_name !== undefined) {
      updateFields.push(`company_name = $${paramIndex}`);
      params.push(data.company_name);
      paramIndex++;
    }
    if (data.phone_number !== undefined) {
      updateFields.push(`phone_number = $${paramIndex}`);
      params.push(data.phone_number);
      paramIndex++;
    }
    if (data.company_logo_url !== undefined) {
      updateFields.push(`company_logo_url = $${paramIndex}`);
      params.push(data.company_logo_url);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const query = `
      UPDATE sme_registry 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
    `;
    
    await this.dataSource.query(query, params);
  }

  async deleteSME(id: number) {
    await this.dataSource.query('DELETE FROM sme_registry WHERE id = $1', [id]);
  }
}
