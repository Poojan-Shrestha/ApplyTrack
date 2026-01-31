import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// STORAGE
const storage = multer.memoryStorage();

// FILE FILTER
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
  ];

  const allowedExtensions = ['.pdf'];
  const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

  if (!allowedMimes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    cb(new Error('Only PDF files are allowed'));
    return;
  }

  cb(null, true);
};

// BASE MULTER
const multerUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter,
});

export const uploadSingleFile = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const upload = multerUpload.single(fieldName);

    upload(req, res, (err) => {
      if (!err) return next();

      // Multer-specific errors
      if (err instanceof multer.MulterError) {
        let message = 'File upload error';

        if (err.code === 'LIMIT_FILE_SIZE') {
          message = 'File size exceeds 5MB limit';
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          message = 'Only one file is allowed';
        }

        return res.status(400).json({
          success: false,
          message,
        });
      }

      // Custom errors from fileFilter
      return res.status(400).json({
        success: false,
        message: 'Invalid file upload',
      });
    });
  };
};