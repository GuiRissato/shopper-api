import pool from '../../../infrastructure/database/connection';
import { IMeasurementRepository } from './IMeasurementRepository';

export class MeasurementRepository implements IMeasurementRepository {
  async findMeasuresByCustomerCode(
    customerCode: string,
    measureType?: 'WATER' | 'GAS'
  ): Promise<Array<{
    uuid: string;
    created_at: Date;
    type: string;
    has_confirmed: boolean;
    image_url: string;
  }>> {
    let query = `
      SELECT c.uuid, c.created_at, c.type, c.has_confirmed, c.image_url
      FROM consumption as c
      INNER JOIN users as u on c.user_id = u.id 
      WHERE u.customer_code =  $1
    `;

    const values = [customerCode];

    if (measureType) {
      query += ` AND type = $2`;
      values.push(measureType.toLowerCase());
    }

    const { rows } = await pool.query(query, values);
    
    return rows;
  }

  async findMeasureByUuid(measure_uuid: string): Promise<any> {
    const query = 'SELECT * FROM consumption WHERE uuid = $1';
    const result = await pool.query(query, [measure_uuid]);
    return result.rows[0];
  }

  async confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<boolean> {
    const query = 'SELECT measure_value FROM consumption WHERE uuid = $1';
    const result = await pool.query(query, [measure_uuid]);
    const registered_value = result.rows[0].measure_value;
  
    if (registered_value === confirmed_value) {
      const updateQuery = 'UPDATE consumption SET has_confirmed = TRUE WHERE uuid = $1';
      await pool.query(updateQuery, [measure_uuid]);
      return true;
    } else {
      return false;
    }
  }
}
