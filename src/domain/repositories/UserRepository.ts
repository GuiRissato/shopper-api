// src/domain/repositories/UserRepository.ts
import pool from '../../infrastructure/database/connection';
import { User } from '../models/User';

export class UserRepository {
  async create(user: User): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (name, customer_code) VALUES ($1, $2) RETURNING *`,
      [user.name, user.customer_code]
    );
    return result.rows[0];
  }

  async findByCustomerCode(customer_code: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT * FROM users WHERE customer_code = $1`,
      [customer_code]
    );
    return result.rows[0] || null;
  }

  // Outros métodos como update, delete, etc.
}
