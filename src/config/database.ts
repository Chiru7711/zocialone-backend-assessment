import { DataSource } from 'typeorm';
import { config } from './env';
import { User } from '../modules/users/user.entity';
import { Complaint } from '../modules/complaints/complaint.entity';
import { Notification } from '../modules/notifications/notification.entity';

// Database connection setup
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  
  // Auto-create tables in development only
  synchronize: config.nodeEnv === 'development',
  
  // Show SQL queries in development
  logging: config.nodeEnv === 'development',
  
  // Register entity classes
  entities: [User, Complaint, Notification],
  migrations: [],
  subscribers: [],
});