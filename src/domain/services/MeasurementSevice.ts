import { MeasurementRepository } from '../repositories/Measurementrepository';

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
}
