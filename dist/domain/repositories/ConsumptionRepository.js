"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumptionRepository = void 0;
const connection_1 = __importDefault(require("../../infrastructure/database/connection"));
class ConsumptionRepository {
    saveConsumption(consumptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, uuid, image_url, measure_value, has_confirmed, type } = consumptionData;
            const query = `
      INSERT INTO consumption (user_id, uuid, image_url, type, measure_value, has_confirmed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
            yield connection_1.default.query(query, [id, uuid, image_url, type.toLowerCase(), measure_value, has_confirmed, new Date(), new Date()]);
        });
    }
}
exports.ConsumptionRepository = ConsumptionRepository;
