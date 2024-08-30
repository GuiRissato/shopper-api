"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UploadController = void 0;
const validators_1 = require("../../shared/utils/validators");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class UploadController {
    constructor(geminiApiService, userService) {
        this.geminiApiService = geminiApiService;
        this.userService = userService;
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image, customer_code, measure_datetime, measure_type } = req.body;
                if (!image || !customer_code || !measure_datetime || !measure_type) {
                    return res.status(400).json({
                        error_code: 'INVALID_DATA',
                        error_description: 'Missing required fields',
                    });
                }
                if (!(0, validators_1.validateBase64)(image)) {
                    return res.status(400).json({
                        error_code: 'INVALID_DATA',
                        error_description: 'Invalid base64 image format',
                    });
                }
                if (!['WATER', 'GAS'].includes(measure_type.toUpperCase())) {
                    return res.status(400).json({
                        error_code: 'INVALID_DATA',
                        error_description: 'Invalid measure type. Must be WATER or GAS',
                    });
                }
                const currentMonth = (0, validators_1.getCurrentMonth)(measure_datetime);
                const existingMeasure = yield this.userService.findMeasureByMonth(customer_code, currentMonth, measure_type);
                if (existingMeasure) {
                    return res.status(409).json({
                        error_code: 'DOUBLE_REPORT',
                        error_description: 'Leitura do mês já realizada',
                    });
                }
                const imageBuffer = Buffer.from(image, 'base64');
                const imagePath = path.join('app/dist/src/uploads/', `${customer_code}_${measure_datetime}.jpg`);
                fs.writeFileSync(imagePath, imageBuffer);
                const measurementDetails = yield this.geminiApiService.extractMeasurementDetails(imagePath);
                return res.status(200).json({
                    image_url: measurementDetails.image_url,
                    measure_value: measurementDetails.measure_value,
                    measure_uuid: measurementDetails.guid,
                });
            }
            catch (error) {
                return res.status(500).json({ error_code: 'INTERNAL_ERROR', error_description: error.message });
            }
        });
    }
}
exports.UploadController = UploadController;
