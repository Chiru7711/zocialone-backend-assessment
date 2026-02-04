import 'reflect-metadata';
import app from './app';
import { config } from './config/env';
import { AppDataSource } from './config/database';
import { OnboardingCron } from './modules/onboarding/onboarding.cron';

async function startServer() {
  try {
    // Initialize database
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    // Start cron jobs
    const onboardingCron = new OnboardingCron();
    onboardingCron.start();

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();