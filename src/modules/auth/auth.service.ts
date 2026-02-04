import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/database';
import { User } from '../users/user.entity';
import { config } from '../../config/env';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(name: string, email: string, password: string) {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      stage_updated_at: new Date()
    });

    await this.userRepository.save(user);

    // Generate token
    const token = (jwt as any).sign(
      { userId: user.id }, 
      config.jwt.secret, 
      { expiresIn: config.jwt.expiresIn }
    );

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = (jwt as any).sign(
      { userId: user.id }, 
      config.jwt.secret, 
      { expiresIn: config.jwt.expiresIn }
    );

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }
}