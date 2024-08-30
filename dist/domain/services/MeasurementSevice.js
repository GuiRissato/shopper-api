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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasurementService = void 0;
class MeasurementService {
    constructor(measurementRepository) {
        this.measurementRepository = measurementRepository;
    }
    confirmMeasurement(measure_uuid, confirmed_value) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingMeasure = yield this.measurementRepository.findMeasureByUuid(measure_uuid);
            if (!existingMeasure) {
                return 'NOT_FOUND';
            }
            if (existingMeasure.hasConfirmed) {
                return 'ALREADY_CONFIRMED';
            }
            yield this.measurementRepository.confirmMeasure(measure_uuid, confirmed_value);
            return 'CONFIRMED';
        });
    }
}
exports.MeasurementService = MeasurementService;
