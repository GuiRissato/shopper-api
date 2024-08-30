export interface IConsumptionRepository {
    saveConsumption(consumptionData: {
      userId: number;
      imageUrl: string;
      measureValue: number;
      hasConfirmed: boolean;
      measureType: string; // "WATER" or "GAS"
      measureDatetime: string;
    }): Promise<void>;
  }