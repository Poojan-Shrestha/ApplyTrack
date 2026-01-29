import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in cookies (primary method)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // Fallback: Check Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Not authorized',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }
};