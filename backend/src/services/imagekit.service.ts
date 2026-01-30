import ImageKit from '@imagekit/nodejs';
import { imagekit } from '../config/imagekit';
import crypto from 'crypto';
import path from 'path';

export class ImageKitService {
  static async uploadFile(file: Express.Multer.File): Promise<ImageKit.FileUploadResponse> {
    const randomId = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname).toLowerCase();
    const secureFilename = `${randomId}${extension}`;
    
    const base64File = file.buffer.toString('base64');
    
    return await imagekit.files.upload({
      file: base64File,
      fileName: secureFilename,
      folder: '/ApplyTrack/resumes',
      useUniqueFileName: false,
      tags: ['resume', 'ApplyTrack'],
    });
  }

  static async deleteFile(fileId: string): Promise<void> {
    await imagekit.files.delete(fileId);
  }
}