// src/infrastructure/http/routes/MeasurementRoutes.ts
import { Router } from 'express';
import { MeasurementController } from '../../../application/controllers/MeasurementController';
import { MeasurementService } from '../../../domain/services/MeasurementSevice';
import { MeasurementRepository } from '../../../domain/repositories/Measurementrepository';

const router = Router();
const measurementRepository = new MeasurementRepository();
const measurementService = new MeasurementService(measurementRepository);
const measurementController = new MeasurementController(measurementService);

router.patch('/confirm', (req, res) => measurementController.confirmMeasurement(req, res));

export default router;
