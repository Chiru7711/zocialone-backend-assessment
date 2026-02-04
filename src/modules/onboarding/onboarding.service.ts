import { AppDataSource } from '../../config/database';
import { User } from '../users/user.entity';
import { OnboardingStage } from '../../utils/enums';
import { NotificationService } from '../notifications/notification.service';
import { addHours, addDays } from '../../utils/time';

/**
 * Handles onboarding reminders for users
 * Runs every 10 minutes via cron job
 */
export class OnboardingService {
  private userRepository = AppDataSource.getRepository(User);
  private notificationService = new NotificationService();

  // Main cron job function - processes all users
  async processOnboardingReminders() {
    console.log('[CRON] Processing onboarding reminders...');
    
    // Get users in stages 0, 1, 2 (not completed)
    const users = await this.userRepository.find({
      where: [
        { onboarding_stage: OnboardingStage.STAGE_0 },
        { onboarding_stage: OnboardingStage.STAGE_1 },
        { onboarding_stage: OnboardingStage.STAGE_2 }
      ]
    });

    // Process each user, continue if one fails
    // amazonq-ignore-next-line
    for (const user of users) {
      try {
        await this.processUserReminders(user);
      } catch (error) {
        console.error(`[CRON ERROR] Failed to process user ${user.id}:`, error);
      }
    }

    console.log(`[CRON] Processed ${users.length} users for onboarding reminders`);
  }

  // Check each user for due reminders
  private async processUserReminders(user: User) {
    const now = new Date();
    const stageStartTime = user.stage_updated_at || user.created_at;
    
    const reminderSchedule = this.getReminderSchedule(user.onboarding_stage);
    
    // Send only the next due reminder
    for (const reminder of reminderSchedule) {
      const reminderTime = this.calculateReminderTime(stageStartTime, reminder.delay);
      
      if (now >= reminderTime && !this.hasReminderBeenSent(user, reminder.key)) {
        await this.sendReminder(user, reminder.key);
        break; // Send only one reminder per run
      }
    }
  }

  // Get reminder schedule for each stage
  private getReminderSchedule(stage: OnboardingStage) {
    switch (stage) {
      case OnboardingStage.STAGE_0:
        return [
          { key: 'stage_0_day_1', delay: { days: 1 } },
          { key: 'stage_0_day_3', delay: { days: 3 } },
          { key: 'stage_0_day_5', delay: { days: 5 } }
        ];
      case OnboardingStage.STAGE_1:
        return [
          { key: 'stage_1_hour_12', delay: { hours: 12 } },
          { key: 'stage_1_day_1', delay: { days: 1 } }
        ];
      case OnboardingStage.STAGE_2:
        return [
          { key: 'stage_2_day_1', delay: { days: 1 } },
          { key: 'stage_2_day_2', delay: { days: 2 } },
          { key: 'stage_2_day_3', delay: { days: 3 } },
          { key: 'stage_2_day_5', delay: { days: 5 } }
        ];
      default:
        return [];
    }
  }

  private calculateReminderTime(startTime: Date, delay: { hours?: number; days?: number }): Date {
    let reminderTime = new Date(startTime);
    
    if (delay.hours) {
      reminderTime = addHours(reminderTime, delay.hours);
    }
    if (delay.days) {
      reminderTime = addDays(reminderTime, delay.days);
    }
    
    return reminderTime;
  }

  // Check if reminder already sent
  private hasReminderBeenSent(user: User, reminderKey: string): boolean {
    // amazonq-ignore-next-line
    return user.last_reminder_sent === reminderKey;
  }

  // Send reminder and update tracking
  private async sendReminder(user: User, reminderKey: string) {
    await this.notificationService.sendOnboardingReminder(user.id, user.onboarding_stage, reminderKey);
    
    user.last_reminder_sent = reminderKey;
    await this.userRepository.save(user);
    
    // amazonq-ignore-next-line
    console.log(`[REMINDER SENT] User ${user.id}: ${reminderKey}`);
  }
}