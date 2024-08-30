export interface IMeasurementRepository {
    findMeasureByUuid(measure_uuid: string): Promise<any>;
    confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<void>;
  }