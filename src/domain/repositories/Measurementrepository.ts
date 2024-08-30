// src/infrastructure/repositories/MeasureRepository.ts

import pool from '../../infrastructure/database/connection';
import { Measure } from '../../domain/entities/Measure';

export class MeasureRepository {
  async findById(id: number): Promise<Measure | null> {
    const result = await pool.query('SELECT * FROM consumption WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;

    const measureData = result.rows[0];
    return new Measure(
      measureData.id,
      measureData.user_id,
      measureData.image_url,
      measureData.measure_value,
      measureData.has_confirmed
    );
  }

  async save(measure: Measure): Promise<void> {
    await pool.query(
      'UPDATE consumption SET measure_value = $1, has_confirmed = $2, updated_at = NOW() WHERE id = $3',
      [measure.value, measure.hasConfirmed, measure.id]
    );
  }
}
