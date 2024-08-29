import { User } from '../../domain/models/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: User): Promise<User> {
    const existingUser = await this.userRepository.findByCustomerCode(userData.customer_code);
    if (existingUser) {
      throw new Error('Customer code already exists');
    }
    const user = await this.userRepository.create(userData);
    return user;
  }

  // Outros métodos para lógica de negócios
}