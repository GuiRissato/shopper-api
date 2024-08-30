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
const generative_ai_1 = require("@google/generative-ai");
const server_1 = require("@google/generative-ai/server");
const dotenv_1 = require("dotenv");
class GeminiApiService {
    constructor() {
        (0, dotenv_1.config)();
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }
    extractMeasurementDetails(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filename = `image${path.split('/')[5].toLowerCase().replace(/[^a-z0-9-]/g, '-').replace('t', '-').replace('-jpg', '')}.jpg`;
                const fileManager = new server_1.GoogleAIFileManager(this.apiKey);
                const uploadResponse = yield fileManager.uploadFile(path, {
                    displayName: filename,
                    mimeType: 'image/jpeg',
                });
                const genAI = new generative_ai_1.GoogleGenerativeAI(this.apiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-pro",
                });
                const getResponse = yield fileManager.getFile(uploadResponse.file.name);
                const result = yield model.generateContent([
                    {
                        fileData: {
                            mimeType: uploadResponse.file.mimeType,
                            fileUri: uploadResponse.file.uri,
                        }
                    },
                    { text: "Extract the measurement value from this image only the numbers." },
                ]);
                const measureValue = parseInt(result === null || result === void 0 ? void 0 : result.response.text().replace(/[^0-9]/g, '')) || 0;
                const guid = generateGUID();
                const imageUrl = uploadResponse.file.uri;
                return { measure_value: measureValue, guid, image_url: imageUrl };
            }
            catch (error) {
                throw new Error(`Failed to extract measurement details: ${error.message}`);
            }
        });
    }
}
exports.GeminiApiService = GeminiApiService;
function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
