import cron from 'node-cron';
import { OnboardingService } from './onboarding.service';
import { config } from '../../config/env';

export class OnboardingCron {
  private onboardingService = new OnboardingService();

  start() {
    // Run every 10 minutes (configurable via env)
    cron.schedule(config.cron.reminderSchedule, async () => {
      try {
        await this.onboardingService.processOnboardingReminders();
      } catch (error) {
        console.error('[CRON ERROR] Onboarding reminders failed:', error);
      }
    });

    console.log(`[CRON] Onboarding reminder cron started with schedule: ${config.cron.reminderSchedule}`);
  }
}