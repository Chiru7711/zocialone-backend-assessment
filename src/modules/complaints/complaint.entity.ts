import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeUpdate } from 'typeorm';
import { ComplaintType, ComplaintStatus } from '../../utils/enums';
import { User } from '../users/user.entity';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: ComplaintType
  })
  complaint_type: ComplaintType;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.RAISED
  })
  status: ComplaintStatus;

  @Column({ type: 'jsonb' })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  status_updated_at: Date;

  @ManyToOne(() => User, user => user.complaints)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeUpdate()
  updateStatusTimestamp() {
    // This will be handled in service layer for better control
  }
}