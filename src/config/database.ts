import { DataSource } from 'typeorm';
import { config } from './env';
import { User } from '../modules/users/user.entity';
import { Complaint } from '../modules/complaints/complaint.entity';
import { Notification } from '../modules/notifications/notification.entity';

// Database connection setup
export const AppDataSource = new DataSource({
  type: 'postgres',
  // Use DATABASE_URL if available (production), otherwise individual config (development)
  ...(config.database.url ? 
    { url: config.database.url } : 
    {
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
    }
  ),
  
  synchronize: true, // Auto-create tables for demo
  logging: config.nodeEnv === 'development',
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  
  entities: [User, Complaint, Notification],
  migrations: [],
  subscribers: [],
});