import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : (process.env.DB_HOST || 'localhost'),
    port: process.env.DATABASE_URL ? parseInt(new URL(process.env.DATABASE_URL).port) : parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).username : (process.env.DB_USERNAME || 'postgres'),
    password: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).password : (process.env.DB_PASSWORD || ''),
    database: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).pathname.slice(1) : (process.env.DB_NAME || 'zocialone'),
  },
  
  jwt: {
    // WARNING: Use strong secret in production
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  cron: {
    // Cron schedule: every 10 minutes
    reminderSchedule: process.env.REMINDER_CRON_SCHEDULE || '*/10 * * * *',
  }
};