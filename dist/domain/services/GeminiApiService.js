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
exports.GeminiApiService = void 0;
// src/application/services/GeminiApiService.ts
const generative_ai_1 = require("@google/generative-ai");
class GeminiApiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }
    extractMeasurementDetails(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Instanciar o cliente da API do Google Generative AI com a chave de API correta
                const genAI = new generative_ai_1.GoogleGenerativeAI('AIzaSyD4WqZ4anPn-8x4erTAbeBAJDM3ZyTh5Gk');
                // Carregar o modelo que você deseja utilizar
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-pro", // Verifique o nome correto do modelo na documentação da API
                });
                // Realizar a chamada para a API com o caminho do arquivo JPEG
                const result = yield model.generateContent([
                    {
                        fileData: {
                            mimeType: "image/jpeg", // Mime type da imagem
                            fileUri: `file://${path}`, // Passar o caminho do arquivo JPEG temporário
                        }
                    },
                    { text: "Extract the measurement value from this image." }, // Prompt para a API
                ]);
                const measureValue = (result === null || result === void 0 ? void 0 : result.response.text) || 0; // Ajuste conforme a estrutura de resposta da API
                const guid = generateGUID();
                const imageUrl = generateTempLink(guid);
                return { measure_value: measureValue, guid, image_url: imageUrl };
            }
            catch (error) {
                throw new Error(`Failed to extract measurement details: ${error.message}`);
            }
        });
    }
}
exports.GeminiApiService = GeminiApiService;
// Funções utilitárias
function generateTempLink(guid) {
    return `https://example.com/temp-link/${guid}`;
}
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
