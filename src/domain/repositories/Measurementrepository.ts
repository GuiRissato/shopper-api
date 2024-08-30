// src/domain/repositories/MeasurementRepository.ts
import pool from '../../infrastructure/database/connection';
import { IMeasurementRepository } from './IMeasurementRepository';

export class MeasurementRepository implements IMeasurementRepository {
  async findMeasureByUuid(measure_uuid: string): Promise<any> {
    const query = 'SELECT * FROM consumption WHERE uuid = $1';
    const result = await pool.query(query, [measure_uuid]);
    return result.rows[0];
  }

  async confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<void> {
    const query = 'UPDATE consumption SET measure_value = $1, has_confirmed = TRUE WHERE uuid = $2';
    await pool.query(query, [confirmed_value, measure_uuid]);
  }
}
