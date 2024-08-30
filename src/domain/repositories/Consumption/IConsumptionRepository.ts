import { Consumption } from "../../models/Consumption";

export interface IConsumptionRepository {
    saveConsumption(consumptionData: Consumption): Promise<void>;
  }