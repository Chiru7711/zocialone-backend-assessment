import { AppDataSource } from '../../config/database';
import { User } from './user.entity';
import { OnboardingStage } from '../../utils/enums';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getUserDetails(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['complaints']
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      onboarding_stage: user.onboarding_stage,
      complaints_count: user.complaints.length,
      onboarding_complete: user.onboarding_complete
    };
  }

  async updateOnboardingStage(userId: number, stage: OnboardingStage) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    user.onboarding_stage = stage;
    user.stage_updated_at = new Date();
    user.last_reminder_sent = null; // Reset reminders for new stage

    await this.userRepository.save(user);
    return user;
  }
}