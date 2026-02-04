import { ComplaintStatus } from '../../utils/enums';

// Business rules for complaint status changes
export const ALLOWED_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  [ComplaintStatus.RAISED]: [ComplaintStatus.IN_PROGRESS],
  [ComplaintStatus.IN_PROGRESS]: [ComplaintStatus.WAITING_ON_USER, ComplaintStatus.RESOLVED],
  [ComplaintStatus.WAITING_ON_USER]: [ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED],
  [ComplaintStatus.RESOLVED]: [ComplaintStatus.CLOSED],
  [ComplaintStatus.CLOSED]: [] // Final state
};

// Check if status transition is allowed
export const isValidTransition = (from: ComplaintStatus, to: ComplaintStatus): boolean => {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
};