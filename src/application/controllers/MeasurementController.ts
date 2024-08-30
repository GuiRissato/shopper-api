// src/application/controllers/MeasurementController.ts
import { Request, Response } from 'express';
import { MeasurementService } from '../../domain/services/MeasurementSevice';

export class MeasurementController {
  private measurementService: MeasurementService;

  constructor(measurementService: MeasurementService) {
    this.measurementService = measurementService;
  }

  async confirmMeasurement(req: Request, res: Response): Promise<Response> {
    try {
      const { measure_uuid, confirmed_value } = req.body;

      // Validação dos dados de entrada
      if ( typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
        });
      }

      // Chamar o serviço para confirmar a leitura
      const confirmationResult = await this.measurementService.confirmMeasurement(measure_uuid, confirmed_value);

      if (confirmationResult === 'NOT_FOUND') {
        return res.status(404).json({
          error_code: 'MEASURE_NOT_FOUND',
          error_description: 'Leitura não encontrada',
        });
      }

      if (confirmationResult === 'ALREADY_CONFIRMED') {
        return res.status(409).json({
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Leitura do mês já realizada',
        });
      }

      return res.status(200).json({ success: true });

    } catch (error: any) {
      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: error.message,
      });
    }
  }

  async listMeasures(req: Request, res: Response): Promise<Response> {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    try {
      const measures = await this.measurementService.getMeasuresByCustomerCode(customer_code, measure_type as string);

      const formattedMeasures = measures.map(measure => ({
        measure_uuid: measure.uuid,
        measure_datetime: measure.created_at,
        measure_type: measure.type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
      }));

      return res.status(200).json({
        customer_code,
        measures: formattedMeasures,
      });
    } catch (error: any) {
      if (error.message === 'INVALID_TYPE') {
        return res.status(400).json({
          error_code: 'INVALID_TYPE',
          error_description: 'Tipo de medição não permitida',
        });
      } else if (error.message === 'MEASURES_NOT_FOUND') {
        return res.status(404).json({
          error_code: 'MEASURES_NOT_FOUND',
          error_description: 'Nenhuma leitura encontrada',
        });
      }

      return res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: 'Erro interno do servidor' });
    }
  }
}
