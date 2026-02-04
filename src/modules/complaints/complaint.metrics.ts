import { Complaint } from './complaint.entity';
import { calculateTimeDifference } from '../../utils/time';

export interface ComplaintMetrics {
  complaint_id: number;
  current_status: string;
  time_in_current_status_minutes: number;
  total_time_minutes: number;
}

export const calculateComplaintMetrics = (complaint: Complaint): ComplaintMetrics => {
  const now = new Date();
  
  return {
    complaint_id: complaint.id,
    current_status: complaint.status,
    time_in_current_status_minutes: calculateTimeDifference(complaint.status_updated_at, now),
    total_time_minutes: calculateTimeDifference(complaint.created_at, now)
  };
};