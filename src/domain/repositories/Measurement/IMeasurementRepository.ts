export interface IMeasurementRepository {
    findMeasureByUuid(measure_uuid: string): Promise<any>;
    confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<void>;
    findMeasuresByCustomerCode( customerCode: string, measureType?: 'WATER' | 'GAS' ): Promise<Array<{
      uuid: string;
      created_at: Date;
      type: string;
      has_confirmed: boolean;
      image_url: string;
    }>>;
  }