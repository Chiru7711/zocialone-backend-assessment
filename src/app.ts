import express from 'express';
import cors from 'cors';
import { AuthController } from './modules/auth/auth.controller';
import { UserController } from './modules/users/user.controller';
import { ComplaintController } from './modules/complaints/complaint.controller';
import { authMiddleware } from './modules/auth/auth.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
const authController = new AuthController();
const userController = new UserController();
const complaintController = new ComplaintController();

// Public routes
app.post('/register', authController.register);
app.post('/login', authController.login);

// Protected routes
app.get('/user/details', authMiddleware, userController.getDetails);
app.post('/complaints', authMiddleware, complaintController.createComplaint);
app.patch('/complaints/:id/status', authMiddleware, complaintController.updateStatus);
app.get('/complaints/:id/metrics', authMiddleware, complaintController.getMetrics);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running successfully', status: 'OK', timestamp: new Date().toISOString() });
});

export default app;