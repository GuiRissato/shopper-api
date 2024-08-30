import pool from '../../infrastructure/database/connection';
import { IConsumptionRepository } from './IConsumptionRepository';
import { Consumption } from '../models/Consumption';

export class ConsumptionRepository implements IConsumptionRepository {
  async saveConsumption(consumptionData: 
    Omit<Consumption,'id' | 'created_at' | 'updated_at'>
  ): Promise<void> {
    const { user_id, uuid, image_url, measure_value, has_confirmed, type } = consumptionData;
    

    const query = `
      INSERT INTO consumption (user_id, uuid, image_url, type, measure_value, has_confirmed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await pool.query(query, [ user_id, uuid, image_url, type.toLowerCase(), measure_value, has_confirmed, new Date(), new Date()]);
  }
}
