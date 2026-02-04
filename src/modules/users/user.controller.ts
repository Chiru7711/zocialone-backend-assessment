import { Request, Response } from 'express';
import { AuthRequest } from '../auth/auth.middleware';
import { UserService } from './user.service';

export class UserController {
  private userService = new UserService();

  getDetails = async (req: Request, res: Response) => {
    try {
      const userDetails = await this.userService.getUserDetails((req as AuthRequest).user!.id);
      res.json({ message: 'User details retrieved successfully', data: userDetails });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}