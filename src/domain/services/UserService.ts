// src/application/services/UserService.ts
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/models/User';

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData:  Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const existingUser = await this.userRepository.findByCustomerCode(userData.customer_code);
    if (existingUser) {
      throw new Error('Customer code already exists');
    }
    const user = await this.userRepository.create(userData);
    return user;
  }

  async findMeasureByMonth(customerCode: string, measureDatetime: number, measureType: 'WATER' | 'GAS'): Promise<any> {
    try {
      console.log(customerCode, measureDatetime, measureType)
      const user = await this.userRepository.findByCustomerCode(customerCode);
      if (!user) {
        throw new Error('User not found');
      }

      const date = new Date(measureDatetime);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; 

      const measure = await this.userRepository.findMeasureByMonth(user.id, month, measureType);
      console.log('measure',measure)
      return measure;
    } catch (error: any) {
      throw new Error(`Failed to find measure by month: ${error.message}`);
    }
  }

async findUserByCustomerCode(customerCode: string): Promise<User | null> {
  try {
    const user = await this.userRepository.findByCustomerCode(customerCode);
    return user;
  } catch (error: any) {
    throw new Error(`Erro ao buscar usuário por código de cliente: ${error.message}`);
  }
}



}
