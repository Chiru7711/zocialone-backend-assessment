import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OnboardingStage } from '../../utils/enums';
import { Complaint } from '../complaints/complaint.entity';
import { Notification } from '../notifications/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: OnboardingStage,
    default: OnboardingStage.STAGE_0
  })
  onboarding_stage: OnboardingStage;

  @Column({ nullable: true })
  last_reminder_sent: string;

  @Column({ type: 'timestamp', nullable: true })
  stage_updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Complaint, complaint => complaint.user)
  complaints: Complaint[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  // Virtual field for API response
  get complaints_count(): number {
    return this.complaints?.length || 0;
  }

  get onboarding_complete(): boolean {
    return this.onboarding_stage === OnboardingStage.STAGE_2;
  }
}