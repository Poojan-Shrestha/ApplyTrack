import { Response } from 'express';
import Resume from '../models/Resume.model';
import { ImageKitService } from '../services/imagekit.service';
import { GeminiService } from '../services/gemini.service';
import { AuthRequest } from '../middleware/auth.middleware';

// Upload resume -> POST /api/resumes/upload
export const uploadResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please upload a PDF resume',
      });
      return;
    }

    const result = await ImageKitService.uploadFile(req.file);

    const resume = await Resume.create({
      userId: req.user!._id,
      filename: result.name,
      originalFilename: req.file.originalname,
      fileUrl: result.url,
      fileId: result.fileId,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to upload resume',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Get all resumes -> GET /api/resumes
export const getResumes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resumes = await Resume.find({
      userId: req.user!._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: resumes,
      total: resumes.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to fetch resumes',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Delete resume -> DELETE /api/resumes/:id
export const deleteResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
      return;
    }

    await ImageKitService.deleteFile(resume.fileId);
    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to delete resume',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Analyze resume using AI -> POST /api/resumes/:id/analyze
export const analyzeResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
      return;
    }

    const response = await fetch(resume.fileUrl);
    const pdfBuffer = Buffer.from(await response.arrayBuffer());

    const analysis = await GeminiService.analyzeResumeWithPDF(pdfBuffer);

    resume.analysis = {
      ...analysis,
      analyzedAt: new Date(),
    };
    await resume.save();

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to analyze resume',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};

// Set resume as default -> PATCH /api/resumes/:id/default
export const setDefaultResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
      return;
    }

    //unset previous default resumes
    await Resume.updateMany(
      { userId: req.user!._id, isDefault: true },
      { isDefault: false }
    );

    resume.isDefault = true;
    await resume.save();

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to set default resume',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};