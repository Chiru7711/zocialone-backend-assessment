import { AppDataSource } from '../../config/database';
import { Notification } from './notification.entity';
import { Complaint } from '../complaints/complaint.entity';
import { ComplaintStatus, OnboardingStage } from '../../utils/enums';

export class NotificationService {
  private notificationRepository = AppDataSource.getRepository(Notification);

  async sendComplaintStatusNotification(userId: number, complaint: Complaint, status: ComplaintStatus) {
    const { title, body } = this.getComplaintNotificationContent(complaint, status);
    
    const notification = this.notificationRepository.create({
      user_id: userId,
      title,
      body,
      is_sent: true
    });

    await this.notificationRepository.save(notification);
    
    // Mock email sending
    console.log(`[NOTIFICATION] ${title} → ${body}`);
    
    return notification;
  }

  async sendOnboardingReminder(userId: number, stage: OnboardingStage, reminderKey: string) {
    const { title, body } = this.getOnboardingReminderContent(stage, reminderKey);
    
    const notification = this.notificationRepository.create({
      user_id: userId,
      title,
      body,
      is_sent: true
    });

    await this.notificationRepository.save(notification);
    
    // Mock email sending
    console.log(`[ONBOARDING REMINDER] ${title} → ${body}`);
    
    return notification;
  }

  private getComplaintNotificationContent(complaint: Complaint, status: ComplaintStatus) {
    switch (status) {
      case ComplaintStatus.IN_PROGRESS:
        return {
          title: 'Your complaint is now being processed',
          body: `We've started working on your ${complaint.complaint_type} complaint (ID: ${complaint.id}). We'll keep you updated on the progress.`
        };
      case ComplaintStatus.RESOLVED:
        return {
          title: 'Your complaint has been resolved',
          body: `Great news! Your ${complaint.complaint_type} complaint (ID: ${complaint.id}) has been resolved. Please check your account for updates.`
        };
      default:
        return {
          title: 'Complaint status updated',
          body: `Your complaint (ID: ${complaint.id}) status has been updated to ${status}.`
        };
    }
  }

  private getOnboardingReminderContent(stage: OnboardingStage, reminderKey: string) {
    const stageMessages = {
      [OnboardingStage.STAGE_0]: {
        'stage_0_day_1': {
          title: 'Welcome to ZocialOne! Let\'s get started',
          body: 'Complete your profile setup to unlock powerful marketing tools for your business.'
        },
        'stage_0_day_3': {
          title: 'Don\'t miss out on growing your business',
          body: 'Thousands of businesses are already using ZocialOne. Complete your setup in just 2 minutes!'
        },
        'stage_0_day_5': {
          title: 'Your marketing potential is waiting',
          body: 'Final reminder: Complete your ZocialOne setup and start reaching more customers today.'
        }
      },
      [OnboardingStage.STAGE_1]: {
        'stage_1_hour_12': {
          title: 'Ready for the next step?',
          body: 'You\'re doing great! Let\'s connect your social media accounts to start creating content.'
        },
        'stage_1_day_1': {
          title: 'Connect your accounts to unlock full potential',
          body: 'Connect Instagram, Facebook, and LinkedIn to start managing all your social media from one place.'
        }
      },
      [OnboardingStage.STAGE_2]: {
        'stage_2_day_1': {
          title: 'Time to create your first campaign',
          body: 'Your accounts are connected! Create your first AI-powered marketing campaign now.'
        },
        'stage_2_day_2': {
          title: 'Your competitors are already ahead',
          body: 'Don\'t let your competition win. Launch your first campaign and start engaging customers.'
        },
        'stage_2_day_3': {
          title: 'Complete your ZocialOne journey',
          body: 'You\'re so close! Complete your onboarding and join 100,000+ successful businesses.'
        },
        'stage_2_day_5': {
          title: 'Last chance to complete setup',
          body: 'This is your final reminder. Complete your ZocialOne setup and transform your marketing today.'
        }
      }
    };

    return stageMessages[stage][reminderKey] || {
      title: 'ZocialOne Reminder',
      body: 'Continue your onboarding journey with ZocialOne.'
    };
  }
}