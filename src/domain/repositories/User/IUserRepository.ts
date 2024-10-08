import { User } from '../../models/User';

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>;
  findByCustomerCode(customer_code: string): Promise<User | null>;
  findMeasureByMonth(userId: number, month: number, measureType: 'WATER' | 'GAS'): Promise<any | null>;

}
