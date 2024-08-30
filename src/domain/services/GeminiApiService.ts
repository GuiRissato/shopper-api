// src/application/services/GeminiApiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export class GeminiApiService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }
  
  async extractMeasurementDetails(path: string): Promise<{ measure_value: any; guid: string; image_url: string }> {
    try {
      console.log(path.split('/')[5])
      const filename = `image${path.split('/')[5].toLowerCase().replace(/[^a-z0-9-]/g, '-').replace('t', '-').replace('-jpg','')}.jpg`;
      
      const fileManager = new GoogleAIFileManager(this.apiKey);
      
      const uploadResponse = await fileManager.uploadFile(path,{
        displayName: filename,
        mimeType: 'image/jpeg',
      });

      const genAI = new GoogleGenerativeAI(this.apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro", 
      });

      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType, 
            fileUri: uploadResponse.file.uri,  
          }
        },
        { text: "Extract the measurement value from this image." },
      ]);

      const measureValue = result?.response.text() || 0;
      const guid = generateGUID();
      const imageUrl = generateTempLink(guid);

      return { measure_value: measureValue, guid, image_url: imageUrl };
    } catch (error: any) {
      throw new Error(`Failed to extract measurement details: ${error.message}`);
    }
  }
}

// Funções utilitárias
function generateTempLink(guid: string): string {
  return `https://example.com/temp-link/${guid}`;
}

function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
