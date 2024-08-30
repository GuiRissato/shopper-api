// src/infrastructure/http/routes/UserRoutes.ts
import { Router } from 'express';
import { UserService } from '../../../domain/services/UserService';
import { UserController } from '../../../application/controllers/UserController';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import dbConnection from '../../database/connection';

const UserRouter = Router();
const userRepository = new UserRepository(dbConnection);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

UserRouter.post('/createUser', (req, res) => userController.createUser(req, res));

export default UserRouter;
