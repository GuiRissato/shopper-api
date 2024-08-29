// src/application/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../../domain/services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Outros métodos para lidar com requisições
}
