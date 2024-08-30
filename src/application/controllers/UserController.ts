// src/application/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../../domain/services/UserService';
import { User } from '../../domain/models/User';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, customer_code } = req.body;

      if (!name || !customer_code) {
        return res.status(400).json({ error: 'Name and customer code are required' });
      }

      const userData: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
        name,
        customer_code,
      };

      const user = await this.userService.createUser(userData);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }


}
