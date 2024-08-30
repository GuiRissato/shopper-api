// src/domain/repositories/UserRepository.ts
import dbConnection from '../../infrastructure/database/connection';
import { IUserRepository } from './IUserRepository';
import { User } from '../models/User';

export class UserRepository implements IUserRepository {

  private readonly db: typeof dbConnection;

  constructor(db: typeof dbConnection){
    this.db = db
  }
  
  async findMeasureByMonth(userId: number, year: number, month: number, measureType: 'WATER' | 'GAS'): Promise<any> {
    try {
      const tableName = measureType === 'WATER' ? 'water_consumption' : 'gas_consumption';
      const query = `
        SELECT * FROM ${tableName}
        WHERE user_id = $1 AND EXTRACT(YEAR FROM created_at) = $2 AND EXTRACT(MONTH FROM created_at) = $3
        LIMIT 1
      `;
      const result = await this.db.query(query, [userId, year, month]);
      return result.rows[0] || null;
    } catch (error: any) {
      throw new Error(`Failed to find measure by month: ${error.message}`);
    }
  }

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      const result = await this.db.query(
        `INSERT INTO users (name, customer_code) VALUES ($1, $2) RETURNING *`,
        [user.name, user.customer_code]
      );
      return result.rows[0];
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findByCustomerCode(customer_code: string): Promise<User | null> {
    try {
      const result = await this.db.query(
        `SELECT * FROM users WHERE customer_code = $1`,
        [customer_code]
      );
      return result.rows[0] || null;
    } catch (error: any) {
      throw new Error(`Failed to find user by customer code: ${error.message}`);
    }
  }

}