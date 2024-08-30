// src/application/controllers/UploadController.ts
import { Request, Response } from 'express';
import { GeminiApiService } from '../../domain/services/GeminiApiService';
import { UserService } from '../../domain/services/UserService';
import { validateBase64, getCurrentMonth } from '../../shared/utils/validators';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export class UploadController {
  private geminiApiService: GeminiApiService;
  private userService: UserService;

  constructor(geminiApiService: GeminiApiService, userService: UserService) {
    this.geminiApiService = geminiApiService;
    this.userService = userService;
  }

  async uploadImage(req: Request, res: Response): Promise<Response> {
    try {
      const { image, customer_code, measure_datetime, measure_type } = req.body;

      if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Missing required fields',
        });
      }

      if (!validateBase64(image)) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Invalid base64 image format',
        });
      }

      if (!['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Invalid measure type. Must be WATER or GAS',
        });
      }

      const currentMonth = getCurrentMonth(measure_datetime);
      const existingMeasure = await this.userService.findMeasureByMonth(customer_code, currentMonth, measure_type);

      if (existingMeasure) {
        return res.status(409).json({
          error_code: 'DOUBLE_REPORT',
          error_description: 'Leitura do mês já realizada',
        });
      }

      const uploadDir = path.join(__dirname, '..', 'uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      let jpegBuffer: any

      const imageBuffer = Buffer.from(image.split('data:image/jpeg;base64,')[1], 'base64');
      const imagePath = path.join(uploadDir, `${customer_code}_${measure_datetime}.jpg`);

      jpegBuffer = await sharp(imageBuffer).raw().toFormat('jpeg').toBuffer();

      // Gravar o buffer de imagem JPEG no arquivo
      fs.writeFileSync(imagePath, jpegBuffer);
      // const filePath = path.resolve(path.join(imagePath))
      // console.log('filePath',filePath)
      // const fileUri = new URL(`file://${filePath}`).href
      const measurementDetails = await this.geminiApiService.extractMeasurementDetails(imagePath);
      
      return res.status(200).json({
        image_url: measurementDetails.image_url,
        measure_value: measurementDetails.measure_value,
        measure_uuid: measurementDetails.guid,
      });

    } catch (error: any) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: error.message });
    }
  }
}
