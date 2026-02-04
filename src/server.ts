import 'reflect-metadata';
import app from './app';
import { config } from './config/env';
import { AppDataSource } from './config/database';
import { OnboardingCron } from './modules/onboarding/onboarding.cron';

async function startServer() {
  try {
    // Initialize database with retry logic for production
    let retries = 5;
    while (retries > 0) {
      try {
        await AppDataSource.initialize();
        console.log('✅ Database connected successfully');
        break;
      } catch (error) {
        console.log(`Database connection failed, retries left: ${retries - 1}`);
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // Start cron jobs only after database is connected
    const onboardingCron = new OnboardingCron();
    onboardingCron.start();

    // Start server
    const port = config.port;
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${port}/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();