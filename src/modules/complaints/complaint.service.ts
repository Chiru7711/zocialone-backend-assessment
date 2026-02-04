import { AppDataSource } from '../../config/database';
import { Complaint } from './complaint.entity';
import { ComplaintType, ComplaintStatus } from '../../utils/enums';
import { isValidTransition } from './complaint.transitions';
import { calculateComplaintMetrics } from './complaint.metrics';
import { NotificationService } from '../notifications/notification.service';

export class ComplaintService {
  private complaintRepository = AppDataSource.getRepository(Complaint);
  private notificationService = new NotificationService();

  async createComplaint(userId: number, complaintType: ComplaintType, metadata: any) {
    // Validate metadata based on complaint type
    this.validateComplaintMetadata(complaintType, metadata);

    const complaint = this.complaintRepository.create({
      user_id: userId,
      complaint_type: complaintType,
      metadata,
      status: ComplaintStatus.RAISED
    });

    await this.complaintRepository.save(complaint);
    return complaint;
  }

  async updateComplaintStatus(complaintId: number, newStatus: ComplaintStatus, userId: number) {
    const complaint = await this.complaintRepository.findOne({
      where: { id: complaintId, user_id: userId }
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    // Validate transition
    if (!isValidTransition(complaint.status, newStatus)) {
      throw new Error(`Invalid status transition from ${complaint.status} to ${newStatus}`);
    }

    // Update status and timestamp
    complaint.status = newStatus;
    complaint.status_updated_at = new Date();

    await this.complaintRepository.save(complaint);

    // Send notification for specific status changes
    if (newStatus === ComplaintStatus.IN_PROGRESS || newStatus === ComplaintStatus.RESOLVED) {
      await this.notificationService.sendComplaintStatusNotification(userId, complaint, newStatus);
    }

    return complaint;
  }

  async getComplaintMetrics(complaintId: number, userId: number) {
    const complaint = await this.complaintRepository.findOne({
      where: { id: complaintId, user_id: userId }
    });

    if (!complaint) {
      throw new Error('Complaint not found');
    }

    return calculateComplaintMetrics(complaint);
  }

  private validateComplaintMetadata(type: ComplaintType, metadata: any) {
    switch (type) {
      case ComplaintType.LIVE_DEMO:
        if (!metadata.preferred_date || !metadata.preferred_time) {
          throw new Error('preferred_date and preferred_time are required for live demo complaints');
        }
        break;
      case ComplaintType.TECHNICAL_ISSUE:
        if (!metadata.issue_description) {
          throw new Error('issue_description is required for technical issue complaints');
        }
        break;
      case ComplaintType.BILLING_ISSUE:
        if (!metadata.amount || !metadata.currency) {
          throw new Error('amount and currency are required for billing issue complaints');
        }
        break;
    }
  }
}