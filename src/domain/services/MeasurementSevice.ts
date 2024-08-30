import { MeasureRepository } from '../repositories/Measurementrepository';

export class MeasurementService {
  constructor(private measureRepository: MeasureRepository) {}

  async confirmMeasurement(id: number, confirmedValue: number): Promise<void> {
    const measure = await this.measureRepository.findById(id);

    if (!measure) {
      throw new Error("MEASURE_NOT_FOUND");
    }

    measure.confirmValue(confirmedValue);
    await this.measureRepository.save(measure);
  }
}
