import { Router } from 'express';
import { UploadController } from '../../../application/controllers/UploadController';
import { GeminiApiService } from '../../../domain/services/GeminiApiService';
import { UserService } from '../../../domain/services/UserService';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import dbConnection from '../../database/connection';
import { ConsumptionRepository } from '../../../domain/repositories/ConsumptionRepository';

const router = Router();

const userRepository = new UserRepository(dbConnection);
const userService = new UserService(userRepository);
const geminiApiService = new GeminiApiService();
const consumptionRepository = new ConsumptionRepository();

const uploadController = new UploadController(geminiApiService, userService, consumptionRepository);

router.post('/upload', (req, res) => uploadController.uploadImage(req, res));

export default router;
