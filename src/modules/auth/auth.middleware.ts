import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { AppDataSource } from '../../config/database';
import { User } from '../users/user.entity';

// Extended Request to include user data
export interface AuthRequest extends Request {
  user?: User;
}

// JWT authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: number };
    const userRepository = AppDataSource.getRepository(User);
    
    // Get fresh user data
    const user = await userRepository.findOne({ 
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // Add user to request
    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};