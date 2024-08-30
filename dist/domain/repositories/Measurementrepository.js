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
exports.MeasurementRepository = void 0;
// src/domain/repositories/MeasurementRepository.ts
const connection_1 = __importDefault(require("../../infrastructure/database/connection"));
class MeasurementRepository {
    findMeasureByUuid(measure_uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM consumption WHERE uuid = $1';
            const result = yield connection_1.default.query(query, [measure_uuid]);
            return result.rows[0];
        });
    }
    confirmMeasure(measure_uuid, confirmed_value) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE consumption SET measure_value = $1, has_confirmed = TRUE WHERE id = $2';
            yield connection_1.default.query(query, [confirmed_value, measure_uuid]);
        });
    }
}
exports.MeasurementRepository = MeasurementRepository;
