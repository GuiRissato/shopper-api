import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export class FileService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '..', '..', 'images');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveImage(base64Image: string, filename: string): Promise<string> {
    try {
      const base64Data = base64Image.split('data:image/jpeg;base64,')[1] || base64Image;
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const imagePath = path.join(this.uploadDir, `${filename}.jpg`);
        
      const jpegBuffer = await sharp(imageBuffer).toFormat('jpeg').toBuffer();
      fs.writeFileSync(imagePath, jpegBuffer);

      return imagePath;
    } catch (error: any) {
      console.error('Error saving image:', error.message);
      throw new Error('Failed to save image');
    }
  }

  getPublicUrl(filename: string): string {
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    return `http://${host}:${port}/images/${filename}.jpg`;
  }
}
