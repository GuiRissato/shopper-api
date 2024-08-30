import pool from '../../infrastructure/database/connection';
import { IConsumptionRepository } from './IConsumptionRepository';

export class ConsumptionRepository implements IConsumptionRepository {
  async saveConsumption(consumptionData: {
    userId: number;
    imageUrl: string;
    measureValue: number;
    hasConfirmed: boolean;
    measureType: string; 
    measureDatetime: string;
  }): Promise<void> {
    const { userId, imageUrl, measureValue, hasConfirmed, measureType, measureDatetime } = consumptionData;
    

    const query = `
      INSERT INTO consumption (user_id, image_url, type, measure_value, has_confirmed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    await pool.query(query, [userId, imageUrl, measureType.toLowerCase(), measureValue, hasConfirmed, new Date(measureDatetime), new Date()]);
  }
}
