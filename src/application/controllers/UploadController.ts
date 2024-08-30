// src/application/controllers/UploadController.ts
import { Request, Response } from 'express';
import { GeminiApiService } from '../../domain/services/GeminiApiService';
import { UserService } from '../../domain/services/UserService';
import { ConsumptionRepository } from '../../domain/repositories/ConsumptionRepository';
import { validateBase64, getCurrentMonth } from '../../shared/utils/validators';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export class UploadController {
  private geminiApiService: GeminiApiService;
  private userService: UserService;
  private consumptionRepository: ConsumptionRepository;

  constructor(geminiApiService: GeminiApiService, userService: UserService, consumptionRepository: ConsumptionRepository) {
    this.geminiApiService = geminiApiService;
    this.userService = userService;
    this.consumptionRepository = consumptionRepository;
  }

  async uploadImage(req: Request, res: Response): Promise<Response> {
    try {
      const { image, customer_code, measure_datetime, measure_type } = req.body;

      const user = await this.userService.findUserByCustomerCode(customer_code);
    
      // Verificar se o usuário foi encontrado
      if (!user) {
        return res.status(404).json({
          error_code: 'USER_NOT_FOUND',
          error_description: 'Usuário não encontrado',
        });
      }
  
      const userId = user.id;

      // Validação dos dados recebidos
      if ((!image || !customer_code || !measure_datetime || !measure_type) || (!validateBase64(image)) || (!['WATER', 'GAS'].includes(measure_type.toUpperCase()))) {
        return res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
        });
      }

      const currentMonth = getCurrentMonth(measure_datetime);
      const existingMeasure = await this.userService.findMeasureByMonth(customer_code, currentMonth, measure_type.toUpperCase());

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
      
      const imageBuffer = Buffer.from(image.split('data:image/jpeg;base64,')[1], 'base64');
      const imagePath = path.join(uploadDir, `${customer_code}_${measure_datetime}.jpg`);

      const jpegBuffer = await sharp(imageBuffer).jpeg().toBuffer();
      fs.writeFileSync(imagePath, jpegBuffer);

      // Extração dos detalhes da medição usando o Gemini API
      const measurementDetails = await this.geminiApiService.extractMeasurementDetails(imagePath);

      // Salvar os dados no banco de dados
      await this.consumptionRepository.saveConsumption({
        user_id: userId,
        uuid: measurementDetails.guid,
        image_url: measurementDetails.image_url,
        measure_value: measurementDetails.measure_value,
        has_confirmed: false,
        type: measure_type.toLowerCase(),
      });

      // Resposta com os detalhes da imagem e medição
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
