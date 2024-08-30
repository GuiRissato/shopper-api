import { Router } from 'express';
import { MeasurementController } from '../../../application/controllers/MeasurementController';
import { MeasurementService } from '../../../domain/services/MeasurementSevice';
import { MeasurementRepository } from '../../../domain/repositories/Measurement/Measurementrepository';

const router = Router();
const measurementRepository = new MeasurementRepository();
const measurementService = new MeasurementService(measurementRepository);
const measurementController = new MeasurementController(measurementService);

router.patch('/confirm', (req, res) => measurementController.confirmMeasurement(req, res));
router.get('/:customer_code/list', (req, res) => measurementController.listMeasures(req, res));

export default router;
