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
exports.MeasurementController = void 0;
class MeasurementController {
    constructor(measurementService) {
        this.measurementService = measurementService;
    }
    confirmMeasurement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { measure_uuid, confirmed_value } = req.body;
                // Validação dos dados de entrada
                if (!measure_uuid || typeof confirmed_value !== 'number') {
                    return res.status(400).json({
                        error_code: 'INVALID_DATA',
                        error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
                    });
                }
                // Chamar o serviço para confirmar a leitura
                const confirmationResult = yield this.measurementService.confirmMeasurement(measure_uuid, confirmed_value);
                if (confirmationResult === 'NOT_FOUND') {
                    return res.status(404).json({
                        error_code: 'MEASURE_NOT_FOUND',
                        error_description: 'Leitura não encontrada',
                    });
                }
                if (confirmationResult === 'ALREADY_CONFIRMED') {
                    return res.status(409).json({
                        error_code: 'CONFIRMATION_DUPLICATE',
                        error_description: 'Leitura do mês já realizada',
                    });
                }
                return res.status(200).json({ success: true });
            }
            catch (error) {
                return res.status(500).json({
                    error_code: 'INTERNAL_ERROR',
                    error_description: error.message,
                });
            }
        });
    }
}
exports.MeasurementController = MeasurementController;
