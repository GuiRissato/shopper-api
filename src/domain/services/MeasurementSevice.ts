import { MeasurementRepository } from '../repositories/Measurement/Measurementrepository';

export class MeasurementService {
  private measurementRepository: MeasurementRepository;

  constructor(measurementRepository: MeasurementRepository) {
    this.measurementRepository = measurementRepository;
  }

  async confirmMeasurement(measure_uuid: string, confirmed_value: number): Promise<string> {
    const existingMeasure = await this.measurementRepository.findMeasureByUuid(measure_uuid);


    if (!existingMeasure) {
      return 'NOT_FOUND';
    }

    if (existingMeasure.has_confirmed) {
      return 'ALREADY_CONFIRMED';
    }

    await this.measurementRepository.confirmMeasure(measure_uuid, confirmed_value);
    return 'CONFIRMED';
  }

  async getMeasuresByCustomerCode(customerCode: string, measureType?: string) {
    if (measureType && !['WATER', 'GAS'].includes(measureType.toUpperCase())) {
      throw new Error('INVALID_TYPE');
    }

    const measures = await this.measurementRepository.findMeasuresByCustomerCode(
      customerCode,
      measureType ? measureType.toUpperCase() as 'WATER' | 'GAS' : undefined
    );

    if (measures.length === 0) {
      throw new Error('MEASURES_NOT_FOUND');
    }

    return measures;
  }
}
