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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const validators_1 = require("../../shared/utils/validators");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp"));
class UploadController {
    constructor(geminiApiService, userService, consumptionRepository) {
        this.geminiApiService = geminiApiService;
        this.userService = userService;
        this.consumptionRepository = consumptionRepository;
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image, customer_code, measure_datetime, measure_type } = req.body;
                
                const user = yield this.userService.findUserByCustomerCode(customer_code);
                // Verificar se o usuário foi encontrado
                if (!user) {
                    return res.status(404).json({
                        error_code: 'USER_NOT_FOUND',
                        error_description: 'Usuário não encontrado',
                    });
                }
                const userId = user.id;
                // Validação dos dados recebidos
                if ((!image || !customer_code || !measure_datetime || !measure_type) || (!(0, validators_1.validateBase64)(image)) || (!['WATER', 'GAS'].includes(measure_type.toUpperCase()))) {
                    return res.status(400).json({
                        error_code: 'INVALID_DATA',
                        error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
                    });
                }
                const currentMonth = (0, validators_1.getCurrentMonth)(measure_datetime);
                const existingMeasure = yield this.userService.findMeasureByMonth(customer_code, currentMonth, measure_type.toUpperCase());
                if (existingMeasure) {
                    return res.status(409).json({
                        error_code: 'DOUBLE_REPORT',
                        error_description: 'Leitura do mês já realizada',
                    });
                }
                const uploadDir = path.join(__dirname, '..', 'uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const imageBuffer = Buffer.from(image.split('data:image/jpeg;base64,')[1], 'base64');
                const imagePath = path.join(uploadDir, `${customer_code}_${measure_datetime}.jpg`);
                const jpegBuffer = yield (0, sharp_1.default)(imageBuffer).jpeg().toBuffer();
                fs.writeFileSync(imagePath, jpegBuffer);
                // Extração dos detalhes da medição usando o Gemini API
                const measurementDetails = yield this.geminiApiService.extractMeasurementDetails(imagePath);
                // Salvar os dados no banco de dados
                yield this.consumptionRepository.saveConsumption({
                    userId: userId,
                    uuid: measurementDetails.guid,
                    imageUrl: measurementDetails.image_url,
                    measureValue: measurementDetails.measure_value,
                    hasConfirmed: false,
                    measureType: measure_type.toLowerCase(), // WATER ou GAS
                    measureDatetime: measure_datetime
                });
                // Resposta com os detalhes da imagem e medição
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
