// src/application/controllers/MeasurementController.ts

import { Request, Response } from 'express';
import { MeasurementService } from '../../domain/services/MeasurementSevice';
import { MeasureRepository } from '../../domain/repositories/Measurementrepository';
import { responseHandler } from '../../shared/utils/responseHandler';

const measureRepository = new MeasureRepository();
const measurementService = new MeasurementService(measureRepository);

export const confirmMeasurement = async (req: Request, res: Response) => {
  try {
    const { measure_id, confirmed_value } = req.body;

    if (typeof measure_id !== 'number' || typeof confirmed_value !== 'number') {
      return responseHandler(res, 400, "INVALID_DATA", "measure_id deve ser um número e confirmed_value deve ser um número inteiro");
    }

    await measurementService.confirmMeasurement(measure_id, confirmed_value);
    responseHandler(res, 200, null, null, { success: true });

  } catch (error: any) {
    switch (error.message) {
      case "MEASURE_NOT_FOUND":
        responseHandler(res, 404, "MEASURE_NOT_FOUND", "Leitura não encontrada");
        break;
      case "CONFIRMATION_DUPLICATE":
        responseHandler(res, 409, "CONFIRMATION_DUPLICATE", "Leitura já confirmada");
        break;
      default:
        responseHandler(res, 500, "INTERNAL_ERROR", error.message);
    }
  }
};
