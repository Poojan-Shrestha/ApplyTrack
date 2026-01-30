import ImageKit from '@imagekit/nodejs';
import { imagekit } from '../config/imagekit';
import crypto from 'crypto';
import path from 'path';

export class ImageKitService {
  static async uploadFile(
    file: Express.Multer.File
  ): Promise<ImageKit.FileUploadResponse> {
    if (!file) {
      throw new Error('No file provided for upload');
    }

    try {
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
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw new Error('Failed to upload file to ImageKit');
    }
  }

  static async deleteFile(fileId: string): Promise<void> {
    if (!fileId) {
      throw new Error('File ID is required to delete file');
    }

    try {
      await imagekit.files.delete(fileId);
    } catch (error) {
      console.error('ImageKit delete error:', error);
      throw new Error('Failed to delete file from ImageKit');
    }
  }
}